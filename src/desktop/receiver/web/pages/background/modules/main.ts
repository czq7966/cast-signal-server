import { ADHOCCAST } from "../../../../common";
import { IPCConnection, IIPCConnection } from "./ipc-connection";
import { AdhocConnection, IAdhocConnection } from "./adhoc-connection";
import * as Services from '../services';
ADHOCCAST.Cmds.Common.Helper.Debug.enabled = true;

export interface IMainConstructorParams extends ADHOCCAST.Cmds.Common.IBaseConstructorParams {
    adhocConnection: IAdhocConnection
    ipcConnection: IIPCConnection    
}

export interface IMain extends ADHOCCAST.Cmds.Common.IBase {
    adhocConnection: IAdhocConnection
    ipcConnection: IIPCConnection    
}

export class Main  extends ADHOCCAST.Cmds.Common.Base implements IMain {
    adhocConnection: IAdhocConnection
    ipcConnection: IIPCConnection
    constructor(params: IMainConstructorParams) {
        super(params);
        this.adhocConnection = params.adhocConnection;
        this.ipcConnection = params.ipcConnection;
        this.init()
    }

    destroy() {
        this.unInit();
        delete this.adhocConnection;
        delete this.ipcConnection;
        super.destroy();
    }
    init() {
        this.ipcConnection.eventRooter.onAfterRoot.add(this.onIPCAfterRoot);
        this.adhocConnection.eventRooter.onBeforeRoot.add(this.onAdhocBeforeRoot);
        this.adhocConnection.eventRooter.onAfterRoot.add(this.onAdhocAfterRoot);
    }
    unInit() {
        this.ipcConnection.eventRooter.onAfterRoot.remove(this.onIPCAfterRoot);
        this.adhocConnection.eventRooter.onBeforeRoot.remove(this.onAdhocBeforeRoot);
        this.adhocConnection.eventRooter.onAfterRoot.remove(this.onAdhocAfterRoot);
    }
    onIPCAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Modules.Main.on_ipc_after_root(this, cmd);
    }  
    onAdhocBeforeRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Modules.Main.on_adhoc_before_root(this, cmd);
    }        
    onAdhocAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Modules.Main.on_adhoc_after_root(this, cmd);
    }  
}