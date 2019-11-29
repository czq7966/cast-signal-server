import { EventEmitter } from 'events';
import { ADHOCCAST } from './../../libex/index';

export interface IIPCRenderSignaler extends ADHOCCAST.Network.ISignaler {
    ipcRenderer: Electron.IpcRenderer;
}

export class IPCRenderSignaler implements IIPCRenderSignaler {
    static TAG = "desktop:receiver:ipc:render:signaler";
    eventEmitter: EventEmitter;
    ipcRenderer: Electron.IpcRenderer;
    _url: string;

    constructor(url?: string) {
        this.eventEmitter = new EventEmitter();
        this._url = url;   
        this.ipcRenderer = Electron.ipcRenderer;
        this.initEvents();
    }
    destroy() {
        this.eventEmitter.removeAllListeners();
        delete this.ipcRenderer;
        delete this.eventEmitter;
        this.unInitEvents();
    }
    initEvents() {
        this.ipcRenderer.addListener(ADHOCCAST.Cmds.CommandID, this.onMessage);
    }    
    unInitEvents() {
        this.ipcRenderer.removeListener(ADHOCCAST.Cmds.CommandID, this.onMessage);
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

    onMessage = (event, arg) => {
        this.eventEmitter.emit(ADHOCCAST.Cmds.CommandID, arg);
        console.log('1111111111111111111');
    }

    onDisconnect = (reason) => {
        this.eventEmitter.emit(ADHOCCAST.Dts.EClientSocketEvents.disconnect, reason);
    }


    sendCommand(cmd: any): Promise<any> {
        this.ipcRenderer.send(ADHOCCAST.Cmds.CommandID, cmd);
        return Promise.resolve();
    }   
}

ADHOCCAST.Network.SignalerFactory.register(IPCRenderSignaler.TAG, IPCRenderSignaler);