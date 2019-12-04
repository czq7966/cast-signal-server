import * as Modules from '../../modules'
import * as Services_Cmds from '../cmds';
import { ADHOCCAST } from '../../../../../common'

export class AdhocConnection {
    static on_before_root(adhocConnection: Modules.IAdhocConnection, cmd: ADHOCCAST.Cmds.Common.ICommand) {

    }

    static on_after_root(adhocConnection: Modules.IAdhocConnection, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        let ipcConnection = Modules.Main.getInstance<Modules.Main>().ipcConnection;
        switch(cmd.data.cmdId) {
            case ADHOCCAST.Dts.ECommandId.adhoc_login:            
            case ADHOCCAST.Dts.ECommandId.adhoc_logout:
            case ADHOCCAST.Dts.ECommandId.user_state_onchange:
            case ADHOCCAST.Dts.ECommandId.network_disconnect:
                Services_Cmds.CustomGetCurrentUser.resp(ipcConnection.instanceId);
                Services_Cmds.CustomGetSendingUsers.resp(ipcConnection.instanceId);
                break;
            default:
                break;
        }    
        if (cmd.data.type === ADHOCCAST.Dts.ECommandType.resp && cmd.data.sessionId ) {
            cmd.data.sessionId = null;
        }
        ipcConnection.connection.dispatcher.signaler.sendCommand(cmd.data);
    }
}