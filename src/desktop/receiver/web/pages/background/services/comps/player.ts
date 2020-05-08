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
            case ADHOCCAST.Dts.ECommandId.stream_webrtc_onconnectionstatechange:
                this.on_stream_webrtc_onconnectionstatechange(player,cmd);
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

    static on_stream_webrtc_onconnectionstatechange(player: Comps.CompPlayer, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        let props = cmd.data.props as ADHOCCAST.Cmds.ICommandDataProps;
        let user = props.user;
        let extra = user.extra;
        let streamRoom = ADHOCCAST.Services.Modules.Rooms.getRoom(player.moduleMain.adhocConnection.instanceId, user.room.id);
        if (streamRoom.owner().item.id == player.props.userId) {
            let info: string;
            let rtc = extra && extra[0] && extra[0].target as RTCPeerConnection;
            if (rtc != null) {                
                switch(rtc.connectionState) {
                    case 'new':
                        info = "RTC New";
                        break;
                    case 'connecting':
                        info = "RTC Connecting";
                        break;
                    case 'connected':
                        info = null;
                        break;
                    case 'failed':
                        info = "RTC Failed";
                        break;
                    case 'disconnected':
                        info = "RTC Disconnected";
                        break;
                    case 'closed':
                        info = "RTC Closed";
                        break;
                }
            }
            player.setState({info: info});
        }
    }
    
    static getStream(player: Comps.CompPlayer): MediaStream {
        return ADHOCCAST.Services.Modules.User.getMyRecvStream(player.moduleMain.adhocConnection.instanceId, player.props.userId)
    }

    static play(player: Comps.CompPlayer) {
        if (player.videoElement) {
              Common.Services.Cmds.CustomApplyVideoConstraints.req(
                player.moduleMain.adhocConnection.instanceId, 
                player.props.userId, 
                player.props.constraintName);

            player.videoElement.srcObject = this.getStream(player)
            this.enableTouchback(player);
        };
    }
    static enableTouchback(player: Comps.CompPlayer) {
        if (player.videoElement) {
            let mStreamRoom = ADHOCCAST.Services.Modules.User.getStreamRoom2(
                    player.moduleMain.adhocConnection.instanceId, 
                    player.props.userId);
            let mMe = mStreamRoom ? mStreamRoom.me() : null;
            let mPeer = mMe && mMe.peer;
            let inputElement = mPeer && mPeer.input.inputElement;
            if (inputElement) {
                player.props.enableTouchback 
                    ? inputElement.attachHTMLElement(player.videoElement)
                    : inputElement.deattachHTMLElement(player.videoElement);
            }            
        };       
    }
}