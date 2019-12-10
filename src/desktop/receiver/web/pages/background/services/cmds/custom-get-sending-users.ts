import { ADHOCCAST } from '../../../../../common';
import * as Modules from '../../modules';
import * as Common from '../../../../../common';


export class CustomGetSendingUsers {
    static onReq(cmd: ADHOCCAST.Cmds.Common.ICommand): Promise<any> {
        return this.resp(cmd.instanceId, cmd)
    }
    static resp(instanceId: string, reqCmd?: ADHOCCAST.Cmds.Common.ICommand): Promise<any> {
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
        if (reqCmd) {
            return ADHOCCAST.Cmds.CommandResp.resp(reqCmd as any, data);
        }
        else  {
            data.cmdId = Common.Cmds.ECommandId.custom_get_sendering_users;
            data.type = ADHOCCAST.Dts.ECommandType.resp;            
            return ADHOCCAST.Services.Cmds.User.dispatchCommand2(instanceId, data);
        }
    }
}