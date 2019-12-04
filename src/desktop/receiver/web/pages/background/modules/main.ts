import * as Common from "../../../../common";
import { ADHOCCAST } from "../../../../common";
import { IPCConnection } from "./ipc-connection";
import { AdhocConnection } from "./adhoc-connection";
ADHOCCAST.Cmds.Common.Helper.Debug.enabled = true;

export interface IMain extends ADHOCCAST.Cmds.Common.IBase {
    adhocConnection: AdhocConnection
    ipcConnection: IPCConnection    
}

export class Main  extends ADHOCCAST.Cmds.Common.Base implements IMain {
    adhocConnection: AdhocConnection
    ipcConnection: IPCConnection
    constructor() {
        super();
        this.adhocConnection = new AdhocConnection({
            instanceId: ADHOCCAST.Cmds.Common.Helper.uuid()
        });
        this.ipcConnection = new IPCConnection({
            instanceId: ADHOCCAST.Cmds.Common.Helper.uuid()
        });
    }
    destroy() {
        this.adhocConnection.destroy();
        this.ipcConnection.destroy();
        delete this.adhocConnection;
        delete this.ipcConnection;
        super.destroy();
    }
}