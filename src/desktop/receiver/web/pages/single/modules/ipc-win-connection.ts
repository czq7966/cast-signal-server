import { ADHOCCAST } from '../../../../common';
import * as Services from '../services'
import * as PageCommon from '../../common'
import { IPCWinSignaler } from './ipc-win-signaler';


export interface IIPCWinConnection extends PageCommon.IIPCConnection {

}

export class IPCWinConnection extends PageCommon.IPCConnection implements IIPCWinConnection  {
    constructor(params?: ADHOCCAST.Cmds.Common.IBaseConstructorParams) {
        super(params, {
                factorySignaler: IPCWinSignaler.TAG
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