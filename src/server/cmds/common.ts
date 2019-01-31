import * as Dts from './dts';
import * as Common from './common/index'
import * as Modules from '../modules'
import * as Services from '../services'

// Common
export class CommandCommon extends Common.Command<any>  {
    onDispatched(cmd: Common.ICommand, sckUser: Modules.SocketUser) {
        Services.ServiceCommon.onDispatched.req(cmd, sckUser);
    }    
}

new CommandCommon({instanceId: Dts.dispatcherInstanceName});

Common.CommandTypes.RegistCommandType({
    cmdId: Dts.ECommandId.adhoc_hello,
    name: '握手',
    ReqClass: CommandCommon,
    RespClass: CommandCommon
})

Common.CommandTypes.RegistCommandType({
    cmdId: Dts.ECommandId.room_hello,
    name: '握手',
    ReqClass: CommandCommon,
    RespClass: CommandCommon
})

Common.CommandTypes.RegistCommandType({
    cmdId: Dts.ECommandId.stream_room_hello,
    name: '握手',
    ReqClass: CommandCommon,
    RespClass: CommandCommon
})

Common.CommandTypes.RegistCommandType({
    cmdId: Dts.ECommandId.stream_webrtc_offer,
    name: 'offer',
    ReqClass: CommandCommon,
    RespClass: CommandCommon
})

Common.CommandTypes.RegistCommandType({
    cmdId: Dts.ECommandId.stream_webrtc_answer,
    name: 'answer',
    ReqClass: CommandCommon,
    RespClass: CommandCommon
})

Common.CommandTypes.RegistCommandType({
    cmdId: Dts.ECommandId.stream_webrtc_sdp,
    name: 'sdp',
    ReqClass: CommandCommon,
    RespClass: CommandCommon
})

Common.CommandTypes.RegistCommandType({
    cmdId: Dts.ECommandId.stream_webrtc_candidate,
    name: 'candidate',
    ReqClass: CommandCommon,
    RespClass: CommandCommon
})

Common.CommandTypes.RegistCommandType({
    cmdId: Dts.ECommandId.stream_webrtc_ready,
    name: 'ready',
    ReqClass: CommandCommon,
    RespClass: CommandCommon
})