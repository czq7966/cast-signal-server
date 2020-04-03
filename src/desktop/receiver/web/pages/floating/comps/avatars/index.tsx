import React = require("react");
import ReactDOM = require('react-dom');
import * as PageCommon from '../../../common'
import * as Common from '../../../../../common'
import { ADHOCCAST } from '../../../../../common';
import './index.css'

export interface ICompAvatarsProps extends PageCommon.ICompBaseProps {


}
export interface ICompAvatarsState extends PageCommon.ICompBaseState {
    count: any;
}

export class CompAvatars extends PageCommon.CompBase<ICompAvatarsProps, ICompAvatarsState> {
    constructor(props) {
        super(props);
        this.state = {
            count: ""
        }
        this.setRooterEvent(null, this.onAfterRoot);
    }

    componentDidMount() {
        Common.Services.Cmds.CustomGetSendingUsers.req(this.props.instanceId);
        super.componentDidMount();
    }

    destroy() {
        this.resetRooterEvent();
        super.destroy();
    }


    render() {
        return (
            <div className={"flt-comp-avatars-div"} >
                <div className={"flt-comp-avatars-div-icon"} style={{backgroundImage:"url('../../images/avatars_icon.svg')"}} ></div>
                <div className={"flt-comp-avatars-div-bubble"} 
                        style={{
                                backgroundImage:"url('../../images/orange_bubble_icon.svg')"
                                }} >
                    {this.state.count}qqq
                </div>
            </div>
        )
    }

    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;   
        switch(cmdId) {            
            case Common.Cmds.ECommandId.custom_get_sendering_users:
                if (type == ADHOCCAST.Cmds.ECommandType.resp) {
                    let users: {[id: string]: ADHOCCAST.Cmds.IUser} = cmd.data.extra;
                    let length = users ? Object.keys(users).length: 0;
                    this.setState({
                        count: length ? length: ""
                    })
                }
                break;
            case ADHOCCAST.Cmds.ECommandId.network_disconnect:
                this.setState({count: ""});
                break;
            default:
                break;
        }     
    }      

}
