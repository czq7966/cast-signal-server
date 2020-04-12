import * as Comps from "../../comps"
import { ADHOCCAST } from '../../../../../common'
import * as Common from '../../../../../common';

export class Player {
    static on_ipc_after_root(player: Comps.CompPlayer, cmd: ADHOCCAST.Cmds.Common.ICommand) {

    }

    static on_adhoc_after_root(player: Comps.CompPlayer, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        switch(cmdId) {
            case ADHOCCAST.Dts.ECommandId.stream_webrtc_onrecvstream:
                    this.on_stream_webrtc_onrecvstream(player,cmd);
                    break;                            
            default:
                break;
        } 
    }    

    static on_stream_webrtc_onrecvstream(player: Comps.CompPlayer, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        let props = cmd.data.props as ADHOCCAST.Cmds.ICommandDataProps;
        let user = props.user;
        let streamRoom = ADHOCCAST.Services.Modules.Rooms.getRoom(player.moduleMain.adhocConnection.instanceId, user.room.id);
        if (streamRoom.owner().item.id == player.props.userId) {
            this.play(player);
        }
    }
    
    static getStream(player: Comps.CompPlayer): MediaStream {
        return ADHOCCAST.Services.Modules.User.getMyRecvStream(player.moduleMain.adhocConnection.instanceId, player.props.userId)
    }

    static play(player: Comps.CompPlayer) {
        player.videoElement && (player.videoElement.srcObject = this.getStream(player));
    }
}