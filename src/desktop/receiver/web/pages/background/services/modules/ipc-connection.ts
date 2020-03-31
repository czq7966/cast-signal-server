import * as Modules from '../../modules'
import * as Services_Cmds from '../cmds';
import * as Common from '../../../../../common';
import { ADHOCCAST } from '../../../../../common'

export class IPCConnection {
    static on_after_root(ipcConnection: Modules.IIPCConnection, cmd: ADHOCCAST.Cmds.Common.ICommand): any {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        switch(cmdId) {
            case Common.Cmds.ECommandId.custom_refresh_sid:
                if (type == ADHOCCAST.Cmds.ECommandType.req)
                Services_Cmds.CustomRefreshSID.onReq(cmd)
                break;
            case Common.Cmds.ECommandId.custom_get_current_user:
                    if (type == ADHOCCAST.Cmds.ECommandType.req)
                        Services_Cmds.CustomGetCurrentUser.onReq(cmd)                
                break;
            case Common.Cmds.ECommandId.custom_get_sendering_users:
                    if (type == ADHOCCAST.Cmds.ECommandType.req)
                        Services_Cmds.CustomGetSendingUsers.onReq(cmd)                
                break;  
            case Common.Cmds.ECommandId.custom_show_senders_video:
                if (type == ADHOCCAST.Cmds.ECommandType.req)
                    Services_Cmds.CustomShowSendersVideo.onReq(cmd, null)                
                break;                
            default:
                break;
        }     
    }
    static async invokeCommand(cmd:ADHOCCAST.Dts.ICommandData<any>, ipcConnection?: Modules.IIPCConnection) {
        ipcConnection = ipcConnection || Modules.Main.getInstance<Modules.Main>().ipcConnection;
        await ipcConnection.connection.dispatcher.signaler.sendCommand(cmd);
    }    
}