import * as Dts from "../dts";
import * as Cmds from '../cmds/index'
import * as Modules from '../modules'
import { ServiceRoom } from "./room";
import { ServiceRoomClose } from "./room-close";


export class ServiceUser extends Cmds.Common.Base {
    static isLogin(sckUser: Modules.SocketUser): boolean {
        return !!(sckUser.user && sckUser.users.users.exist(sckUser.user.id))
    }

    static login(sckUser: Modules.SocketUser, data: Dts.ICommandData<Dts.ICommandLoginReqDataProps>): Promise<any> {
        let room = data.props.user.room;
        if (!ServiceUser.isLogin(sckUser)) {
            let user = Object.assign({}, data.props.user) as Dts.IUser;  
            user.room = room;
            sckUser.user = user;        
            sckUser.users.users.add(user.id, sckUser);
            return ServiceRoom.joinOrOpen(room.id, sckUser)
        } else {
            return Promise.resolve(room.id)
        }
    }

    static logout(sckUser: Modules.SocketUser, 
                    data?: Dts.ICommandData<Dts.ICommandLogoutReqDataProps>, 
                    includeSelf?: boolean, disconnect?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.isLogin(sckUser)) {
                data = data || {
                    cmdId: Dts.ECommandId.adhoc_logout,
                    props: {
                        user: sckUser.user
                    }
                }
                data.to = {type: 'room', id: sckUser.user.room.id};
                sckUser.sendCommand(data, includeSelf);
                this.closeOpenRooms(sckUser);
                sckUser.users.users.del(sckUser.user.id);
                delete sckUser.user;
                ServiceRoom.leave(data.props.user.room.id, sckUser)
                .then(() => {
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
            }    
            disconnect && sckUser.socket.connected && sckUser.socket.disconnect();
        })
    }
    static closeOpenRooms(sckUser: Modules.SocketUser) {
        sckUser.openRooms.keys().forEach(key => {
            ServiceRoomClose.close(key, sckUser)
        })
    }    
}