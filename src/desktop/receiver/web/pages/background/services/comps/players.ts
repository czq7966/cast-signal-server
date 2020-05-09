import * as Comps from "../../comps"
import { ADHOCCAST } from '../../../../../common'
import * as Common from '../../../../../common';
import * as Services_Cmds from '../cmds'

export class Players {
    static on_ipc_after_root(main: Comps.CompPlayers, cmd: ADHOCCAST.Cmds.Common.ICommand): any {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        switch(cmdId) {
            case Common.Cmds.ECommandId.custom_show_senders_video:
                this.on_ipc_custom_show_senders_video(main,cmd);
                break;                
            default:
                break;
        }           
    }
    static on_ipc_send_filter_after_root(players: Comps.CompPlayers, data: ADHOCCAST.Cmds.ICommandData<any>): any {
        let cmdId = data.cmdId;
        let type = data.type;        
        switch(cmdId) {
            case Common.Cmds.ECommandId.custom_off_sending_stream:
                this.on_ipc_send_filter_custom_off_sending_stream(players, data);
                break;                               
            default:
                break;
        }          
    }
    
      
    static on_ipc_custom_show_senders_video(players: Comps.CompPlayers, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        let senders = cmd.data.extra as {[id: string]: ADHOCCAST.Cmds.IUser};
        let fullSenderId = cmd.data.props.extra;
        players.setState({
            fullSenderId: fullSenderId,
            senders: senders
        })
        Services_Cmds.CustomShowSendersVideo.resp(players.instanceId, null, senders);
     }

     static on_ipc_send_filter_custom_off_sending_stream(players: Comps.CompPlayers, data: ADHOCCAST.Cmds.ICommandData<any>) {
        let user = data.props.user as ADHOCCAST.Cmds.IUser;
        let senders = players.state.senders;
        if (user && senders && senders[user.id]) {
            delete senders[user.id];
            players.setState({
                senders: senders
            })
        }
        Services_Cmds.CustomShowSendersVideo.resp(players.instanceId, null, senders);
    }  
}