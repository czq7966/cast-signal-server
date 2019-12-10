// import fs = require('fs')
// import path = require('path')
import { HttpHelper } from '../../common/libex/http-helper'
import Config = require('./config.json') 
import CommonConfig = require('../../common/config.json') 
import {CommandID, ECommandId} from '../app/app'

let fs = MyNode.fs;
let path = MyNode.path;


export class App {
    config: any;
    constructor() {
        this.config = Config;        
        this.initApp()
    }
    async initApp() {
        await this.loadConfig();
        await this.downloads();
        close();
    }
    async loadConfig() {
        let url = new URL('config.json', window.location.origin + window.location.pathname)
        
        let http = new HttpHelper();
        return http.getData(url.toString())
        .then(v => {
            this.config = JSON.parse(v);            
            this.config.baseUrl = this.config.baseUrl || Config.baseUrl || CommonConfig.baseUrl;
        })
        .catch(e => {
            this.config.baseUrl = this.config.baseUrl || Config.baseUrl || CommonConfig.baseUrl;
            console.log('get config error: ', e)
        })
    }
    async downloads() {
        let promises = [];
        let downloads: [{source: string, target: string}] =  (Config as any).downloads;
        if (downloads) {
            downloads.forEach(download => {
                let http = new HttpHelper();
                let source = download.source;
                let sourceUrl: URL;
                try {
                    sourceUrl = new URL(source)            
                } catch (error) {
                    sourceUrl = new URL(source, this.config.baseUrl)                        
                }

                let promise = http.getData(sourceUrl.toString());
                promise.then(v => {
                    let file = path.resolve(MyNode.__dirname, download.target);
                    fs.mkdirpSync(path.dirname(file));
                    fs.writeFileSync(file, v);                
                }).catch(e => {

                })
                promises.push(promise);
            })    
        }

        return Promise.all(promises)
        .then(v => {
            this.loadScripts();
        })
        .catch(e => {
            this.loadScripts();
        })
    }

    loadScripts() {
        let loadScripts: string[] = (Config as any).loadScripts;
        if (loadScripts) {
            loadScripts.forEach(script => {
                Electron.ipcRenderer.send(CommandID, {cmdId: ECommandId.custom_load_script, extra: script});
            })
        }
    }

    close(timeout?: number) {
        timeout = timeout || 1;
        setTimeout(() => {
            window.close();            
        }, timeout);

    }
}

new App();