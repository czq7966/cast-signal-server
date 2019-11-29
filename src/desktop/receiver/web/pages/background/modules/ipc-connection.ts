import * as Common from '../../../../common';
import { ADHOCCAST } from '../../../../libex';
import * as Services from '../services'
import { IMain } from './main';

export interface IIPCConnection extends ADHOCCAST.Cmds.Common.IBase {
    eventRooter: ADHOCCAST.Cmds.Common.IEventRooter;
    connection: Common.Modules.IIPCConnection;   
}

export class IPCConnection extends ADHOCCAST.Cmds.Common.Base implements IIPCConnection {
    eventRooter: ADHOCCAST.Cmds.Common.IEventRooter;
    connection: Common.Modules.IIPCConnection;
    constructor(params?: ADHOCCAST.Cmds.Common.IBaseConstructorParams) {
        super(params);
        this.eventRooter = new ADHOCCAST.Cmds.Common.EventRooter();
        this.connection = new Common.Modules.IPCConnection({
            signalerBase: "",
            namespace: "",
            instanceId: this.instanceId,
            factorySignaler: Common.Modules.IPCRenderSignaler.TAG,
            parent: this     
        })
        this.initEvents();
    }
    destroy() {
        this.unInitEvents();
        this.connection.destroy();
        this.eventRooter.destroy();
        delete this.connection;
        delete this.eventRooter;
        super.destroy();
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
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;
        switch(cmdId) {
            default:
                break;
        }
    }
    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        switch(cmdId) {
            case Common.Cmds.ECommandId.custom_refresh_sid:
                
                if (type == ADHOCCAST.Cmds.ECommandType.req)
                    Services.Cmds.CustomRefreshSID.onReq(cmd)

                break;
            case Common.Cmds.ECommandId.custom_get_current_user:
                break;
            default:
                break;
        }     
        console.log("onAfterRoot", cmd.data.cmdId, cmd.data);
    }      
}