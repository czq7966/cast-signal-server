import { ADHOCCAST } from '../../../../common';
import * as Services from '../services'
import * as PageCommon from '../../common'

export interface IIPCConnection extends PageCommon.IIPCConnection {

}

export class IPCConnection extends PageCommon.IPCConnection  {
    constructor(params: ADHOCCAST.Cmds.Common.IBaseConstructorParams,
                connParams: ADHOCCAST.IConnectionConstructorParams) {
        super(params, connParams);
        this.initEvents();
    }
    destroy() {
        this.unInitEvents();
        super.destroy();
    }
    initEvents() {
        this.eventRooter.onAfterRoot.add(this.onAfterRoot)    
        this.connection.dispatcher.sendFilter.onAfterRoot.add(this.onSendFilterAfterRoot) 
    }
    unInitEvents() {
        this.connection.dispatcher.sendFilter.onAfterRoot.remove(this.onSendFilterAfterRoot) 
        this.eventRooter.onAfterRoot.remove(this.onAfterRoot)
    }

    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Modules.IPCConnection.on_after_root(this, cmd);
    }  
    onSendFilterAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Modules.IPCConnection.on_send_filter_after_foot(this, cmd);
    }     
}