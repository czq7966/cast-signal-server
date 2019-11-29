import { ADHOCCAST } from '../../../libex';
import * as Cmds from '../../cmds'

export class CustomGetCurrentUser {
    static req(instanceId: string): Promise<any> {
        return ADHOCCAST.Cmds.CommandReq.req(instanceId, {cmdId: Cmds.ECommandId.custom_get_current_user});
    }
}