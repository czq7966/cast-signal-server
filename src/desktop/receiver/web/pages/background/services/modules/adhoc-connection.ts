import * as Modules from '../../modules'
import { ADHOCCAST } from '../../../../../libex'

export class AdhocConnection {
    static on_before_root(adhocConnection: Modules.IAdhocConnection, cmd: ADHOCCAST.Cmds.Common.ICommand) {

    }

    static on_after_root(adhocConnection: Modules.IAdhocConnection, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        switch(cmd.data.cmdId) {

            default:
                break;
        }     
        Modules.Main.getInstance<Modules.Main>().ipcConnection.connection.dispatcher.signaler.sendCommand(cmd.data);
        console.log("on_after_root", cmd.data.cmdId, cmd.data);        
    }
}