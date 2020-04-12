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
 

}