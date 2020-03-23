import { ADHOCCAST } from "../../../../common"
import * as BGModules from '../../background/modules'
import * as SDSModules from '../../senders/modules'
import { IPCBGSignaler, IIPCBGSignaler } from "./ipc-bg-signaler"
import { IPCWinSignaler, IIPCWinSignaler } from "./ipc-win-signaler"

export interface IMainConstructorParams extends ADHOCCAST.Cmds.Common.IBaseConstructorParams {

}

export interface IMain extends ADHOCCAST.Cmds.Common.IBase {
    bgModuleMain: BGModules.IMain
    sdsModuleMain: SDSModules.IMain
}

export class Main  extends ADHOCCAST.Cmds.Common.Base implements IMain {
    bgModuleMain: BGModules.IMain
    sdsModuleMain: SDSModules.IMain
    constructor(params: IMainConstructorParams) {
        super(params);
        //Creat BG Modules
        var bgParams: BGModules.IMainConstructorParams = {
            adhocConnection: new BGModules.AdhocConnection({instanceId: ADHOCCAST.Cmds.Common.Helper.uuid()}),
            ipcConnection: new BGModules.IPCConnection({instanceId: ADHOCCAST.Cmds.Common.Helper.uuid()},
                {factorySignaler: IPCBGSignaler.TAG} as any)
        }
        this.bgModuleMain = BGModules.Main.getInstance<BGModules.Main>(bgParams);

        //Create SDS Modules
        var sdsParams: SDSModules.IMainConstructorParams = {
            ipcConnection: new SDSModules.IPCConnection({instanceId: ADHOCCAST.Cmds.Common.Helper.uuid()},
                {factorySignaler: IPCWinSignaler.TAG} as any)
        };

        (sdsParams.ipcConnection.connection.signaler as IIPCWinSignaler)
        .setIPCBG(bgParams.ipcConnection.connection.signaler as IIPCBGSignaler);
        this.sdsModuleMain = SDSModules.Main.getInstance<SDSModules.Main>(sdsParams);       
        
    }
    destroy() {
        this.sdsModuleMain.destroy()
        this.bgModuleMain.destroy()
        super.destroy();
    }
}