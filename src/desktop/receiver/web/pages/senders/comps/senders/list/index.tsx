import React = require("react");
import * as Modules from '../../../modules';
import { ADHOCCAST } from '../../../../../../common'
import * as Common from '../../../../../../common'
import * as PageCommon from '../../../../common'
import * as Services from '../../../services'
import './index.less'

export interface ISenderUserExtra {
    selected: boolean
}

export interface ICompSendersListProps extends PageCommon.ICompBaseProps {
    onSelectSenders?: (senders: {[id: string]: ADHOCCAST.Cmds.IUser}) => {}
}
export interface ICompSendersListState extends PageCommon.ICompBaseState {
    senders: {[id: string]: ADHOCCAST.Cmds.IUser};
}

export class CompSendersList extends PageCommon.CompBase<ICompSendersListProps, ICompSendersListState> {
    constructor(props) {
        super(props);
        this.state = {
            senders: {}
        }
        // this.state.senders["1"] = {
        //     id: "1",
        //     sid: "1",
        //     nick: "123456789012345678901234567890",
        //     extra: {selected: false}
        // }
        // this.state.senders["2"] = {
        //     id: "2",
        //     sid: "2",
        //     nick: "123456789012345678901234567890",
        //     extra: {selected: true}
        // }
        this.setRooterEvent(null, this.onAfterRoot);
    }
    destroy() {
        this.resetRooterEvent();
        super.destroy();
    }
    componentDidMount() {
        super.componentDidMount();
    }
    setState(state: ICompSendersListState) {
        super.setState(state);
        this.trigSelectSendersEvent(state.senders);      
    }

    render() {
        let cols = [];
        let maxCol = 3;
        let maxRow = 10;

        let ids = Object.keys(this.state.senders);
        for (let col = 0; col < maxCol; col++) {
            let items = [];
            for (let idx = 0; idx < maxRow; idx++) {
                let sender: ADHOCCAST.Cmds.IUser;
                let senderUI = (
                    <div key={idx} className="sds-comp-senders-list-item-div" >
                                <div className="sds-comp-senders-list-item-check-div">
                                    {/* <input type="checkbox" style={{visibility:"hidden"}}  /> */}
                                </div>
                                <div className="sds-comp-senders-list-item-nick-div" >
                                    <span></span>
                                </div>
                                <div  className="sds-comp-senders-list-item-close-div" style={{visibility:"hidden"}}>
                                    {/* <button style={{visibility:"hidden"}}>X</button> */}
                                </div>

                    </div>);

                let idIdx = col * maxRow + idx;
                if (idIdx < ids.length ) {
                    let key = ids[idIdx];
                    sender = this.state.senders[key];
                    if (sender) {
                        senderUI = (
                            <div key={key} className="sds-comp-senders-list-item-div" >
                                <div className="sds-comp-senders-list-item-check-div">
                                    <input type="checkbox" checked={sender.extra.selected}
                                        onClick={() => this.onSenderSelect(key)} />
                                </div>
                                <div className="sds-comp-senders-list-item-nick-div" 
                                     onClick={() => this.onSenderClick(key)}>
                                    {sender.nick ? sender.nick : sender.sid}
                                </div>
                                <div  className="sds-comp-senders-list-item-close-div">
                                    <button onClick={() => this.onStopCastClick(key)}></button>
                                </div>
                            </div>)

                    }
                }
                
                items.push(senderUI)
            }
    
            cols.push(
                <div key={col} className="sds-comp-senders-list-col-div" >
                    {items}
                </div>
                )            
        }


        return (
            <div className={"sds-comp-senders-list-div"} >
                {cols}
            </div>
        )
    }


    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;
        switch(cmdId) {
            case Common.Cmds.ECommandId.custom_get_sendering_users:
                this.on_custom_get_sendering_users(cmd);
            case Common.Cmds.ECommandId.custom_select_senders:
                this.on_custom_select_senders(cmd);
                break;
            default:
                break;
        }     
    }   

    on_custom_get_sendering_users(cmd: ADHOCCAST.Cmds.Common.ICommand) {
        if (cmd.data.type == ADHOCCAST.Cmds.ECommandType.resp) {
            let users = cmd.data.extra as {[id: string]: ADHOCCAST.Cmds.IUser};
            if (users) {
                users = JSON.parse(JSON.stringify(users));
                let senders = this.state.senders;
                Object.keys(users).forEach(key => {
                    let user = users[key];
                    let sender = senders[key];
                    user.extra = sender ? sender.extra : {selected: false};
                })
            }
            this.setState({
                senders: users ? users : {}
            });
            // this.setState({
            //     senders: this.state.senders
            // });
        }
    }

    on_custom_select_senders(cmd: ADHOCCAST.Cmds.Common.ICommand) {
        if (cmd.data.type == ADHOCCAST.Cmds.ECommandType.req) {
            let users = cmd.data.extra as {[id: string]: ADHOCCAST.Cmds.IUser};
            if (users) {
                users = JSON.parse(JSON.stringify(users));
                let senders = this.state.senders;
                Object.keys(senders).forEach(key => {
                    let user = users[key];
                    let sender = senders[key];
                    sender.extra = user && user.extra ? user.extra : sender.extra;
                })
            }
            this.setState({
                senders: this.state.senders
            });
        }
    }

    onSenderClick(senderId: string)  {
        let senders = {};
        senders[senderId] = this.state.senders[senderId];
        Services.Cmds.CustomShowSendersVideo.req(this.props.instanceId, senders);
    }
    onSenderSelect(senderId: string)  {
        let sender = this.state.senders[senderId];
        sender.extra.selected = !sender.extra.selected;
        this.setState({
            senders: this.state.senders
        })
    }
    onStopCastClick(senderId: string) {
        Services.Cmds.CustomStopCast.req(this.props.instanceId, senderId);
    }
    trigSelectSendersEvent(senders: {[id: string]: ADHOCCAST.Cmds.IUser}){
        senders = senders || this.state.senders;
        let selectedSenders = {}
        Object.keys(senders).forEach(id => {
            let sender = this.state.senders[id];
            if (sender.extra.selected) {
                selectedSenders[id] = sender;
            }
        })
        Services.Cmds.CustomSelectSenders.resp(this.props.instanceId, selectedSenders);
    }
}
