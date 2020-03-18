import { ADHOCCAST } from '../libex';

export interface IIPCConnectionConstructorParams extends ADHOCCAST.IConnectionConstructorParams {

}

export interface IIPCConnection extends ADHOCCAST.Cmds.Common.IBase {
    params: IIPCConnectionConstructorParams;
    signaler: ADHOCCAST.Network.ISignaler;
    dispatcher: ADHOCCAST.Modules.Dispatchers.IDispatcher
}

export class IPCConnection extends ADHOCCAST.Cmds.Common.Base {    
    params: IIPCConnectionConstructorParams;
    signaler: ADHOCCAST.Network.ISignaler;
    dispatcher: ADHOCCAST.Modules.Dispatchers.IDispatcher
    constructor(params: IIPCConnectionConstructorParams) {
        super(params);
        this.params = Object.assign({}, params);
        this.instanceId = this.instanceId || ADHOCCAST.Cmds.Common.Helper.uuid();


        this.signaler = ADHOCCAST.Network.SignalerFactory.create(this.params.factorySignaler);
        let pms: ADHOCCAST.Modules.Dispatchers.IDispatcherConstructorParams = {
            instanceId: this.instanceId,
            signaler: this.signaler,
            isServer: false
        }
        this.dispatcher = ADHOCCAST.Modules.Dispatchers.Dispatcher.getInstance(pms) 
        
        this.initEvents();        
    }    
    destroy() {
        this.unInitEvents();
        this.dispatcher.destroy()
        this.signaler.destroy();
 
        delete this.dispatcher;
        delete this.signaler;
        delete this.params;
        super.destroy();
    }
    initEvents() {
        // if (this.instanceSingle) {
        //     ADHOCCAST.Connection.instances[this.instanceId] = this;
        // }

    }
    unInitEvents() {
        // if (this.instanceSingle) {
        //     delete ADHOCCAST.Connection.instances[this.instanceId];
        // }
    }

    login(user?: ADHOCCAST.Cmds.IUser, namespace?: string, signalerBase?: string): Promise<any> {
        return this.signaler.connect();
    }       
    isLogin(): boolean {
        return this.signaler.connected();
    }
    logout(): Promise<any> {        
        if (this.isLogin()) {
            this.signaler.disconnect();
            return Promise.resolve();
        } else {
            return Promise.resolve();
        }
    }

    disconnect(){
        this.signaler.disconnect();
    }
}