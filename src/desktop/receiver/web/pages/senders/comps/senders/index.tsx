import React = require("react");
import ReactDOM = require('react-dom');
import { ADHOCCAST } from '../../../../../common';
import * as PageCommon from '../../../common'
import * as Common from '../../../../../common'
import './index.css'
import { CompSendersList } from "./list";


export interface ICompSendersProps extends PageCommon.ICompBaseProps {
    onSelectSenders?: (senders: {[id: string]: ADHOCCAST.Cmds.IUser}) => {}
}
export interface ICompSendersState extends PageCommon.ICompBaseState {
    count: any
}

export class CompSenders extends PageCommon.CompBase<ICompSendersProps, ICompSendersState> {
    constructor(props) {        
        super(props);
        this.state = {
            count: 0
        }
        this.dispatcher.eventRooter.onAfterRoot.add(this.onAfterRoot);
    }
    destroy() {
        this.dispatcher.eventRooter.onAfterRoot.remove(this.onAfterRoot);
        super.destroy();
    }


    render() {
        return (
            <div className={"sds-comp-senders-div"} >
                <div className="sds-comp-senders-div-header">
                    <div>
                        <span>Waiting Room:&nbsp;</span>
                        <span className="sds-comp-senders-div-header-count">{this.state.count}</span>
                        <span>&nbsp;Device(s)</span>
                    </div>
                </div>
                <div className="sds-comp-senders-div-list">
                    <CompSendersList instanceId={this.props.instanceId} 
                        onSelectSenders={this.props.onSelectSenders} >

                    </CompSendersList>
                </div>
                <div className="sds-comp-senders-div-footer"></div>
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
                        count: length
                    })
                }
                break;
            case ADHOCCAST.Cmds.ECommandId.network_disconnect:
                this.setState({count: 0});
                break;
            default:
                break;
        }     
    }      

}