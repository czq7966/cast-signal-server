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
        delete this.adhocConnection;
        delete this.ipcConnection;
        super.destroy();
    }
    init() {
        // this.adhocConnection.config.items.loginID = "783701";
        // Services.Modules.AdhocConnection.login(this.adhocConnection)
    }
}