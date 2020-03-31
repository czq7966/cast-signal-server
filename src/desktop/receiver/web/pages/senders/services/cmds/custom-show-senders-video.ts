import { ADHOCCAST } from '../../../../../common';
import * as Modules from '../../modules'
import * as Common from '../../../../../common';

export class CustomShowSendersVideo {
    static req(instanceId: string, senders: {[id: string]: ADHOCCAST.Cmds.IUser}): Promise<any> {
        let cmd = new ADHOCCAST.Cmds.CommandReq({instanceId: instanceId});
        cmd.data.cmdId = Common.Cmds.ECommandId.custom_show_senders_video;
        cmd.data.extra = senders;        
        let promise = cmd.sendCommand()
        cmd.destroy;
        cmd = null;
        return promise;   
    }

    static onResp(cmd: ADHOCCAST.Cmds.Common.ICommand): Promise<any> {

        return;
    }
}