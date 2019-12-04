import { ADHOCCAST } from '../../../common';
import * as Cmds from '../../cmds'

export class CustomRefreshSID {
    static req(instanceId: string): Promise<any> {
        return ADHOCCAST.Cmds.CommandReq.req(instanceId, {cmdId: Cmds.ECommandId.custom_refresh_sid});
    }
}