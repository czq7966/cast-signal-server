global["IsNode"] = true;
import electron = require('electron');
import * as RenderWindows from "./windows"
import * as Common from '../../common'
import { ADHOCCAST } from '../../libex'

export interface IApp {
    windows: {[name: string]: RenderWindows.IBaseWindow}
    ipcConnection: Common.Modules.IPCConnection;
}

export class App implements IApp {
    windows: {[name: string]: RenderWindows.IBaseWindow}
    ipcConnection: Common.Modules.IPCConnection;
    constructor() {
        this.windows = {};
        this.ipcConnection = new Common.Modules.IPCConnection({
            signalerBase: "",
            namespace: "",
            instanceId: ADHOCCAST.Cmds.Common.Helper.uuid(),
            factorySignaler: Common.Modules.IPCMainSignaler.TAG
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
        this.initApp();
    }
    uninit() {
        this.unInitApp();
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
    }
    unInitApp() {
        this.destroyWindows();
    }

    createWindows() {     
        this.createWindow(RenderWindows.FloatWindow);
        // this.createWindow(RenderWindows.SendersWindow);
        this.createWindow(RenderWindows.BGWindow);
    }

    destroyWindows() {
        this.destroyWindow(RenderWindows.BGWindow);
        this.destroyWindow(RenderWindows.FloatWindow);
        this.destroyWindow(RenderWindows.SendersWindow);
    }

    createWindow(iClass: RenderWindows.IBaseWindowClass) {     
        let window: RenderWindows.IBaseWindow;
        window = this.windows[iClass.name];
        if (!window || !(window.window)) {
            window = new iClass(this) as any;
            this.windows[iClass.name] = window;
            window.window.on('closed', () => {
                delete this.windows[iClass.name];
            })
        }
    }    
    destroyWindow(iClass: RenderWindows.IBaseWindowClass) {
        let window: RenderWindows.IBaseWindow;
        window = this.windows[iClass.name];
        if (!!window ) {
            window.destroy();
            delete this.windows[iClass.name];
        }
    }
}