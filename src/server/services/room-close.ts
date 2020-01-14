import * as Dts from '../cmds/dts';
import * as Cmds from '../cmds/index'
import * as Modules from '../modules'
import { ServiceRoom } from './room';

var Tag = 'ServiceRoomClose'
export class ServiceRoomClose extends Cmds.Common.Base {
    static onDispatched = {
        async req(cmd: Cmds.CommandRoomCloseReq, sckUser: Modules.SocketUser) {
            let data = cmd.data;
            let room = data.props.user.room
            let req: Dts.ICommandData<Dts.ICommandRoomCloseReqDataProps>;
            let resp: Dts.ICommandData<Dts.ICommandRoomCloseRespDataProps>;
            // Send to members
            req = Object.assign({}, data);     
            req.to = {type: 'room', id: room.id}
            await sckUser.sendCommand(req);

            // close room
            ServiceRoom.close(room.id, sckUser)
            .then(async () => {
                resp = Object.assign({}, data, {
                    type: Dts.ECommandType.resp,
                    from: {type: 'server', id: ''},
                    to: data.from
                }) as any; 
                resp.respResult = true
                await sckUser.sendCommand(resp);
            })
            .catch(async err => {
                resp = Object.assign({}, data, {
                    type: Dts.ECommandType.resp,
                    from: {type: 'server', id: ''},
                    to: data.from                        
                }) as any; 
                resp.respResult = false;
                resp.respMsg = err;
                await sckUser.sendCommand(resp);
            })
        }
    }

    static async close(roomid: string, sckUser: Modules.ISocketUser): Promise<any> {
        let req: Dts.ICommandData<Dts.ICommandRoomCloseReqDataProps>;
        req = {
            cmdId: Dts.ECommandId.room_close,
            to: {type: 'room', id: roomid},
            props: {
                user: {
                    id: sckUser.user.id,
                    room: {
                        id: roomid
                    }
                }

            }
        }
        await sckUser.sendCommand(req);
        return ServiceRoom.close(roomid, sckUser);
    }
}