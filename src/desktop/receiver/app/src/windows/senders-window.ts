import path = require('path');
import { BaseWindow, IBaseWindowConstructorOptions } from './base-window';
import { IApp } from '../app';

export class SendersWindow  extends BaseWindow {
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
    }
    unInit() {
        this.destroyWindow();
    }
    getOptions(): IBaseWindowConstructorOptions {
        let options: IBaseWindowConstructorOptions = {
            url: "http://127.0.0.1:8080/desktop/receiver/web/pages/senders/index.html",
            options: {
                // width: 424,
                // height: 393,
                // transparent: true,
    
                frame: true,
                alwaysOnTop: true,
                titleBarStyle: "customButtonsOnHover",
                darkTheme: true,
                autoHideMenuBar: true,
                resizable: true,
                // fullscreen: true,
                // useContentSize: true,
    
                
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