import { ADHOCCAST } from '../../libex';

export enum ECommandId {
    custom_refresh_sid = "custom_refresh_sid",
    custom_get_current_user = "custom_get_current_user",
    custom_get_sender_count = "custom_get_sender_count",
}    



[
    ECommandId.custom_refresh_sid,
    ECommandId.custom_get_current_user,
    ECommandId.custom_get_sender_count,
].forEach(commanid => {
    ADHOCCAST.Cmds.Common.CommandTypes.RegistCommandType({
        cmdId: commanid,
        name: commanid,
        ReqClass: ADHOCCAST.Cmds.CommandReq,
        RespClass: ADHOCCAST.Cmds.CommandResp
    })
})