import { ADHOCCAST } from '../../../../common';
import * as Services from '../services'
import * as PageCommon from '../../common'
import { IPCBGSignaler } from './ipc-bg-signaler';
import { IIPCConnection } from '../../background/modules/ipc-connection';

export interface IIPCBGConnection extends IIPCConnection {

}

export class IPCBGConnection extends PageCommon.IPCConnection implements IIPCBGConnection  {
    constructor(params?: ADHOCCAST.Cmds.Common.IBaseConstructorParams) {
        super(params, {
                factorySignaler: IPCBGSignaler.TAG
            } as any );
        this.initEvents();
    }
    destroy() {
        this.unInitEvents();
        super.destroy();
    }
    initEvents() {
        this.eventRooter.onAfterRoot.add(this.onAfterRoot)     
    }
    unInitEvents() {
        this.eventRooter.onAfterRoot.remove(this.onAfterRoot)
    }

    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        // return Services.Modules.IPCConnection.on_after_root(this, cmd);
    }      
}