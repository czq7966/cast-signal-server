import * as Modules from '../../modules'
import * as PageCommon from '../../../common'
import * as Services from '../../services';
import { ADHOCCAST } from '../../../../../common'

import React = require("react");
import { CompPlayer } from '../player';
import './index.less';



export interface IPlayersProps extends PageCommon.ICompBaseProps {

}
export interface IPlayersState extends PageCommon.ICompBaseState {
    senders?: {[id: string]: ADHOCCAST.Cmds.IUser}        
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
        super.setState(state);
    }

    init() {
        this.dispatcher.sendFilter.onAfterRoot.add(this.onIPCSendFilterAfterRoot)
        this.setRooterEvent(null, this.onIPCAfterRoot);
    }
    unInit() {
        this.resetRooterEvent();
    }

    onIPCSendFilterAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Comps.Players.on_ipc_send_filter_after_root(this, cmd);
    }  
    onIPCAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Comps.Players.on_ipc_after_root(this, cmd);
    }  
   


    render() {
        let players = [];

        if (this.state.senders) {
            let userIds = Object.keys(this.state.senders);
            
            for (let idx = 0; idx < 7; idx++) {
                userIds = userIds.concat(Object.keys(this.state.senders));
            }

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
                        <div key={idx} className="bg-comp-Players-div-col-row" style={{height: 100 / rowCount + "%"}}>
                            { userId 
                                ? <CompPlayer instanceId={this.props.instanceId} userId={userId}></CompPlayer>
                                : null
                            }
                            
                        </div>
                    )                   
                    rowPlayers.push(player);
                }
                let colDiv = (
                    <div key={colIdx} className="bg-comp-Players-div-col" style={{width: 100 / colCount + "%"}}>
                        {rowPlayers}
                    </div>
                )
                colPlayers.push(colDiv);                
            }
            players.push(colPlayers);
        }

        return (<div className="bg-comp-Players-div" >
            {players}
        </div>)   
    }    

}