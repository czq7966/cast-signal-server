import * as Comps from "../../comps"
import { ADHOCCAST } from '../../../../../common'
import * as Common from '../../../../../common';
import * as Services_Cmds from '../cmds'

export class Main {
    static on_ipc_after_root(main: Comps.Main, cmd: ADHOCCAST.Cmds.Common.ICommand): any {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        switch(cmdId) {
            
            default:
                break;
        }           
    }
    static on_ipc_send_filter_after_root(main: Comps.Main, data: ADHOCCAST.Cmds.ICommandData<any>): any {
        let cmdId = data.cmdId;
        let type = data.type;        
        switch(cmdId) {
            case Common.Cmds.ECommandId.custom_show_senders_video:
                this.on_custom_show_senders_video(main, data);
                break;                               
            default:
                break;
        }          
    }
    static on_adhoc_before_root(main: Comps.Main, cmd: ADHOCCAST.Cmds.Common.ICommand): any {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        switch(cmdId) {
                    
            default:
                break;
        }           
    }       
    static on_adhoc_after_root(main: Comps.Main, cmd: ADHOCCAST.Cmds.Common.ICommand): any {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        switch(cmdId) {
                          
            default:
                break;
        }           
    }   
 
    static on_custom_show_senders_video(main: Comps.Main, data: ADHOCCAST.Cmds.ICommandData<any>) {
        if (data.type == ADHOCCAST.Dts.ECommandType.resp) {
            main.windowResize();
        }  
    }  
}