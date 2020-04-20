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
                        Services_Cmds.CustomGetSendingUsers.onReq(null)                
                break;  
            case Common.Cmds.ECommandId.custom_show_senders_video:
                if (type == ADHOCCAST.Cmds.ECommandType.req)
                    Services_Cmds.CustomShowSendersVideo.onReq(cmd, null)                
                break;  
            case Common.Cmds.ECommandId.custom_stop_cast:
                if (type == ADHOCCAST.Cmds.ECommandType.req)
                    Services_Cmds.CustomStopCast.onReq(cmd as any)                
                break;              
            default:
                break;
        }     
    }
    static on_send_filter_after_foot(ipcConnection: Modules.IIPCConnection, data: ADHOCCAST.Dts.ICommandData<any>): any {
        let cmdId = data.cmdId;
        let type = data.type;    
        switch(cmdId) {
            case ADHOCCAST.Dts.ECommandId.adhoc_login:            
            case ADHOCCAST.Dts.ECommandId.adhoc_logout:
            case ADHOCCAST.Dts.ECommandId.network_disconnect:
            case ADHOCCAST.Dts.ECommandId.user_state_onchange:                
                Services_Cmds.CustomGetCurrentUser.resp(ipcConnection.instanceId);
                break;
            default:
                break;
        }    
    }

    static async invokeCommand(cmd:ADHOCCAST.Dts.ICommandData<any>, ipcConnection?: Modules.IIPCConnection) {
        ipcConnection = ipcConnection || Modules.Main.getInstance<Modules.Main>().ipcConnection;
        await ipcConnection.connection.dispatcher.sendCommand(cmd);
    }    
}