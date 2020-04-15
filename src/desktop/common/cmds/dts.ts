import { ADHOCCAST } from '../libex';

export enum ECommandId {
    custom_refresh_sid = "custom_refresh_sid",
    custom_get_current_user = "custom_get_current_user",
    custom_get_sendering_users = "custom_get_sendering_users",
    custom_show_senders_video = "custom_show_senders_video",
    custom_select_senders = "custom_select_senders",

    custom_on_sending_stream = "custom_on_sending_stream",
    custom_off_sending_stream = "custom_off_sending_stream",
    //for remote adhoc
    custom_stop_cast = "custom_stop_cast",
    custom_get_sender_info = "custom_get_sender_info",
    custom_apply_video_constraints = "custom_apply_video_constraints"
}    



[
    ECommandId.custom_refresh_sid,
    ECommandId.custom_get_current_user,
    ECommandId.custom_get_sendering_users,
    ECommandId.custom_show_senders_video,
    ECommandId.custom_select_senders,
    
    ECommandId.custom_on_sending_stream,
    ECommandId.custom_off_sending_stream,

    ECommandId.custom_stop_cast,
    ECommandId.custom_get_sender_info,
].forEach(commanid => {
    ADHOCCAST.Cmds.Common.CommandTypes.RegistCommandType({
        cmdId: commanid,
        name: commanid,
        ReqClass: ADHOCCAST.Cmds.CommandReq,
        RespClass: ADHOCCAST.Cmds.CommandResp
    })
})