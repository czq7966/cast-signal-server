import { ADHOCCAST } from '../../../../../common';
import * as Common from '../../../../../common';


export class CustomWindow {
    static close(instanceId: string): Promise<any> {
        let cmd = new ADHOCCAST.Cmds.CommandReq({instanceId: instanceId});
        cmd.data.cmdId = Common.Cmds.ECommandId.custom_window_close;
        cmd.data.props = {};
        let promise = cmd.sendCommand()
        cmd.destroy;
        cmd = null;
        return promise;        
    }

    static minimize(instanceId: string): Promise<any> {
        let cmd = new ADHOCCAST.Cmds.CommandReq({instanceId: instanceId});
        cmd.data.cmdId = Common.Cmds.ECommandId.custom_window_minimize;
        cmd.data.props = {};
        let promise = cmd.sendCommand()
        cmd.destroy;
        cmd = null;
        return promise;        
    }
}