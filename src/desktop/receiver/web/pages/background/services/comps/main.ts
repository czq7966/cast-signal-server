import * as Comps from "../../comps"
import { ADHOCCAST } from '../../../../../common'
import * as Common from '../../../../../common';

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

    static on_custom_show_senders_video(main: Comps.Main, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        let senders = cmd.data.extra as {[id: string]: ADHOCCAST.Cmds.IUser};
        main.setState({
            senders: senders
        })
    }
}