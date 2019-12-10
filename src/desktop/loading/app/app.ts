import electron = require('electron');
import fs = require('fs')
import path = require('path')
import Package = require('./package.json');
import CommonConfig = require('../../common/config.json') 

export var CommandID = 'command';

export enum ECommandId {
    custom_load_script = "custom_load_script"
}    



export interface IBaseWindowConstructorOptions extends electron.BrowserWindowConstructorOptions {
    url?: string;
    file?: string;
    options?: electron.BrowserWindowConstructorOptions;
}

export class App {
    window: electron.BrowserWindow;
    constructor() {
        this.initApp();
    }

    initApp() {
        electron.app.on('ready', () => {
            electron.ipcMain.addListener(CommandID, this.onMessage);
            this.createWindow();
        })
        electron.app.on('window-all-closed', () => {
            // On macOS it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') electron.app.quit()
        })        
        electron.app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (this.window === null) this.createWindow()
        })
    }


    createWindow() {     
        if (!this.window) {
            let options = this.getOptions();
            this.window = new electron.BrowserWindow(options.options);
            this.window.webContents.session.clearCache(() => {
                if (!!options.url) {
                    this.window.loadURL(options.url);
                } else if (!!options.file) {
                    this.window.loadFile(options.file);
                }     
                
                this.window.on('close',  () => {
                    this.window.webContents.session.clearCache(()=>{})
                });
                this.window.on('closed',  () => {
                    // Dereference the window object, usually you would store windows
                    // in an array if your app supports multi windows, this is the time
                    // when you should delete the corresponding element.
                    this.window = null
                }); 
            })
        }
    } 

    getOptions(): IBaseWindowConstructorOptions {
        let homePage = Package.pages.loading.homePage;
        let url: URL;
        try {
            url = new URL(homePage)            
        } catch (error) {
            url = new URL(homePage, CommonConfig.baseUrl)                        
        }

        let options: IBaseWindowConstructorOptions = {
            url: url.toString(),
            options: {
                // width: 424,
                // height: 393,
                // alwaysOnTop: true,
                // titleBarStyle: "customButtonsOnHover",
                darkTheme: true,
                autoHideMenuBar: true,

                // fullscreen: true,
                // useContentSize: true,
                maximizable: false,
                minimizable: false,
                resizable: false,
                fullscreenable: false,
                frame: true,
                transparent: true,
                hasShadow:false,

                
                webPreferences: {
                    sandbox: false,
                    nodeIntegration: false,
                    webSecurity: false,
                    allowRunningInsecureContent: true,
                    additionalArguments: ['electron'],                
                    preload: path.join(__dirname, Package.pages.loading.preload)
                }
            }
        }
        return options;
    }

    runApp() {

    }

    onMessage = (event, arg) => {
        if (arg.cmdId == ECommandId.custom_load_script) {
            this.on_custom_load_script(arg.extra)
        }       
    }    

    on_custom_load_script(file: string) {
        file = path.resolve(__dirname, file);
        if (fs.existsSync(file)) {
            __non_webpack_require__(file)
        }
    }
}
