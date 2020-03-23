import { ADHOCCAST } from "../../../../common";
import { IIPCConnection } from "./ipc-connection";

export interface IMainConstructorParams extends ADHOCCAST.Cmds.Common.IBaseConstructorParams {
    ipcConnection: IIPCConnection    
}

export interface IMain extends ADHOCCAST.Cmds.Common.IBase {
    ipcConnection: IIPCConnection    
}

export class Main  extends ADHOCCAST.Cmds.Common.Base implements IMain {
    ipcConnection: IIPCConnection
    constructor(params: IMainConstructorParams) {
        super(params);
        this.ipcConnection = params.ipcConnection;
    }
    destroy() {
        delete this.ipcConnection;
        super.destroy();
    }
}