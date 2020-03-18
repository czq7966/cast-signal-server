import { EventEmitter } from 'events';
import { ADHOCCAST } from '../../../../../common/libex';
import { IIPCWinSignaler } from './ipc-win-signaler';

export interface IIPCBGSignaler extends ADHOCCAST.Network.ISignaler {
    ipcWinSignalers: Array<IIPCWinSignaler>;
    addIPCWinSignaler(signaler: IIPCWinSignaler)
    removeIPCWinSignaler(signaler: IIPCWinSignaler)
    onMessage(event: {sender: any}, arg: any)
}

export class IPCBGSignaler implements IIPCBGSignaler {
    static TAG = "desktop:receiver:single:ipc:bg:signaler";
    eventEmitter: EventEmitter;
    ipcWinSignalers: Array<IIPCWinSignaler>
    _url: string;


    constructor(url?: string) {
        this.eventEmitter = new EventEmitter();
        this._url = url;   
        this.ipcWinSignalers = [];
        this.initEvents();
    }
    destroy() {
        this.eventEmitter.removeAllListeners();        
        delete this.eventEmitter;
        delete this.ipcWinSignalers;
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

    onMessage(event: {sender: any}, arg: any) {
        this.eventEmitter.emit(ADHOCCAST.Cmds.CommandID, arg);
    }

    onDisconnect = (reason) => {
        this.eventEmitter.emit(ADHOCCAST.Dts.EClientSocketEvents.disconnect, reason);
    }


    sendCommand(cmd: any, target?: IIPCWinSignaler): Promise<any> {
        if (!!target) {
            target.onMessage({sender: this},  cmd)
        } else {
            this.ipcWinSignalers.forEach(signaler => {
                signaler && signaler.onMessage({sender: this}, cmd)                    
            })    
        }
        return Promise.resolve();
    }   

    addIPCWinSignaler(signaler: IIPCWinSignaler) {
        if (this.ipcWinSignalers.indexOf(signaler) < 0) {
            this.ipcWinSignalers.push(signaler);
        }
    }
    removeIPCWinSignaler(signaler: IIPCWinSignaler) {
        if (this.ipcWinSignalers.indexOf(signaler) >= 0) {
            this.ipcWinSignalers.splice(this.ipcWinSignalers.indexOf(signaler), 1);
        }       
    }
}

ADHOCCAST.Network.SignalerFactory.register(IPCBGSignaler.TAG, IPCBGSignaler);