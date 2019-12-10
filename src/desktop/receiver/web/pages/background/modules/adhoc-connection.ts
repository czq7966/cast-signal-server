import { ADHOCCAST } from '../../../../common';
import * as Services from '../services'
import { Config } from './config';

export interface IAdhocConnection extends ADHOCCAST.Cmds.Common.IBase {
    config: Config
    eventRooter: ADHOCCAST.Cmds.Common.IEventRooter;
    connection: ADHOCCAST.IConnection;
    sendingUsers: ADHOCCAST.Cmds.Common.Helper.KeyValue<ADHOCCAST.Cmds.IUser>;
    recvingUsers: ADHOCCAST.Cmds.Common.Helper.KeyValue<ADHOCCAST.Modules.IUser>;
    recvingClients: ADHOCCAST.Cmds.Common.Helper.KeyValue<string>;
    joiningUsers: ADHOCCAST.Cmds.Common.Helper.KeyValue<boolean>;
    initEvents();
}
export class AdhocConnection extends ADHOCCAST.Cmds.Common.Base implements IAdhocConnection {
    config: Config
    eventRooter: ADHOCCAST.Cmds.Common.IEventRooter;
    connection: ADHOCCAST.IConnection;
    sendingUsers: ADHOCCAST.Cmds.Common.Helper.KeyValue<ADHOCCAST.Cmds.IUser>;
    recvingUsers: ADHOCCAST.Cmds.Common.Helper.KeyValue<ADHOCCAST.Modules.IUser>;
    recvingClients: ADHOCCAST.Cmds.Common.Helper.KeyValue<string>;
    joiningUsers: ADHOCCAST.Cmds.Common.Helper.KeyValue<boolean>;  
    constructor(params?: ADHOCCAST.Cmds.Common.IBaseConstructorParams) {
        super(params);
        this.eventRooter = new ADHOCCAST.Cmds.Common.EventRooter();
        this.config = Config.getInstance();
        this.sendingUsers = new ADHOCCAST.Cmds.Common.Helper.KeyValue<ADHOCCAST.Cmds.IUser>();
        this.recvingUsers = new ADHOCCAST.Cmds.Common.Helper.KeyValue<ADHOCCAST.Modules.IUser>();
        this.recvingClients = new ADHOCCAST.Cmds.Common.Helper.KeyValue<string>();
        this.joiningUsers = new ADHOCCAST.Cmds.Common.Helper.KeyValue<boolean>();      
        this.initEvents();
    }
    destroy() {
        this.unInitEvents();
        this.connection && this.connection.destroy();
        this.eventRooter.destroy();
        this.sendingUsers.destroy();
        this.recvingUsers.destroy();
        this.recvingClients.destroy();
        this.joiningUsers.destroy();
        delete this.connection;
        delete this.eventRooter;
        delete this.sendingUsers;
        delete this.recvingUsers;
        delete this.recvingClients;
        delete this.joiningUsers;
    }
    initEvents() {
        if (this.connection) {
            this.eventRooter.setParent(this.connection.dispatcher.eventRooter);
            this.eventRooter.onBeforeRoot.add(this.onBeforeRoot)
            this.eventRooter.onAfterRoot.add(this.onAfterRoot)     
        }
    }
    unInitEvents() {
        this.eventRooter.onBeforeRoot.remove(this.onBeforeRoot)
        this.eventRooter.onAfterRoot.remove(this.onAfterRoot)
        this.eventRooter.setParent(); 
    }
    onBeforeRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Modules.AdhocConnection.on_before_root(this, cmd);
    }
    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Modules.AdhocConnection.on_after_root(this, cmd);
    }      
}