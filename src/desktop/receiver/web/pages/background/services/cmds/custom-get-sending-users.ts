import { ADHOCCAST } from '../../../../../common';
import * as Modules from '../../modules';
import * as Common from '../../../../../common';


export class CustomGetSendingUsers {
    static onReq(cmd: ADHOCCAST.Cmds.Common.ICommand): Promise<any> {
        let users: {[id: string]: ADHOCCAST.Cmds.IUser} = {};
        let data: ADHOCCAST.Dts.ICommandData<ADHOCCAST.Dts.ICommandRespDataProps> = {}   ;
        let conn = Modules.Main.getInstance<Modules.Main>().adhocConnection.connection;
        if (conn.isLogin()) {
            let room = conn.rooms.getLoginRoom();
            room.users.keys().forEach(key => {
                let user = room.users.get(key);
                if (user.states.isset(ADHOCCAST.Dts.EUserState.stream_room_sending)) {
                    users[user.item.id] = user.item
                }
            });
            data.props = {
                user: room.me().item
            };     
        }        
        data.extra = users;              
        return ADHOCCAST.Cmds.CommandResp.resp(cmd as any, data);
    }
    static resp(instanceId: string): Promise<any> {
        let cmd = new ADHOCCAST.Cmds.CommandReq({instanceId: instanceId});
        cmd.data.cmdId = Common.Cmds.ECommandId.custom_get_sendering_users;
        let promise = this.onReq(cmd);
        cmd.destroy;
        cmd = null;
        return promise;
    }
}