import React = require("react");
import * as Modules from '../../modules';
import { ADHOCCAST } from '../../../../../libex';
import * as Common from '../../../../../common'
import './index.css'

export interface ICompPanelIDProps {

}
export interface ICompPanelIDState {
    panelID: String;

}

export class CompPanelID extends React.Component<ICompPanelIDProps, ICompPanelIDState> {
    constructor(props) {
        super(props);
        this.state = {
            panelID: ""
        }
        this.init();
    }
    destroy() {
        this.unInit();
    }
    componentDidMount() {
        Common.Services.Cmds.CustomRefreshSID.req(Modules.Main.getInstance<Modules.Main>().ipcConnection.instanceId);
    }

    componentWillUnmount() {        
        this.destroy();
    }

    init() {
        Modules.Main.getInstance<Modules.Main>().ipcConnection.eventRooter.onAfterRoot.add(this.onAfterRoot);      
    }
    unInit() {
        Modules.Main.getInstance<Modules.Main>().ipcConnection.eventRooter.onAfterRoot.remove(this.onAfterRoot);
    }


    render() {
        return (
            <div className="comps-panel-id-div" >
                <span>{this.state.panelID}</span>
            </div>
        )
    }

    onBeforeRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;
        switch(cmdId) {
            default:
                break;
        }
    }
    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;
        switch(cmdId) {
            case Common.Cmds.ECommandId.custom_get_current_user:
                if (type == ADHOCCAST.Cmds.ECommandType.resp) {
                    let user = (cmd.data.props as ADHOCCAST.Cmds.ICommandDataProps).user;
                    this.setState({panelID: user.sid});
                }

            default:
                break;
        }     
        console.log("onAfterRoot", cmd.data.cmdId, cmd.data);
    }   

}
