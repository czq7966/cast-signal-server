import React = require("react");
import ReactDOM = require('react-dom');
import { ADHOCCAST } from '../../../../../common';
import * as PageCommon from '../../../common'
import * as Common from '../../../../../common'
import * as Services from '../../services'
import './index.css'


export interface ICompSelectedProps extends PageCommon.ICompBaseProps {
}
export interface ICompSelectedState extends PageCommon.ICompBaseState {
    senders: {[id: string]: ADHOCCAST.Cmds.IUser}

}

export class CompSelected extends PageCommon.CompBase<ICompSelectedProps, ICompSelectedState> {
    constructor(props) {        
        super(props);
        this.state = {
            senders: {}
        }
        this.setRooterEvent(null, this.onAfterRoot);
    }
    destroy() {
        this.resetRooterEvent();
        super.destroy();
    }


    render() {
        return (
            <div  className="sds-comp-selected-div">
                <div className="sds-comp-selected-div-selected">
                    <span>{Object.keys(this.state.senders).length} seleted</span>
                    <button onClick={() => this.onUnselectClick()}></button>
                </div>
                <div>
                    <button className="sds-comp-selected-div-share-button"
                        onClick={() => this.onShareClick()}
                    ></button>
                </div>
            </div>
        )
    }

    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;
        switch(cmdId) {
            case Common.Cmds.ECommandId.custom_select_senders:
                if (type == ADHOCCAST.Cmds.ECommandType.resp) {
                    let users: {[id: string]: ADHOCCAST.Cmds.IUser} = cmd.data.extra;
                    this.setState({
                        senders: users ? users : {}
                    })
                }
                break;
            default:
                break;
        }     
    }   

    onShareClick() {
        Services.Cmds.CustomShowSendersVideo.req(this.props.instanceId, this.state.senders);       
    }

    onUnselectClick() {
        let senders = this.state.senders;
        Object.keys(senders).forEach(key => {
            let sender = senders[key];
            sender.extra.selected = false;
        })
        Services.Cmds.CustomSelectSenders.req(this.props.instanceId, this.state.senders);
    }

}