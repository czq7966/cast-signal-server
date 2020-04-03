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

}

export class CompSenders extends PageCommon.CompBase<ICompSendersProps, ICompSendersState> {
    constructor(props) {        
        super(props);
        this.dispatcher.eventRooter.onAfterRoot.add(this.onAfterRoot);
    }
    destroy() {
        this.dispatcher.eventRooter.onAfterRoot.remove(this.onAfterRoot);
        super.destroy();
    }


    render() {
        return (
            <div className={"sds-comp-senders-div"} >
                <div className="sds-comp-senders-div-header"></div>
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


            default:
                break;
        }     
    }   

}