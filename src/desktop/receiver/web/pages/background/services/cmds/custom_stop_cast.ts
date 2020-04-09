import { ADHOCCAST } from '../../../../../common';
import * as Modules from '../../modules';
import * as Services_Modules from '../modules'

export class CustomStopCast {
    static async onReq(cmd: ADHOCCAST.Cmds.CommandReq) {
        let mainModule = Modules.Main.getInstance<Modules.Main>();
        let adhocConn = mainModule.adhocConnection;
        return Services_Modules.AdhocConnection.stopRemoteCast(adhocConn, cmd.data.props.user.id)
    }
}