import * as Dts from "../dts";
import * as Cmds from '../cmds/index'
import * as Modules from '../modules'
import { ServiceNamespace } from "./namespace";


export class ServiceRoom {
    static get(roomid: string, sckUser: Modules.ISocketUser): Dts.IRoom {
        return sckUser.users.rooms.get(roomid);
    }
    static create(roomid: string, sckUser: Modules.ISocketUser): Dts.IRoom {
        let uroom = this.get(roomid, sckUser);
        if (!uroom) {
            uroom = {
                id: roomid,
                sim: Cmds.Common.Helper.uuid()
            }
            sckUser.users.rooms.add(roomid, uroom);
        }
        return uroom;        
    }
    static exist(roomid: string, sckUser: Modules.ISocketUser): boolean {
        let uroom = this.get(roomid, sckUser);
        if (uroom) {
            let room = sckUser.socket.adapter.rooms[uroom.sim];
            return !!room;            
        }
        return false;
    }
    static open(roomid: string, sckUser: Modules.ISocketUser, isOwner: boolean = true): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!ServiceRoom.exist(roomid, sckUser)) {
                let sim = this.create(roomid, sckUser).sim;
                sckUser.socket.join(sim, err => {
                    if (err) {
                        reject(err)                    
                    } else {                        
                        isOwner && sckUser.openRooms.add(roomid, true);
                        resolve(roomid)
                    }
                })
            } else {
                reject('Room already exist!')
            }            
        })
    }
    static close(roomid: string, sckUser: Modules.ISocketUser): Promise<any> {
        let promises = [];
        let adapter = sckUser.socket.adapter;
        let uroom = this.get(roomid, sckUser);
        let sim = uroom && uroom.sim || '';
        let room = adapter.rooms[sim];
        if (room) {
            Object.keys(room.sockets).forEach(key => {
                let promise = new Promise((resolve, reject) => {
                    adapter.del(key, sim, err => {                        
                        resolve();
                    })
                })
                promises.push(promise)                    
            } )
        }
        sckUser.openRooms.del(roomid);
        sckUser.users.rooms.del(roomid);

        if (promises.length > 0)
            return Promise.all(promises)
        else 
            return Promise.resolve();
    }    
    static join(roomid: string, sckUser: Modules.ISocketUser):  Promise<any> {
        return new Promise((resolve, reject) => {
            if (ServiceRoom.exist(roomid, sckUser)) {
                let sim = this.get(roomid, sckUser).sim;
                sckUser.socket.join(sim, err => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(roomid)
                    }
                });
            } else {
                reject('Room not exist')                
            }
        })
    }
    static leave(roomid: string, sckUser: Modules.ISocketUser): Promise<any> {
        return new Promise((resolve, reject) => {
            let uroom = this.get(roomid, sckUser);
            let sim = uroom && uroom.sim || '';
            sckUser.socket.leave(sim, err => {
                resolve()
            });    
        })
    }    
    static joinOrOpen(roomid: string, sckUser: Modules.ISocketUser): Promise<any> {
        return new Promise((resolve, reject) => {
            let uroom = this.create(roomid, sckUser);
            sckUser.socket.join(uroom.sim, err => {
                if (err) {
                    reject(err)                    
                } else {
                    resolve(roomid)
                }
            })
        })
    }
    static async leaveOrClose(roomid: string, sckUser: Modules.ISocketUser): Promise<any> {
        await this.leave(roomid, sckUser);
        let users = ServiceNamespace.getRoomUsers(sckUser.users.snsp, roomid);
        if (users.length = 0 ) {
            await this.close(roomid, users[0]);
        }
    }    
    static changeId(oldId: string, newId: string, sckUser: Modules.ISocketUser): Promise<any> {
        let uroom = this.get(oldId, sckUser);
        if (uroom) {
            uroom.id = newId;
            sckUser.users.rooms.del(oldId);
            sckUser.users.rooms.add(newId, uroom);
            sckUser.openRooms.del(oldId);
            sckUser.openRooms.add(newId, true);
            return Promise.resolve(newId);
        } else {
            return Promise.reject('Room not exist ' + oldId)
        }
    }
    static async onDeliverCommand(namespace: Modules.ISocketNamespace, roomid: string, sckUser: Modules.ISocketUser, cmd: Dts.ICommandData<any>, includeSelf: boolean) {
        let _sckUser = sckUser || ServiceNamespace.getRoomFirstUser(namespace, roomid);
        _sckUser && _sckUser.dispatcher.sendCommand(cmd, _sckUser, includeSelf);
    }
}