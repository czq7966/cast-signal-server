import * as Dts from '../dts';
import * as Common from '../common/index'
import * as Modules from '../../modules'
import * as Services from '../../services'

// Req
export class CommandLoginReq extends Common.Command<Dts.ICommandLoginReqDataProps> {
    onDispatched(cmd: CommandLoginReq, sckUser: Modules.SocketUser) {
        Services.ServiceLogin.onDispatched.req(cmd, sckUser);
    }    
}

Common.CommandTypes.RegistCommandType({
    cmdId: Dts.ECommandId.adhoc_login,
    name: '登录',
    ReqClass: CommandLoginReq as any,
    RespClass: null
})

new CommandLoginReq({instanceId: Dts.dispatcherInstanceName});

