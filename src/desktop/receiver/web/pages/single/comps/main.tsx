import React = require("react");
import { ADHOCCAST } from '../../../../common'
import * as PageCommon from '../../common'
import * as Modules from '../modules'
import * as BGComps from '../../background/comps'
import * as SDSComps from '../../senders/comps'
import * as Services from '../services';
import './main.css'

export interface IMainProps extends PageCommon.ICompBaseProps {    
    moduleMain: Modules.IMain
}
export interface IMainState extends PageCommon.ICompBaseState {
    showSenders?: {[id: string]: ADHOCCAST.Cmds.IUser}
}

export class Main extends PageCommon.CompBase<IMainProps, IMainState> {
    constructor(props) {
        super(props);
        this.state = {};
        this.init();
    }
    destroy() {
        this.unInit();
    }
    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
        this.onWindowResize(null);
    }

    componentWillUnmount() {        
        window.removeEventListener('resize', this.onWindowResize)
        this.destroy();
    }

    init() {
        this.setRooterEvent(null, this.onIPCAfterRoot);

    }
    unInit() {
        this.resetRooterEvent();
    }
    onWindowResize(ev) {

    }

    onIPCAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Comps.Main.on_ipc_after_root(this, cmd);
    }  

    render() {
        let sdsDisplay: string = "block";
        let bgDisplay: string = "none";      
        let showSenders = this.state.showSenders;
        if (showSenders && Object.keys(showSenders).length > 0) {
            sdsDisplay = "none";
            bgDisplay = "block";   
        }


        return (<div>
            <div className="sg-comp-main-bg-root"  style={{display: bgDisplay}}>
                <BGComps.Main instanceId={this.props.moduleMain.bgModuleMain.ipcConnection.instanceId} ></BGComps.Main>
            </div>
            <div className="sg-comp-main-sds-root" style={{display: sdsDisplay}}>
                <SDSComps.Main instanceId={this.props.moduleMain.sdsModuleMain.ipcConnection.instanceId} ></SDSComps.Main>
            </div>
        </div>)
    }

}