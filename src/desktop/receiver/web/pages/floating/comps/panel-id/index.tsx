import React = require("react");
import * as Modules from '../../modules';
import { ADHOCCAST } from '../../../../../common'
import * as Common from '../../../../../common'
import * as PageCommon from '../../../common'
import './index.css'


export interface ICompPanelIDProps extends PageCommon.ICompBaseProps {
    className?: string
}
export interface ICompPanelIDState extends PageCommon.ICompBaseState {
    panelID: String;    

}

export class CompPanelID extends PageCommon.CompBase<ICompPanelIDProps, ICompPanelIDState> {
    constructor(props) {
        super(props);
        this.state = {
            panelID: ""
        }
        this.setRooterEvent(null, this.onAfterRoot);
    }
    destroy() {
        this.resetRooterEvent();
        super.destroy();
    }
    componentDidMount() {
        Common.Services.Cmds.CustomGetCurrentUser.req(this.props.instanceId);
        super.componentDidMount();
    }

    render() {
        return (
            <div className={this.props.className || "flt-comp-panel-id-div"} >
                <span>{this.state.panelID}</span>
            </div>
        )
    }


    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;
        switch(cmdId) {
            case ADHOCCAST.Cmds.ECommandId.adhoc_login:
            case Common.Cmds.ECommandId.custom_get_current_user:
                if (type == ADHOCCAST.Cmds.ECommandType.resp) {
                    let user = (cmd.data.props as ADHOCCAST.Cmds.ICommandDataProps).user;
                    this.setState({panelID: user && user.sid || ""});
                }
                break;
            case ADHOCCAST.Cmds.ECommandId.network_disconnect:
                this.setState({panelID: ""})

                break;
            default:
                break;
        }     
    }   

}
