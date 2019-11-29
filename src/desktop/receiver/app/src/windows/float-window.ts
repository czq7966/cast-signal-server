import path = require('path');
import { BaseWindow, IBaseWindowConstructorOptions } from './base-window';
import { IApp } from '../app';
import { BGWindow } from './bg-window';

export class FloatWindow  extends BaseWindow {
    constructor(app: IApp, options?: IBaseWindowConstructorOptions) {
        super(app, options);
        this.init();
    }
    destroy() {
        this.unInit();
        super.destroy();
    }

    init() {
        this.createWindow(this.getOptions());
        this.window.on('closed', () => {
            this.app.windows[BGWindow.name].window.close();
        })
    }
    unInit() {
        this.destroyWindow();
    }
    getOptions(): IBaseWindowConstructorOptions {
        let options: IBaseWindowConstructorOptions = {
            url: "http://127.0.0.1:8080/desktop/receiver/web/pages/floating/index.html",
            options: {
                // width: 424,
                // height: 393,
                alwaysOnTop: true,
                // titleBarStyle: "customButtonsOnHover",
                darkTheme: true,
                autoHideMenuBar: true,

                // fullscreen: true,
                // useContentSize: true,
                maximizable: false,
                minimizable: false,
                resizable: false,
                fullscreenable: false,
                frame:false,
                transparent: true,
                hasShadow:false,

                
                webPreferences: {
                    sandbox: false,
                    nodeIntegration: false,
                    webSecurity: false,
                    allowRunningInsecureContent: true,
                    additionalArguments: ['electron'],                
                    preload: path.join(__dirname, 'preload.js')
                }
            }
        }
        return options;
    }
}