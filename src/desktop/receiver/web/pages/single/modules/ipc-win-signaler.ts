import { EventEmitter } from 'events';
import { ADHOCCAST } from '../../../../../common/libex';
import { IIPCBGSignaler } from './ipc-bg-signaler';


export interface IIPCWinSignaler extends ADHOCCAST.Network.ISignaler {
    ipcBG: IIPCBGSignaler
    onMessage(event: {sender: any}, arg: any) 
    setIPCBG(ipcBG: IIPCBGSignaler)
}

export class IPCWinSignaler implements IIPCWinSignaler {
    static TAG = "desktop:receiver:single:ipc:win:signaler";
    eventEmitter: EventEmitter;
    ipcBG: IIPCBGSignaler;
    _url: string;

    constructor(url?: string) {
        this.eventEmitter = new EventEmitter();
        this._url = url;   
        this.initEvents();
    }
    destroy() {
        this.eventEmitter.removeAllListeners();    
        this.ipcBG && this.ipcBG.removeIPCWinSignaler(this);    
        delete this.ipcBG;
        delete this.eventEmitter;
        this.unInitEvents();
    }
    initEvents() {
        
    }    
    unInitEvents() {
        
    }       
    id(): string {
        return null
    }
    getUrl(): string {
        return this._url;
    }
    setUrl(value: string) {
        this._url = value;
    }
    getIPCBG() {
        return this.ipcBG;
    }
    setIPCBG(ipcBG: IIPCBGSignaler) {
        this.ipcBG && this.ipcBG.removeIPCWinSignaler(this);
        this.ipcBG = ipcBG;
        this.ipcBG && this.ipcBG.addIPCWinSignaler(this);
    }

    connected(): boolean {
        return true;
    }
    connecting(): boolean {
        return false;
    }

    connect(url?: string): Promise<any> {
        return Promise.resolve();
 
    }
    disconnect() {

    }

    onMessage(event: {sender: any}, arg: any)  {
        if (!event || event.sender !== this) {   
            this.eventEmitter.emit(ADHOCCAST.Cmds.CommandID, arg);           
        }
    }

    onDisconnect = (reason) => {
        this.eventEmitter.emit(ADHOCCAST.Dts.EClientSocketEvents.disconnect, reason);
    }

    sendCommand(cmd: any, target?: IIPCWinSignaler): Promise<any> {
        if (!!target) {
            target.onMessage({sender: this},  cmd)
        } else {
            this.ipcBG.onMessage({sender: this}, cmd)    
        }
        return Promise.resolve();
    } 
}

ADHOCCAST.Network.SignalerFactory.register(IPCWinSignaler.TAG, IPCWinSignaler);