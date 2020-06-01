import * as Modules from '../../modules'
import * as Services_Cmds from '../cmds';
import * as Common from '../../../../../common'
import { ADHOCCAST } from '../../../../../common'
import { IPCConnection } from './ipc-connection';

export class AdhocConnection {
    static on_before_root(adhocConnection: Modules.IAdhocConnection, cmd: ADHOCCAST.Cmds.Common.ICommand) {

    }
    static on_after_root(adhocConnection: Modules.IAdhocConnection, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;
        switch(cmdId) {
            case ADHOCCAST.Cmds.ECommandId.adhoc_login:
            case ADHOCCAST.Cmds.ECommandId.adhoc_hello:
            case ADHOCCAST.Cmds.ECommandId.room_close:
            case ADHOCCAST.Cmds.ECommandId.room_leave:
            case ADHOCCAST.Cmds.ECommandId.room_hello:
            case ADHOCCAST.Cmds.ECommandId.stream_room_hello:
            case ADHOCCAST.Cmds.ECommandId.stream_webrtc_onrecvstreaminactive:
            case ADHOCCAST.Cmds.ECommandId.stream_webrtc_onrecvstream:
                break;
            case ADHOCCAST.Cmds.ECommandId.adhoc_logout:
                this.on_adhoc_logout(adhocConnection, cmd)
                break;
            case ADHOCCAST.Cmds.ECommandId.user_state_onchange:
                this.on_user_state_onchange(adhocConnection, cmd);
                break;
            case ADHOCCAST.Cmds.ECommandId.network_disconnect:
                this.on_network_disconnect(adhocConnection, cmd);
                break;
            default:
                break;
        }

        if (cmd.data.type === ADHOCCAST.Dts.ECommandType.resp && cmd.data.sessionId ) {
            cmd.data.sessionId = null;
        }       

        IPCConnection.invokeCommand(cmd.data);
    }        
    static on_adhoc_logout(adhocConnection: Modules.IAdhocConnection, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;        
        if (type == ADHOCCAST.Cmds.ECommandType.req) {
            let props = cmd.data.props as ADHOCCAST.Cmds.ICommandDataProps;
            let user = props.user;
            this.offSending(adhocConnection, user);
        }
    }
    static _default_view_id: string = ADHOCCAST.Cmds.Common.Helper.uuid();
    static getDefaultViewId(userId: string): string {
        return userId + "_" + this._default_view_id;
    }
    static async on_user_state_onchange(adhocConnection: Modules.IAdhocConnection, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        let me = adhocConnection.connection.rooms.getLoginRoom().me().item;
        var props = cmd.data.props as ADHOCCAST.Cmds.ICommandDataProps;
        var user = props.user;
        if (me.id != user.id) {
          let values: ADHOCCAST.Cmds.Common.Helper.IStateChangeValues = user.extra;
          if (ADHOCCAST.Cmds.Common.Helper.StateMachine.isset(values.chgStates, ADHOCCAST.Cmds.EUserState.stream_room_sending) &&
            ADHOCCAST.Cmds.Common.Helper.StateMachine.isset(values.newStates, ADHOCCAST.Cmds.EUserState.stream_room_sending)) {
            await this.onSending(adhocConnection,user);
            // this.joinUserStreamRoom(adhocConnection, user.id);
            this.checkAutoConnectAndJoinUserStreamRoom(adhocConnection, this.getDefaultViewId(user.id), user.id);
          } else if (ADHOCCAST.Cmds.Common.Helper.StateMachine.isset(values.chgStates, ADHOCCAST.Cmds.EUserState.stream_room_sending) &&
                     !ADHOCCAST.Cmds.Common.Helper.StateMachine.isset(values.newStates, ADHOCCAST.Cmds.EUserState.stream_room_sending)) {
            this.offSending(adhocConnection, user);
            this.decRecvingClient(adhocConnection, this.getDefaultViewId(user.id))
          }
        }
    }
    static async on_network_disconnect(adhocConnection: Modules.IAdhocConnection, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        let futures: Promise<any>[] = [];
        adhocConnection.sendingUsers.keys().forEach(key => {
            let user = adhocConnection.sendingUsers.get(key);
            futures.push(this.offSending(adhocConnection, user));
        });

        await Promise.all(futures);
        
        let seconds = 3;
        console.info(`network_disconnect, retry login after ${seconds} seconds`, "");
        setTimeout(() => {
            this.login(adhocConnection);
        }, seconds * 1000);

    }
    static async login(adhocConnection: Modules.IAdhocConnection)  {
        return this.retryLogin(adhocConnection);
    }
    static async retryLogin(adhocConnection: Modules.IAdhocConnection, loginUser?: ADHOCCAST.Cmds.IUser) {
        if (adhocConnection.connection == null) {
            let connParams: ADHOCCAST.IConnectionConstructorParams = {
                instanceId: adhocConnection.instanceId,
                signalerBase: adhocConnection.config.items.signaler,
                namespace: adhocConnection.config.items.organization,
                parent: adhocConnection,
                notInitDispatcherFilters: true
            }
    
            adhocConnection.connection = ADHOCCAST.Connection.getInstance(connParams);            
            adhocConnection.initEvents();
        }
    
        var conn = adhocConnection.connection;
        var _login = async () => {
          let user: ADHOCCAST.Cmds.IUser = loginUser || {
              id: null,
              sid: adhocConnection.config.getUserSid(),
              nick: adhocConnection.config.items.user.nick,
              room: {
                  id: adhocConnection.config.getRoomId()
              },
              host: {
                  os: {
                      name: ADHOCCAST.Cmds.Common.Helper.HostInfo.Name as any,
                      version: ADHOCCAST.Cmds.Common.Helper.HostInfo.FullVersion as any
                  },
                  app: {
                      name: 'web receiver',
                      version: '0.0.0.0'
                  }
              }
          }
          return await conn.retryLogin(user, null, null, 5 * 1000);
        };
    
        if (conn.signaler.connected()) {
          try{
            conn.signaler.disconnect();
          }catch(e) {
            return await _login();
          }
        } else {
          return await _login();
        }
    }
    static async refreshLoginID(adhocConnection?: Modules.IAdhocConnection) {
        adhocConnection = adhocConnection || new Modules.AdhocConnection({
            instanceId: ADHOCCAST.Cmds.Common.Helper.uuid()
        });
        await this.retryLogin(adhocConnection, {id: null});
        if (adhocConnection.connection.isLogin()) {
            let loginID = adhocConnection.connection.rooms.getLoginRoom().me().item.sid;
            adhocConnection.connection.disconnect();
            return loginID;
        } 
    }
    static getRecvingClientCount(adhocConnection: Modules.IAdhocConnection, userId: string): number {
        let count = 0;
        let clients = adhocConnection.recvingClients;
        clients.values().forEach(uid => {
          if (uid == userId) count++;
        });
        return count;
    }    
    static async incRecvingClient(adhocConnection: Modules.IAdhocConnection, viewId: string, userId: string) {
        if (viewId != null && userId != null) {
            adhocConnection.recvingClients.add(viewId, userId);
            await this.joinUserStreamRoom(adhocConnection, userId);
        }
    }
    static async checkAutoConnectAndJoinUserStreamRoom(adhocConnection: Modules.IAdhocConnection, viewId: string, userId: string) {
        if (this.userSupportFeature_pause(adhocConnection, userId)) {
            this.incRecvingClient(adhocConnection, viewId, userId)
        } else {
            this.joinUserStreamRoom(adhocConnection, userId);
        } 
    }
    static  decRecvingClient(adhocConnection: Modules.IAdhocConnection, viewId: string) {
        var userId = adhocConnection.recvingClients.del(viewId);
        this.joinUserStreamRoom(adhocConnection, userId);
    }
    static checkOnlyDefaultView(adhocConnection: Modules.IAdhocConnection, userId: string) {
        if (this.userSupportFeature_pause(adhocConnection, userId)) {
            let viewId = this.getDefaultViewId(userId);
            let count = this.getRecvingClientCount(adhocConnection, userId);
            if (adhocConnection.recvingClients.get(viewId) == userId && count == 1) {
                Common.Services.Cmds.CustomApplyVideoConstraints.req(
                    adhocConnection.instanceId, 
                    userId, 
                    'min');
                this.pauseRemoteCast(adhocConnection, userId);
            }
        }
    }
    static joinUserStreamRoom(adhocConnection: Modules.IAdhocConnection, userId: string): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            if (userId != null) {
                let joining = adhocConnection.joiningUsers.exist(userId);
                let count = this.getRecvingClientCount(adhocConnection, userId);
                let mMe: ADHOCCAST.Modules.IUser;
                if (adhocConnection.connection.isLogin()) {
                    let streamRoom = ADHOCCAST.Services.Modules.User.getStreamRoom2(adhocConnection.instanceId, userId);
                    streamRoom && (mMe = streamRoom.me());
                }

                if (!joining && count <=0) {
                    this.delayLeaveUserStream(adhocConnection, userId, 500);
                    resolve()
                }
                else {
                    ADHOCCAST.Dts.Command_stream_webrtc_on_prefix                
                    if (!mMe || 
                        mMe.hasRecvStream () != true || 
                        mMe.getPeer().getRtc().connectionState == 'failed') {
                        this.recvUserStream(adhocConnection, userId)
                        .then(v => {                            
                            mMe = adhocConnection.connection.rooms.getLoginRoom().getUser(userId).getStreamRoom().me();
                            adhocConnection.recvingUsers.del(userId);
                            adhocConnection.recvingUsers.add(userId, mMe);
                            if (mMe.hasRecvStream())
                                resolve(mMe.peer.streams.recvs.values()[0])
                            else 
                                resolve()
                        })
                        .catch(e => {
                            resolve()
                        });
                    } else {
                        resolve()
                    }
                }
            } else {
                resolve()
            }    
        });

        promise
        .then(v => {
            this.checkOnlyDefaultView(adhocConnection, userId);
        })
        .catch(e => {
            this.checkOnlyDefaultView(adhocConnection, userId);
        })

        return promise;
    }
    static async refreshSendings(adhocConnection: Modules.IAdhocConnection) {
        adhocConnection.sendingUsers.keys().forEach( async key => {
            let user = adhocConnection.sendingUsers.get(key);
            let cmd: ADHOCCAST.Dts.ICommandData<ADHOCCAST.Dts.ICommandReqDataProps> = {
                cmdId: Common.Cmds.ECommandId.custom_on_sending_stream,
                props: {
                    user: user
                }
          };
          await IPCConnection.invokeCommand(cmd);
        });
    }
    static async onSending(adhocConnection: Modules.IAdhocConnection, user: ADHOCCAST.Cmds.IUser)  {
        let data: ADHOCCAST.Cmds.ICommandData<ADHOCCAST.Cmds.ICommandDataProps>;
        try {
          data = await this.getSenderInfo(adhocConnection, user.id) as ADHOCCAST.Cmds.ICommandData<ADHOCCAST.Cmds.ICommandDataProps>;
        } catch(e) {}
    
    
        console.info("onSending", user);
        adhocConnection.sendingUsers.add(user.id, user);
        let cmd: ADHOCCAST.Dts.ICommandData<ADHOCCAST.Dts.ICommandReqDataProps> = {
            cmdId: Common.Cmds.ECommandId.custom_on_sending_stream,
            props: {
                user: user,
                extra: data && data.props && data.props.extra
            }
        };
        ADHOCCAST.Services.Cmds.User.dispatchCommand2(adhocConnection.instanceId, cmd);
    }
    static async offSending(adhocConnection: Modules.IAdhocConnection, user: ADHOCCAST.Cmds.IUser)  {
        if (adhocConnection.sendingUsers.exist(user.id)) {
            console.info("offSending", user);
            adhocConnection.sendingUsers.del(user.id);
            let cmd: ADHOCCAST.Dts.ICommandData<ADHOCCAST.Dts.ICommandReqDataProps> = {
                cmdId: Common.Cmds.ECommandId.custom_off_sending_stream,
                props: {
                    user: user,
                }
            };
            ADHOCCAST.Services.Cmds.User.dispatchCommand2(adhocConnection.instanceId, cmd);
        }
    }
    static recvUserStream(adhocConnection: Modules.IAdhocConnection, userId: string): Promise<any> {
        return  new Promise((resolve, reject) => {
            let user = adhocConnection.sendingUsers.get(userId);
            let joining = adhocConnection.joiningUsers.get(userId);
            if (joining) {
                reject('user joining stream room');
                return;
            }
            
        
            if (user != null && ADHOCCAST.Cmds.Common.Helper.StateMachine.isset(user.states, ADHOCCAST.Cmds.EUserState.stream_room_sending)) {
                adhocConnection.joiningUsers.add(userId,true);
                let streamRoom: ADHOCCAST.Cmds.IRoom = {
                    id: ADHOCCAST.Services.Cmds.User.getStreamRoomId(user)
                }
                let toUser: ADHOCCAST.Cmds.IUser = {
                    id: user.id,
                    room: streamRoom
                };
                ADHOCCAST.Services.Cmds.StreamRoomJoin.joinAndHelloAndReady(adhocConnection.instanceId, toUser)
                .then(data => {
                    adhocConnection.joiningUsers.del(userId);
                    resolve(data);
                    this.leaveUserStream(adhocConnection, userId);
                })
                .catch(e => {
                    adhocConnection.joiningUsers.del(userId);
                    reject(e);
                    this.leaveUserStream(adhocConnection, userId);
              });
            } else {
                reject('user has not sending stream');
            }
        })

    }
    static delayLeaveUserStream(adhocConnection: Modules.IAdhocConnection,userId: string, delayMilliseconds: number): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.leaveUserStream(adhocConnection, userId);
                resolve();
            }, delayMilliseconds);
        })

    }
    static async leaveUserStream(adhocConnection: Modules.IAdhocConnection, userId: string)  {
        if (userId != null) {
            let count = this.getRecvingClientCount(adhocConnection, userId);
            if (adhocConnection.connection.isLogin()) {
                let mUser = adhocConnection.connection.rooms.getLoginRoom().getUser(userId);
                let mMe = mUser && mUser.getStreamRoom() && mUser.getStreamRoom().me();
                if (mMe != null && count <= 0) {
                    adhocConnection.recvingUsers.del(userId);
                    ADHOCCAST.Services.Cmds.StreamRoomLeave.leave(adhocConnection.connection.instanceId, mMe.room.item);
                }
            }
        }
    }      
    static stopRemoteCast(adhocConnection: Modules.IAdhocConnection, userId: string): Promise<any> {
        let cmd = new ADHOCCAST.Cmds.CommandReq({instanceId: adhocConnection.instanceId, props:{}});
        cmd.data.cmdId = ADHOCCAST.Cmds.ECommandId.custom;
        cmd.data.extra = Common.Cmds.ECommandId.custom_stop_cast;
        cmd.data.to = {type: 'user', id: userId};
        let promise = cmd.sendCommand();
        cmd.destroy();
        cmd = null;
        return promise;    
    } 
    static pauseRemoteCast(adhocConnection: Modules.IAdhocConnection, userId: string): Promise<any> {
        return ADHOCCAST.Cmds.CommandReq.req(adhocConnection.instanceId, {
            cmdId: ADHOCCAST.Cmds.ECommandId.custom,
            props: {},
            extra: Common.Cmds.ECommandId.custom_pause_cast,
            to: {type: 'user', id: userId}
        })
    }   
    static resumeRemoteCast(adhocConnection: Modules.IAdhocConnection, userId: string): Promise<any> {
        return ADHOCCAST.Cmds.CommandReq.req(adhocConnection.instanceId, {
            cmdId: ADHOCCAST.Cmds.ECommandId.custom,
            props: {},
            extra: Common.Cmds.ECommandId.custom_resume_cast,
            to: {type: 'user', id: userId}
        })
    } 
    static getSenderInfo(adhocConnection: Modules.IAdhocConnection, userId: string): Promise<any> {
        let cmd = new ADHOCCAST.Cmds.CommandReq({instanceId: adhocConnection.connection.instanceId, props:{}});
        cmd.data.cmdId = ADHOCCAST.Cmds.ECommandId.custom;
        cmd.data.extra = Common.Cmds.ECommandId.custom_get_sender_info;
        cmd.data.to = {type: 'user', id: userId};

        cmd.data.respTimeout = 5 * 1000;
        var future = cmd.sendCommandForResp();
        cmd.destroy();
        cmd = null;
        return future;
    } 
    static userSupportFeature_pause(adhocConnection: Modules.IAdhocConnection, userId: string): boolean {
        let mLoginRoom = ADHOCCAST.Services.Modules.Rooms.getLoginRoom(adhocConnection.instanceId);
        let mUser = mLoginRoom && mLoginRoom.getUser(userId);
        let user = mUser && mUser.item;
        let host = user && user.host;
        let app = host && host.app || {name: '', version: '0.0.0.0'}
        let appVerCode = ADHOCCAST.Cmds.Common.Helper.versionToCode(app.version);
        let minVerCdeo = ADHOCCAST.Cmds.Common.Helper.versionToCode('1.7.1.0');

        return appVerCode >= minVerCdeo;
    }   
    static getSenderRtcConnectionState(adhocConnection: Modules.IAdhocConnection, userId: string): RTCPeerConnectionState {
        if (adhocConnection.connection.isLogin()) {
            let streamRoom = ADHOCCAST.Services.Modules.User.getStreamRoom2(adhocConnection.instanceId, userId);
            let mMe = streamRoom && streamRoom.me();
            if (mMe && mMe.peer && mMe.peer.rtc)
                return mMe.peer.rtc.connectionState;
        }
    }
}