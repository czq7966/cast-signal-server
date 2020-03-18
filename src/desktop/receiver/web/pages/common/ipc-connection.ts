import * as Common from '../../../common';
import { ADHOCCAST } from '../../../common';


export interface IIPCConnection extends ADHOCCAST.Cmds.Common.IBase {
    eventRooter: ADHOCCAST.Cmds.Common.IEventRooter;
    connection: Common.Modules.IIPCConnection;   
}

export class IPCConnection extends ADHOCCAST.Cmds.Common.Base implements IIPCConnection {
    eventRooter: ADHOCCAST.Cmds.Common.IEventRooter;
    connection: Common.Modules.IIPCConnection;
    constructor(params: ADHOCCAST.Cmds.Common.IBaseConstructorParams,
                connParams: ADHOCCAST.IConnectionConstructorParams) {
        super(params);
        this.eventRooter = new ADHOCCAST.Cmds.Common.EventRooter();        
        let _connParams: ADHOCCAST.IConnectionConstructorParams = {
            signalerBase: "",
            namespace: "",
            instanceId: this.instanceId,
            // factorySignaler: Common.Modules.IPCRenderSignaler.TAG,
            parent: this    
        }
        connParams = Object.assign(_connParams, connParams)

        this.connection = Common.Modules.IPCConnection.getInstance(connParams); 
        this.eventRooter.setParent(this.connection.dispatcher.eventRooter);
    }
    destroy() {
        this.eventRooter.setParent();
        this.connection.destroy();
        this.eventRooter.destroy();
        delete this.connection;
        delete this.eventRooter;
        super.destroy();
    }
}