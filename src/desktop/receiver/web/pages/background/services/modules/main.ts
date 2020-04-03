import * as Comps from "../../comps"
import * as Modules from '../../modules'
import { ADHOCCAST } from '../../../../../common'
import * as Common from '../../../../../common';
import * as Services_Cmds from '../cmds'

export class Main {
    static on_ipc_after_root(main: Modules.IMain, cmd: ADHOCCAST.Cmds.Common.ICommand): any {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        switch(cmdId) {
            case Common.Cmds.ECommandId.custom_show_senders_video:
                if (type == ADHOCCAST.Cmds.ECommandType.req)
                    this.on_ipc_custom_show_senders_video(main,cmd);
                break;                
            default:
                break;
        }           
    }
    static on_adhoc_before_root(main: Modules.IMain, cmd: ADHOCCAST.Cmds.Common.ICommand): any {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        switch(cmdId) {
                      
            default:
                break;
        }           
    }       
    static on_adhoc_after_root(main: Modules.IMain, cmd: ADHOCCAST.Cmds.Common.ICommand): any {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        switch(cmdId) {
            case Common.Cmds.ECommandId.custom_on_sending_stream:
                this.on_adhoc_custom_on_sending_stream(main, cmd);
                break;
            case Common.Cmds.ECommandId.custom_off_sending_stream:
                this.on_adhoc_custom_off_sending_stream(main, cmd);
                break;                               
            default:
                break;
        }           
    }   

    static on_ipc_custom_show_senders_video(main: Modules.IMain, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        // let senders = cmd.data.extra as {[id: string]: ADHOCCAST.Cmds.IUser};
        // Services_Cmds.CustomShowSendersVideo.resp(main.adhocConnection.instanceId, null, senders);
    }
    static on_adhoc_custom_on_sending_stream(main: Modules.IMain, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        Services_Cmds.CustomGetSendingUsers.resp();
    }
    static on_adhoc_custom_off_sending_stream(main: Modules.IMain, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        Services_Cmds.CustomGetSendingUsers.resp();
    }    
    static on_custom_get_sendering_users(main: Modules.IMain, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        // if (cmd.data.type == ADHOCCAST.Dts.ECommandType.resp)  {
        //     let senders = cmd.data.extra as {[id: string]: ADHOCCAST.Cmds.IUser};
        //     // main.setState({
        //     //     senders: senders
        //     // })            
        // }
            
    }     

}