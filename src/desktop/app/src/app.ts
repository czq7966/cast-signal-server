global["IsNode"] = true;
import electron = require('electron');
import * as windows from "./windows"
import * as Common from '../../common'
import { ADHOCCAST } from '../../common'
import { IPCMainSignaler } from '../../common/modules/ipc-main-signaler';

export interface IApp {
    appWindows: {[name: string]: windows.IBaseWindowClass}
    windows: {[name: string]: windows.IBaseWindow}
    ipcConnection: Common.Modules.IPCConnection;
    createWindows()
    destroyWindows()
    createWindow(name: string, iClass: windows.IBaseWindowClass)
    destroyWindow(name: string) 
    closeWinodw(id: string)
    minimizeWindow(id: string)
    maxmizeWindow(id: string)
}

export class App implements IApp {
    appWindows: {[name: string]: windows.IBaseWindowClass}
    windows: {[name: string]: windows.IBaseWindow}
    ipcConnection: Common.Modules.IPCConnection;
    constructor(appWindows: {[name: string] : windows.IBaseWindowClass}) {
        this.appWindows = appWindows;
        this.windows = {};
        this.ipcConnection = new Common.Modules.IPCConnection({
            signalerBase: "",
            namespace: "",
            instanceId: ADHOCCAST.Cmds.Common.Helper.uuid(),
            factorySignaler: IPCMainSignaler.TAG
        })
        this.init();
    }
    destroy() {
        this.uninit();
        this.ipcConnection.destroy();
        delete this.ipcConnection;
        delete this.windows;
    }
    init() {
        this.ipcConnection.dispatcher.eventRooter.onAfterRoot.add(this.onAfterRoot);
        this.initApp();
    }
    uninit() {
        this.unInitApp();
        this.ipcConnection.dispatcher.eventRooter.onAfterRoot.remove(this.onAfterRoot)
    }

    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;   
        switch(cmdId) {            
            case Common.Cmds.ECommandId.custom_window_close:
                this.closeWinodw(cmd.data.from.id);
                break;
            case Common.Cmds.ECommandId.custom_window_minimize:
                this.minimizeWindow(cmd.data.from.id);
                break;
            default:
                break;
        }     
    }  

    initApp() {
        electron.app.on('ready', () => {
            this.createWindows();
        })

        electron.app.on('window-all-closed', () => {
            // On macOS it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') electron.app.quit()
        })        
        electron.app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            this.createWindows()
        })

        if(electron.app.isReady()) {
            this.createWindows();
        }         
    }
    unInitApp() {
        this.destroyWindows();
    }

    createWindows() {     
        Object.keys(this.appWindows).forEach(name => {
            let windowClass = this.appWindows[name];
            this.createWindow(name, windowClass);            
        })
    }

    destroyWindows() {
        Object.keys(this.appWindows).forEach(name => {
            let windowClass = this.appWindows[name];
            this.destroyWindow(name);            
        })        
    }

    createWindow(name: string, iClass: windows.IBaseWindowClass) {     
        let window: windows.IBaseWindow;
        window = this.windows[name];
        if (!window || !(window.window)) {
            window = new iClass(this) as any;
            this.windows[name] = window;
            window.window.on('closed', () => {
                delete this.windows[name];
            })
        }
    }    
    destroyWindow(name: string) {
        let window: windows.IBaseWindow;
        window = this.windows[name];
        if (!!window ) {
            window.destroy();
            delete this.windows[name];
        }
    }

    closeWinodw(id: string) {
        let browserWindow = electron.BrowserWindow.fromId(parseInt(id));
        browserWindow && browserWindow.close();
    }
    minimizeWindow(id: string) {
        let browserWindow = electron.BrowserWindow.fromId(parseInt(id));
        browserWindow && browserWindow.minimize();
    }
    maxmizeWindow(id: string) {

    }
    restoreWindow(id: string) {

    }
}