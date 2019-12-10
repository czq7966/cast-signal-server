import { ADHOCCAST } from '../../../common';
import * as Cmds from '../../cmds'

export class CustomGetSendingUsers {
    static req(instanceId: string): Promise<any> {
        return ADHOCCAST.Cmds.CommandReq.req(instanceId, {cmdId: Cmds.ECommandId.custom_get_sendering_users});
    }
}