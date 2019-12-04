import { ADHOCCAST } from '../../../../../common';
import * as Modules from '../../modules'
import * as Common from '../../../../../common';


export class CustomGetCurrentUser {
    static onReq(cmd: ADHOCCAST.Cmds.Common.ICommand): Promise<any> {
        let user: ADHOCCAST.Cmds.IUser;        
        let conn = Modules.Main.getInstance<Modules.Main>().adhocConnection.connection;
        if (conn.isLogin()) {
            user = conn.rooms.getLoginRoom().me().item;
        }        
        let data: ADHOCCAST.Dts.ICommandData<ADHOCCAST.Dts.ICommandRespDataProps> = {
            props: {
                user: user
            }
        }
        return ADHOCCAST.Cmds.CommandResp.resp(cmd as any, data);
    }

    static resp(instanceId: string): Promise<any> {
        let cmd = new ADHOCCAST.Cmds.CommandReq({instanceId: instanceId});
        cmd.data.cmdId = Common.Cmds.ECommandId.custom_get_current_user;
        let promise = this.onReq(cmd);
        cmd.destroy;
        cmd = null;
        return promise;        
    }
}