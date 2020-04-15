import { ADHOCCAST } from '../../../common';
import * as Cmds from '../../cmds'

export class CustomApplyVideoConstraints {
    static req(instanceId: string, userId: string, constraintName: string): Promise<any> {
        return ADHOCCAST.Cmds.CommandReq.req(instanceId, 
            {
                cmdId: ADHOCCAST.Cmds.ECommandId.custom,
                props: {
                    extra: constraintName
                },
                extra: Cmds.ECommandId.custom_apply_video_constraints,
                to: {
                    type: 'user',
                    id: userId
                }
            });
    }
}