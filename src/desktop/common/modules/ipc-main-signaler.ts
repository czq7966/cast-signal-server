import { EventEmitter } from 'events';
import { ADHOCCAST } from '../libex';
import electron = require('electron');

export interface IIPCMainSignaler extends ADHOCCAST.Network.ISignaler {
    ipcMain: electron.IpcMain;
    renderWindows: Array<electron.BrowserWindow>;
    addRenderWindow(window: electron.BrowserWindow)
    removeRenderWindow(window: electron.BrowserWindow)
}

export class IPCMainSignaler implements IIPCMainSignaler {
    static TAG = "desktop:receiver:ipc:main:signaler";
    eventEmitter: EventEmitter;
    ipcMain: electron.IpcMain;
    renderWindows: Array<electron.BrowserWindow>;
    _url: string;


    constructor(url?: string) {
        this.eventEmitter = new EventEmitter();
        this._url = url;   
        this.ipcMain = electron.ipcMain;
        this.renderWindows = [];
        this.initEvents();
    }
    destroy() {
        this.eventEmitter.removeAllListeners();        
        delete this.ipcMain;
        delete this.eventEmitter;
        delete this.renderWindows;
        this.unInitEvents();
    }
    initEvents() {
        this.ipcMain.addListener(ADHOCCAST.Cmds.CommandID, this.onMessage);
    }    
    unInitEvents() {
        this.ipcMain.removeListener(ADHOCCAST.Cmds.CommandID, this.onMessage);
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
        let cmd = arg as  ADHOCCAST.Dts.ICommandData<any>;
        cmd.from = cmd.from || {}
        cmd.from.type = cmd.from.type || 'user';
        cmd.from.id = cmd.from.id || event.sender.id + "";
        this.eventEmitter.emit(ADHOCCAST.Cmds.CommandID, arg);
        this.renderWindows.forEach(renderWindow => {
            if (event.sender.webContents === renderWindow.webContents) {                

            } else {
                !!renderWindow && renderWindow.webContents.send(ADHOCCAST.Cmds.CommandID, arg)                    
            }
        })        
    }

    onDisconnect = (reason) => {
        this.eventEmitter.emit(ADHOCCAST.Dts.EClientSocketEvents.disconnect, reason);
    }


    sendCommand(cmd: any, targetWindow?: electron.BrowserWindow): Promise<any> {
        if (!!targetWindow) {
            targetWindow.webContents.send(ADHOCCAST.Cmds.CommandID, cmd)
        } else {
            this.renderWindows.forEach(renderWindow => {
                !!renderWindow && renderWindow.webContents.send(ADHOCCAST.Cmds.CommandID, cmd)
            })
        }
        return Promise.resolve();
    }   

    addRenderWindow(window: electron.BrowserWindow) {
        if (this.renderWindows.indexOf(window) < 0) {
            this.renderWindows.push(window);
        }
    }
    removeRenderWindow(window: electron.BrowserWindow) {
        if (this.renderWindows.indexOf(window) >= 0) {
            this.renderWindows.splice(this.renderWindows.indexOf(window), 1);
        }       
    }
}

ADHOCCAST.Network.SignalerFactory.register(IPCMainSignaler.TAG, IPCMainSignaler);