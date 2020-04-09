import { ADHOCCAST } from '../../../../../common';
import * as Common from '../../../../../common';

export class CustomStopCast {
    static async req(instanceId: string, userId: string) {
        let cmd = new ADHOCCAST.Cmds.CommandReq({instanceId: instanceId});
        cmd.data.cmdId = Common.Cmds.ECommandId.custom_stop_cast;
        cmd.data.props = {
            user: {
                id: userId
            }
        }     
        let promise = cmd.sendCommand()
        cmd.destroy;
        cmd = null;
        return promise;   
    }
}