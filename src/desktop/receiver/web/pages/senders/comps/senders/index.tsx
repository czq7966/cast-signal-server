import React = require("react");
import ReactDOM = require('react-dom');
import { ADHOCCAST } from '../../../../../common';
import * as PageCommon from '../../../common'
import * as Common from '../../../../../common'
import './index.css'
import { CompSendersList } from "./list";


export interface ICompSendersProps extends PageCommon.ICompBaseProps {

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
            <div className={"comp-senders-div"} >
                <div className="comp-senders-div-header"></div>
                <div className="comp-senders-div-list">
                    <CompSendersList instanceId={this.props.instanceId} ></CompSendersList>
                </div>
                <div className="comp-senders-div-footer"></div>
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