import * as Modules from '../../modules'
import * as PageCommon from '../../../common'
import * as Services from '../../services';
import { ADHOCCAST } from '../../../../../common'

import React = require("react");
import { CompPlayer } from '../player';
import { CompDragAvatar } from '../drag-avatar';
import './index.less';



export interface IPlayersProps extends PageCommon.ICompBaseProps {

}
export interface IPlayersState extends PageCommon.ICompBaseState {
    senders?: {[id: string]: ADHOCCAST.Cmds.IUser}   
    fullSenderId?: string     
}

export class CompPlayers extends PageCommon.CompBase<IPlayersProps, IPlayersState> {
    constructor(props) {
        super(props);
        this.state={};
        this.init();
    }
    destroy() {
        this.unInit();
        super.destroy();        
    }
    componentDidMount() {
        super.componentDidMount();
    }
    setState(state: IPlayersState) {
        state.fullSenderId = state.fullSenderId || null;
        super.setState(state);
    }

    init() {
        this.dispatcher.sendFilter.onAfterRoot.add(this.onIPCSendFilterAfterRoot)
        this.setRooterEvent(null, this.onIPCAfterRoot);
    }
    unInit() {
        this.resetRooterEvent();
        this.dispatcher.sendFilter.onAfterRoot.remove(this.onIPCSendFilterAfterRoot)
    }

    onIPCSendFilterAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Comps.Players.on_ipc_send_filter_after_root(this, cmd);
    }  
    onIPCAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Comps.Players.on_ipc_after_root(this, cmd);
    }  

    onAvatarClick() {
        let fullSenderId = this.state.fullSenderId;
        if ( fullSenderId && this.state.senders[fullSenderId] ) {
            this.setState({})
        } else {
            Services.Cmds.CustomShowSendersVideo.req(this.props.instanceId, {});    
        }   
    }  
    onFullSenderClick (senderId: string) {
        if (senderId && senderId != this.state.fullSenderId && this.state.senders[senderId] ) {
            this.setState({
                fullSenderId: senderId
            })
        }
    } 


    render() {
        let players = [];
        let senders = {};
        let userIds = []
        let fullSenderId = this.state.fullSenderId;
        let fullSender = fullSenderId ? this.state.senders[fullSenderId] : null;
        if (fullSender) {
            senders[this.state.fullSenderId] = fullSender;
            userIds = Object.keys(senders);
        } else {
            senders = this.state.senders;
            if (senders) {     
                userIds = Object.keys(senders);           
                // for (let idx = 0; idx < 7; idx++) {                    
                //     userIds = userIds.concat(Object.keys(senders));
                // }            
            }
        }
        

        if (userIds.length > 0) {
            let count = userIds.length;
            let rowCount = Math.floor(Math.sqrt(count));
            let colCount = rowCount;
            if (Math.sqrt(count) % 1 > 0) colCount++;
            if (rowCount * colCount < count) rowCount++;
            
            let colPlayers = [];            
            for (let colIdx = 0; colIdx < colCount; colIdx++) {
                
                let rowPlayers = [];
                for (let rowIdx = 0; rowIdx < rowCount; rowIdx++) {
                    let idx = colIdx * rowCount + rowIdx;
                    let userId = userIds[idx]
                    let player = (
                        <div key={idx} 
                            className="bg-comp-players-div-col-row" 
                            style={{height: 100 / rowCount + "%"}}
                            onClick={() => this.onFullSenderClick(userId)}
                            >
                            { userId 
                                ? <CompPlayer 
                                    instanceId={this.props.instanceId} 
                                    userId={userId}
                                    constraintName={count > 1 ? "good" : "best"}
                                    ></CompPlayer>
                                : null
                            }
                            
                        </div>
                    )                   
                    rowPlayers.push(player);
                }
                let colDiv = (
                    <div key={colIdx} className="bg-comp-players-div-col" style={{width: 100 / colCount + "%"}}>
                        {rowPlayers}
                    </div>
                )
                colPlayers.push(colDiv);                
            }
            players.push(colPlayers);
        }

        return (<div className="bg-comp-players-div" >
            {players}
            <div className="bg-comp-players-avatar-div">
                <CompDragAvatar fontSize="11px"  instanceId={this.props.instanceId} onClick={()=>this.onAvatarClick()} ></CompDragAvatar>
            </div>
        </div>)   
    }    

}