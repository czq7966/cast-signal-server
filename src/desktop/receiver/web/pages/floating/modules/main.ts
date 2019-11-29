import * as Common from "../../../../common";
import { ADHOCCAST } from '../../../../libex';
import { IPCConnection } from "./ipc-connection";
ADHOCCAST.Cmds.Common.Helper.Debug.enabled = true;

export interface IMain extends ADHOCCAST.Cmds.Common.IBase {
    ipcConnection: IPCConnection    
}

export class Main  extends ADHOCCAST.Cmds.Common.Base implements IMain {
    ipcConnection: IPCConnection
    constructor() {
        super();
        this.ipcConnection = new IPCConnection({
            instanceId: ADHOCCAST.Cmds.Common.Helper.uuid()
        });
    }
    destroy() {
        this.ipcConnection.destroy();
        delete this.ipcConnection;
        super.destroy();
    }
}