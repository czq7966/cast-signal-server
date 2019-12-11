import * as Cmds from '../cmds/index'
import { ISocketNamespace } from './namespace';
import { Config } from './config';
import { IHttpServers, HttpServers } from './http-servers';
import { ServiceServer } from '../services';
import { IGlobalExpcetion, GlobalExpcetion } from './global-exception';
import { ISignalClient } from '../amd/signal-client/signal-client';
import * as Helper from "../helper"
import * as path from 'path'
import * as Amd from '../amd/index'

export interface IServer {
    snsps: Cmds.Common.Helper.KeyValue<ISocketNamespace>
    httpServers: IHttpServers
    socketioServer: SocketIO.Server;
    globalExpcetion: IGlobalExpcetion
    signalClient: ISignalClient
    initNamespaces(): Promise<any>
    unInitNamespaces(): Promise<any>
    resetNamespaces(): Promise<any>
    openNamespace(name: string): Promise<any>
    closeNamespace(name: string): Promise<any>
    resetNamespace(name: string): Promise<any>
}

export class Server implements IServer {
    static instance: IServer;
    snsps: Cmds.Common.Helper.KeyValue<ISocketNamespace>
    httpServers: IHttpServers
    socketioServer: SocketIO.Server;
    globalExpcetion: IGlobalExpcetion;
    signalClient: ISignalClient;

    constructor() {
        Server.instance = this;
        this.httpServers = new HttpServers(new Config());
        this.snsps = new Cmds.Common.Helper.KeyValue();
        this.initSocketIOServer();
        this.initNamespaces();
        this.initEvents();       
        this.run(); 
        this.globalExpcetion = new GlobalExpcetion(this)      
        Amd.requirejs(path.resolve(__dirname, 'amd/signal-client/index.js'), [])
        .then((modules: any) => {
            this.signalClient = new modules.SignalClient();
        })
    }    
    destroy() {
        this.signalClient && this.signalClient.destroy();
        this.globalExpcetion.destroy()
        this.httpServers.destroy();
        this.snsps.destroy();
        delete this.snsps;
        delete this.httpServers;
        delete this.globalExpcetion;
        delete this.signalClient;
        this.unInitEvents();
        this.unInitNamespaces();
        this.unInitSocketIOServer();
    }
    initEvents() {

    }
    unInitEvents() {

    }    
    initSocketIOServer() {
        let server = this.httpServers.servers[0]
        this.socketioServer = require('socket.io')(server.httpServer, {
                    transports: ['websocket'],
                    serveClient: false,
                }) as SocketIO.Server;
        
        for (let index = 1; index < this.httpServers.servers.length; index++) {
            let server = this.httpServers.servers[index];
            this.socketioServer.attach(server.httpServer);
        }         
    }
    unInitSocketIOServer() {

    }
    initNamespaces(): Promise<any> {
        let config = new Config()
        let promises = []
        Object.keys(config.namespaces).forEach(name => {
            promises.push(this.openNamespace(name))
        })
        return Promise.all(promises)
    }
    unInitNamespaces(): Promise<any> {
        let promises = []
        this.snsps.keys().forEach(name => {
            promises.push(this.closeNamespace(name))
        })        
        return Promise.all(promises)
    }
    resetNamespaces(): Promise<any> {
        return ServiceServer.resetNamespaces(this, this.snsps.keys())        
    }

    openNamespace(name: string): Promise<any> {
        return ServiceServer.openNamespace(this, name)
    }
    closeNamespace(name: string): Promise<any> {
        return ServiceServer.closeNamespace(this, name)
    }
    resetNamespace(name: string): Promise<any> {
        return ServiceServer.resetNamespace(this, name)
    }

    run() {
        this.httpServers.servers.forEach(server => {
            server.httpServer.listen(server.port);
            console.log(server.listenlog || 'listen on port ' + server.port)
        })
    }
    close() {
        this.socketioServer.close();
        this.httpServers.servers.forEach(server => {
            server.httpServer.close();
        })        
    }
}
