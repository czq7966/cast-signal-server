import { ADHOCCAST } from '../../../../../common';
import * as Modules from '../../modules'
import * as Common from '../../../../../common';

export class CustomShowSendersVideo {
    static async req(instanceId: string, senders: {[id: string]: ADHOCCAST.Cmds.IUser}) {
        let data: ADHOCCAST.Dts.ICommandData<ADHOCCAST.Dts.ICommandReqDataProps> = {} 
        data.cmdId = Common.Cmds.ECommandId.custom_show_senders_video;
        data.props = {}    
        data.extra = senders;   
        ADHOCCAST.Services.Cmds.User.dispatchCommand2(instanceId, data); 
        this.resp(instanceId, null, senders);
    }
    static onReq(cmd: ADHOCCAST.Cmds.Common.ICommand, senders: {[id: string]: ADHOCCAST.Cmds.IUser}): Promise<any> {
        return this.resp(cmd.instanceId, cmd, cmd.data.extra)
    }
    static resp(instanceId: string, reqCmd?: ADHOCCAST.Cmds.Common.ICommand, senders?: {[id: string]: ADHOCCAST.Cmds.IUser}): Promise<any> {
        let data: ADHOCCAST.Dts.ICommandData<ADHOCCAST.Dts.ICommandRespDataProps> = {} 
        data.props = {}    
        data.extra = senders;    
        if (reqCmd) {
            return ADHOCCAST.Cmds.CommandResp.resp(reqCmd as any, data);
        }
        else  { 
            data.cmdId = Common.Cmds.ECommandId.custom_show_senders_video;
            data.type = ADHOCCAST.Dts.ECommandType.resp;            
            return ADHOCCAST.Services.Cmds.User.dispatchCommand2(instanceId, data);
        }
    }
    
    // static onReq(cmd: ADHOCCAST.Cmds.Common.ICommand, senders: {[id: string]: ADHOCCAST.Cmds.IUser}): Promise<any> {
    //     senders = senders || cmd.data.extra;
    //     let data: ADHOCCAST.Dts.ICommandData<ADHOCCAST.Dts.ICommandRespDataProps> = {
    //         props: {},
    //         extra: senders
    //     }
    //     return ADHOCCAST.Cmds.CommandResp.resp(cmd as any, data);
    // }

    // static resp(instanceId: string, senders: {[id: string]: ADHOCCAST.Cmds.IUser}): Promise<any> {
    //     let cmd = new ADHOCCAST.Cmds.CommandReq({instanceId: instanceId});
    //     cmd.data.cmdId = Common.Cmds.ECommandId.custom_show_senders_video;
    //     let promise = this.onReq(cmd, senders);
    //     cmd.destroy;
    //     cmd = null;
    //     return promise;        
    // }
}