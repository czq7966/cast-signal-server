import React = require("react");
import * as Modules from '../../../modules';
import { ADHOCCAST } from '../../../../../../common'
import * as Common from '../../../../../../common'
import * as PageCommon from '../../../../common'
import './index.css'


export interface ICompSendersListProps extends PageCommon.ICompBaseProps {
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
        this.setRooterEvent(null, this.onAfterRoot);
    }
    destroy() {
        this.resetRooterEvent();
        super.destroy();
    }
    componentDidMount() {
        super.componentDidMount();
    }

    render() {
        let cols = [];
        let maxCol = 3;
        let maxRow = 13;
        let ids = Object.keys(this.state.senders);
        for (let col = 0; col < maxCol; col++) {
            let items = [];
            for (let idx = 0; idx < maxRow; idx++) {
                let sender: ADHOCCAST.Cmds.IUser;
                let senderUI = (
                    <div key={idx} className="sds-comp-senders-list-item-div" >

                    </div>);

                let idIdx = col * maxRow + idx;
                if (idIdx < ids.length ) {
                    let key = ids[idIdx];
                    sender = this.state.senders[key];
                    if (sender) {
                        senderUI = (
                            <div key={idx} className="sds-comp-senders-list-item-div" >
                                <input type="checkbox" checked={sender.extra} />
                                <div>
                                    <span>{sender.nick ? sender.nick : sender.sid}</span>
                                </div>
                                <button>X</button>
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
                break;
            default:
                break;
        }     
    }   

    on_custom_get_sendering_users(cmd: ADHOCCAST.Cmds.Common.ICommand) {
        if (cmd.data.type == ADHOCCAST.Cmds.ECommandType.resp) {
            let users = cmd.data.extra as {[id: string]: ADHOCCAST.Cmds.IUser};
            if (users) {
                Object.keys(users).forEach(key => {
                    let user = users[key];
                    let sender = this.state.senders[key];
                    user.extra = sender ? sender.extra : false;
                })
            }
            this.setState({
                senders: users ? users : {}
            });
        }
    }

}
