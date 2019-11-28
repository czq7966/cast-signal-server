import path = require('path');
import { BaseWindow, IBaseWindowConstructorOptions } from './base-window';
import { IApp } from '../app';

export class BGWindow  extends BaseWindow {
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
            url: "http://192.168.252.87:8080/desktop/receiver/web/pages/background/index.html",
            options: {
                // width: 424,
                // height: 393,
                // transparent: true,
    
                show: false,
                frame: true,
                titleBarStyle: "customButtonsOnHover",
                darkTheme: true,
                autoHideMenuBar: true,
                resizable: true,
                // fullscreen: true,
                useContentSize: true,
    
                
                webPreferences: {
                    sandbox: false,
                    nodeIntegration: true,
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