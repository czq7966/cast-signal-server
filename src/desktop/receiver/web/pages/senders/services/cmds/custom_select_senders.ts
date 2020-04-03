import { ADHOCCAST } from '../../../../../common';
import * as Common from '../../../../../common';

export class CustomSelectSenders {
    static async req(instanceId: string, senders: any) {
        let cmd = new ADHOCCAST.Cmds.CommandReq({instanceId: instanceId});
        cmd.data.cmdId = Common.Cmds.ECommandId.custom_select_senders;
        cmd.data.props = {}
        cmd.data.extra = senders;
        await ADHOCCAST.Services.Cmds.User.dispatchCommand2(instanceId, cmd.data);
        // await cmd.sendCommand();
        cmd.destroy;   
    }
    static async resp(instanceId: string, senders: any) {
        let cmd = new ADHOCCAST.Cmds.CommandResp({instanceId: instanceId});
        cmd.data.cmdId = Common.Cmds.ECommandId.custom_select_senders;
        cmd.data.type = ADHOCCAST.Dts.ECommandType.resp;
        cmd.data.props = {}
        cmd.data.extra = senders;
        await ADHOCCAST.Services.Cmds.User.dispatchCommand2(instanceId, cmd.data);
        // await cmd.sendCommand();
        cmd.destroy;               
    }

}