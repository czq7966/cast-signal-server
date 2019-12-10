import * as Comps from "../../comps"
import { ADHOCCAST } from '../../../../../common'
import * as Common from '../../../../../common';
import * as Services_Cmds from '../cmds'

export class Main {
    static on_ipc_after_root(main: Comps.Main, cmd: ADHOCCAST.Cmds.Common.ICommand): any {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        switch(cmdId) {
            case Common.Cmds.ECommandId.custom_show_senders_video:
                this.on_custom_show_senders_video(main,cmd);
                break;                
            default:
                break;
        }           
    }
    static on_adhoc_before_root(main: Comps.Main, cmd: ADHOCCAST.Cmds.Common.ICommand): any {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        switch(cmdId) {
            case Common.Cmds.ECommandId.custom_get_sendering_users:
                    this.on_custom_get_sendering_users(main,cmd);
                    break;                            
            default:
                break;
        }           
    }       
    static on_adhoc_after_root(main: Comps.Main, cmd: ADHOCCAST.Cmds.Common.ICommand): any {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        switch(cmdId) {
            case Common.Cmds.ECommandId.custom_on_sending_stream:
                this.on_custom_on_sending_stream(main,cmd);
                break;
            case Common.Cmds.ECommandId.custom_off_sending_stream:
                this.on_custom_off_sending_stream(main,cmd);
                break;                               
            default:
                break;
        }           
    }   

    static on_custom_show_senders_video(main: Comps.Main, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        let senders = cmd.data.extra as {[id: string]: ADHOCCAST.Cmds.IUser};
        main.setState({
            senders: senders
        })
    }
    static on_custom_on_sending_stream(main: Comps.Main, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        Services_Cmds.CustomGetSendingUsers.resp(main.moduleMain.adhocConnection.instanceId);
    }
    static on_custom_off_sending_stream(main: Comps.Main, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        Services_Cmds.CustomGetSendingUsers.resp(main.moduleMain.adhocConnection.instanceId);
    }    
    static on_custom_get_sendering_users(main: Comps.Main, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        if (cmd.data.type == ADHOCCAST.Dts.ECommandType.resp)  {
            let senders = cmd.data.extra as {[id: string]: ADHOCCAST.Cmds.IUser};
            main.setState({
                senders: senders
            })            
        }
            
    }     

}