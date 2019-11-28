import electron = require('electron');
import { IApp } from '../app';
import * as Common from '../../../common'

export interface IBaseWindowConstructorOptions extends electron.BrowserWindowConstructorOptions {
    url?: string;
    file?: string;
    options?: electron.BrowserWindowConstructorOptions;
}

export interface IClass {
    new(...args: any[]) : Object
}

export interface IBaseWindowClass extends IClass {}

export interface IBaseWindow {
    app: IApp;
    options: IBaseWindowConstructorOptions;
    window: electron.BrowserWindow;    
    destroy()
    createWindow(options?: IBaseWindowConstructorOptions)
    destroyWindow()
}

export class BaseWindow implements IBaseWindow {
    app: IApp;
    options: IBaseWindowConstructorOptions;
    window: electron.BrowserWindow;
    constructor(app: IApp, options?: IBaseWindowConstructorOptions) {
        this.app = app;
        this.options = options || this.options;
    }
    destroy() {        
        delete this.app;
        delete this.options;
        delete this.window;
    }

    createWindow(options?: IBaseWindowConstructorOptions) {
        options = options || this.options;
        this.window = new electron.BrowserWindow(options.options);
        (this.app.ipcConnection.signaler as Common.IIPCMainSignaler).addRenderWindow(this.window);
        if (!!options.url) {
            this.window.loadURL(options.url);
        } else if (!!options.file) {
            this.window.loadFile(options.file);
        }     
        
        this.window.on('closed',  () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            (this.app.ipcConnection.signaler as Common.IIPCMainSignaler).removeRenderWindow(this.window);            
            this.window = null
        });        
    }
    destroyWindow() {
        (this.app.ipcConnection.signaler as Common.IIPCMainSignaler).removeRenderWindow(this.window);
        this.window && this.window.destroy();
        delete this.window;
    }
}