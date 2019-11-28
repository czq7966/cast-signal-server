import { ADHOCCAST } from '../../../../libex';
import * as Services from '../services'

export interface IAdhocConnection extends ADHOCCAST.Cmds.Common.IBase {
    eventRooter: ADHOCCAST.Cmds.Common.IEventRooter;
    connection: ADHOCCAST.IConnection;    
}
export class AdhocConnection extends ADHOCCAST.Cmds.Common.Base implements IAdhocConnection {
    eventRooter: ADHOCCAST.Cmds.Common.IEventRooter;
    connection: ADHOCCAST.IConnection;
    constructor(params?: ADHOCCAST.Cmds.Common.IBaseConstructorParams) {
        super(params);
        this.eventRooter = new ADHOCCAST.Cmds.Common.EventRooter();
        this.connection = new ADHOCCAST.Connection({
            instanceId: this.instanceId,
            signalerBase: "https://adhoc-cast-signaler-product.k8s.101.com",
            namespace: "mdm",
            parent: this
        });        
        this.initEvents();
    }
    destroy() {
        this.unInitEvents();
        this.connection.destroy();
        this.eventRooter.destroy();
        delete this.connection;
        delete this.eventRooter;
    }
    initEvents() {
        this.eventRooter.setParent(this.connection.dispatcher.eventRooter);
        this.eventRooter.onBeforeRoot.add(this.onBeforeRoot)
        this.eventRooter.onAfterRoot.add(this.onAfterRoot)     
    }
    unInitEvents() {
        this.eventRooter.onBeforeRoot.remove(this.onBeforeRoot)
        this.eventRooter.onAfterRoot.remove(this.onAfterRoot)
        this.eventRooter.setParent(); 
    }
    onBeforeRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Modules.AdhocConnection.on_before_root(this, cmd);
    }
    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Modules.AdhocConnection.on_after_root(this, cmd);
    }      
}