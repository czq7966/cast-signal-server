import { ADHOCCAST } from '../../../../../libex';
import * as Modules from '../../modules'

export class CustomRefreshSID {
    static onReq(cmd: ADHOCCAST.Cmds.Common.ICommand): Promise<any> {
        console.log('aaaaaaaaaa', cmd);
        return;
    }
}