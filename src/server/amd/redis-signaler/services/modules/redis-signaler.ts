import * as Dts from '../../dts'
import * as Modules from '../../modules'
import * as Network from '../../network'
import { ADHOCCAST } from '../../libex'

export class RedisSignaler {
    // onRecvFilter
    static RecvFilter = {
        onAfterRoot(signaler: Modules.IRedisSignaler, cmd: ADHOCCAST.Cmds.Common.ICommandData<ADHOCCAST.Dts.ICommandDataProps>): any {
            switch(cmd.cmdId) {
                case ADHOCCAST.Dts.ECommandId.adhoc_login:
                    this.on_after_adhoc_login(signaler, cmd);
                    return ADHOCCAST.Cmds.Common.EEventEmitterEmit2Result.preventRoot;
                    break;
                case Dts.ECommandId.signal_center_deliver:
                    this.on_signal_center_deliver(signaler, cmd);
                    return ADHOCCAST.Cmds.Common.EEventEmitterEmit2Result.preventRoot;
                    break;
            }                
        },
        
        async on_after_adhoc_login(signaler: Modules.IRedisSignaler, cmd: ADHOCCAST.Cmds.Common.ICommandData<ADHOCCAST.Dts.ICommandDataProps>) {
            if (cmd.respResult && cmd.type == ADHOCCAST.Cmds.ECommandType.resp) {
                let user = cmd.props.user
                await signaler.subscribe(signaler.getServerChannel(signaler.server.getId()))
                await signaler.subscribe(signaler.getRoomChannel(user.room.id));
            }            
            ADHOCCAST.Cmds.Common.EDCoder.onCommand(cmd, signaler.conneciton.dispatcher);
        },

        async on_signal_center_deliver(signaler: Modules.IRedisSignaler, cmd: ADHOCCAST.Cmds.Common.ICommandData<ADHOCCAST.Dts.ICommandDataProps>) {
            signaler.onDeliverCommand(cmd)
        }
    }

    // onSendFilter
    static SendFilter = {
        onAfterRoot(signaler: Modules.IRedisSignaler, cmd: ADHOCCAST.Cmds.Common.ICommandData<ADHOCCAST.Dts.ICommandDataProps>): any {
            if (!cmd.from) {
                cmd.from = {};
                let me = ADHOCCAST.Services.Cmds.User.CurrentUser(signaler.conneciton.instanceId);
                if (me) {
                    cmd.from.type = 'server';
                    cmd.from.id = me.id;
                } else {
                    cmd.from.type = 'socket';
                    cmd.from.id = signaler.conneciton.signaler.id();
                }
            }
                 
            switch(cmd.cmdId) {
                case ADHOCCAST.Dts.ECommandId.adhoc_login:
                    this.on_after_adhoc_login(signaler, cmd);
                    return ADHOCCAST.Cmds.Common.EEventEmitterEmit2Result.preventRoot;
                case Dts.ECommandId.signal_center_deliver:
                    this.on_signal_center_deliver(signaler, cmd);
                    break;   
            }            
        },
    
        on_after_adhoc_login(signaler: Modules.IRedisSignaler, data: ADHOCCAST.Cmds.Common.ICommandData<ADHOCCAST.Dts.ICommandDataProps>) {
            //Resp
            let props = data.props || {};
            let user = props.user || {} as any;
            user.id = user.id || signaler.server.getId()
            user.sid = user.sid || signaler.conneciton.signaler.id()
            user.room = user.room || {} as any;
            user.room.id = user.room.id || "#server:" + 'servers';
    
            props.user = user;
            let resp = Object.assign({}, data) as ADHOCCAST.Dts.ICommandData<any>;
            resp.type = ADHOCCAST.Dts.ECommandType.resp;
            resp.to = data.from;
            resp.from = {type:'server', id: ''}
            resp.props = props;        
            resp.respResult = true;
    
            signaler.conneciton.dispatcher.onCommand(resp);
        },
        on_signal_center_deliver(signaler: Modules.IRedisSignaler, data: ADHOCCAST.Cmds.Common.ICommandData<ADHOCCAST.Dts.ICommandDataProps>) {
            let extra = data.extra as ADHOCCAST.Dts.ICommandData<Dts.ICommandDeliverDataExtraProps>
            if (extra.to.type == 'server') 
                extra.to.id = extra.to.id || signaler.server.getId();

            if (data.to.type == 'server' && !data.to.id) {
                data.to =  extra.to;
            }
                
        }
    }

    // onAfterRoot
    static onAfterRoot(signaler: Modules.IRedisSignaler, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        switch(cmd.data.cmdId) {
            case ADHOCCAST.Cmds.ECommandId.network_disconnect:
                this.on_after_network_disconnect(signaler, cmd);
                break;
        }                
    }
    static async on_after_network_disconnect(signaler: Modules.IRedisSignaler, cmd: ADHOCCAST.Cmds.Common.ICommand) {
        await signaler.tryLogin();
    }    


    static OnDeliverCommand = {
        async onDevilerCommand(signaler: Modules.IRedisSignaler, cmd: ADHOCCAST.Cmds.Common.ICommandData<Dts.ICommandDeliverDataExtraProps>) {
            let result: boolean = false;
            result == result || await this.onBeforeCommand(cmd);
            result == result || await this.onCommand(cmd);
            result == result || await this.onAfterCommand(cmd);
            return result
        },
    
        async onCommand(signaler: Modules.IRedisSignaler, cmd: ADHOCCAST.Cmds.Common.ICommandData<Dts.ICommandDeliverDataExtraProps>) {
            return true;
    
        },
    
        async onBeforeCommand(signaler: Modules.IRedisSignaler, cmd: ADHOCCAST.Cmds.Common.ICommandData<Dts.ICommandDeliverDataExtraProps>) {
            return false;
    
        },
        async onAfterCommand(signaler: Modules.IRedisSignaler, cmd: ADHOCCAST.Cmds.Common.ICommandData<Dts.ICommandDeliverDataExtraProps>) {
            return false
        }          
    }
}