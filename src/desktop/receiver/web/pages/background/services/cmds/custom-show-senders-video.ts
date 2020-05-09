import { ADHOCCAST } from '../../../../../common';
import * as Common from '../../../../../common';

export class CustomShowSendersVideo {
    static async req(instanceId: string, senders: {[id: string]: ADHOCCAST.Cmds.IUser}, fullSenderId: string) {
        let data: ADHOCCAST.Dts.ICommandData<ADHOCCAST.Dts.ICommandReqDataProps> = {} 
        data.cmdId = Common.Cmds.ECommandId.custom_show_senders_video;
        data.props = {
            extra: fullSenderId
        }    
        data.extra = senders;   
        ADHOCCAST.Services.Cmds.User.dispatchCommand2(instanceId, data); 
    }
    static onReq(cmd: ADHOCCAST.Cmds.Common.ICommand, senders: {[id: string]: ADHOCCAST.Cmds.IUser}): Promise<any> {
        return this.resp(cmd.instanceId, cmd, cmd.data.extra)
    }
    static resp(instanceId: string, reqCmd?: ADHOCCAST.Cmds.Common.ICommand, senders?: {[id: string]: ADHOCCAST.Cmds.IUser}): Promise<any> {
        let data: ADHOCCAST.Dts.ICommandData<ADHOCCAST.Dts.ICommandRespDataProps> = {} 
        data.props = {}    
        data.extra = senders;    
        if (reqCmd) {
            return ADHOCCAST.Cmds.CommandResp.resp(reqCmd as any, data);
        }
        else  { 
            let cmd = new ADHOCCAST.Cmds.CommandResp({instanceId: instanceId});
            cmd.data = data;
            data.cmdId = Common.Cmds.ECommandId.custom_show_senders_video;
            data.type = ADHOCCAST.Dts.ECommandType.resp;   
            let promise = cmd.sendCommand();
            cmd.destroy;
            cmd = null;
            return promise;
        }
    }
}