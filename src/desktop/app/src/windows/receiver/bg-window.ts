import path = require('path');
import { BaseWindow, IBaseWindowConstructorOptions } from '../base-window';
import { IApp } from '../../app';
import { ADHOCCAST } from '../../../../common'

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
        this.window.on('close', (ev: Electron.Event) => {
            this.window.hide();
            ev.preventDefault();
        })        
        this.app.ipcConnection.dispatcher.eventRooter.onAfterRoot.add(this.onAfterRoot);
    }
    unInit() {
        this.app.ipcConnection.dispatcher.eventRooter.onAfterRoot.remove(this.onAfterRoot);
        this.destroyWindow();
    }
    getOptions(): IBaseWindowConstructorOptions {
        let options: IBaseWindowConstructorOptions = {
            url: "http://127.0.0.1:8080/desktop/receiver/web/pages/background/index.html",
            options: {
                // width: 424,
                // height: 393,
                // transparent: true,
    
                show: true,
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
    
    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;
        switch(cmdId) {
            case ADHOCCAST.Cmds.ECommandId.network_disconnect:
                this.window.show();
                break;
            default:
                break;
        }     
    }      

}