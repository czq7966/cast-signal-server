import { ADHOCCAST } from '../libex';

export enum ECommandId {
    custom_refresh_sid = "custom_refresh_sid",
    custom_get_current_user = "custom_get_current_user",
    custom_get_sendering_users = "custom_get_sendering_users",
    custom_show_senders_video = "custom_show_senders_video"
}    



[
    ECommandId.custom_refresh_sid,
    ECommandId.custom_get_current_user,
    ECommandId.custom_get_sendering_users,
].forEach(commanid => {
    ADHOCCAST.Cmds.Common.CommandTypes.RegistCommandType({
        cmdId: commanid,
        name: commanid,
        ReqClass: ADHOCCAST.Cmds.CommandReq,
        RespClass: ADHOCCAST.Cmds.CommandResp
    })
})