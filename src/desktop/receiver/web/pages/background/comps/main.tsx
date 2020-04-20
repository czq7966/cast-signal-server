import * as Modules from '../modules'
import * as PageCommon from '../../common'
import * as Services from '../services';
import { ADHOCCAST } from '../../../../common'

import React = require("react");
import { CompPlayers } from './players';
import { CompDragAvatar } from './drag-avatar';
import './main.less';




export interface IMainProps extends PageCommon.ICompBaseProps {

}
export interface IMainState extends PageCommon.ICompBaseState {
    senders?: {[id: string]: ADHOCCAST.Cmds.IUser}        
}

export class Main extends PageCommon.CompBase<IMainProps, IMainState> {
    moduleMain: Modules.IMain;
    constructor(props) {
        super(props);
        this.moduleMain = Modules.Main.getInstance<Modules.IMain>();
        this.state={};
        this.init();
    }
    destroy() {
        this.unInit();
        delete this.moduleMain;
        super.destroy();        
    }
    componentDidMount() {
        super.componentDidMount();
        window.addEventListener('resize', this.onWindowResize);
        this.onWindowResize(null);                    
    }
    setState(state: IMainState) {
        super.setState(state);
    }
    windowResize() {
        let divs = document.getElementsByClassName('bg-comp-main-div');
        if (divs.length > 0) {
            let div = divs[0] as HTMLDivElement;
            div.style.height = window.innerHeight + "px";
        }
    }
    onWindowResize = (ev) => {
        this.windowResize();
    }

    init() {
        this.setRooterEvent(null, this.onIPCAfterRoot);
        this.dispatcher.sendFilter.onAfterRoot.add(this.onIPCSendFilterAfterRoot)
        this.moduleMain.adhocConnection.eventRooter.onBeforeRoot.add(this.onAdhocBeforeRoot);
        this.moduleMain.adhocConnection.eventRooter.onAfterRoot.add(this.onAdhocAfterRoot);

        // this.moduleMain.adhocConnection.config.items.loginID = "783701";
        Services.Modules.AdhocConnection.login(this.moduleMain.adhocConnection)
        .then(v => {
            // this.heartBeat();
        });        
    }
    unInit() {
        this.moduleMain.adhocConnection.eventRooter.onBeforeRoot.remove(this.onAdhocBeforeRoot);
        this.moduleMain.adhocConnection.eventRooter.onAfterRoot.remove(this.onAdhocAfterRoot);
        this.dispatcher.sendFilter.onAfterRoot.remove(this.onIPCSendFilterAfterRoot)
        this.resetRooterEvent();
    }
    onIPCSendFilterAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Comps.Main.on_ipc_send_filter_after_root(this, cmd);
    }  
    onIPCAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Comps.Main.on_ipc_after_root(this, cmd);
    }  
    onAdhocBeforeRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Comps.Main.on_adhoc_before_root(this, cmd);
    }        
    onAdhocAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Comps.Main.on_adhoc_after_root(this, cmd);
    }          

    heartBeat() {
        setTimeout(() => {
            let instanceId = this.moduleMain.adhocConnection.connection.instanceId;
            ADHOCCAST.Cmds.CommandReq.req(instanceId, {'cmdId': 'adhoc-heart-beat'})
            .then(v => {
                console.log('adhoc-heard-beat OK: ', new Date() );
                this.heartBeat();
            })
            .catch(e => {
                console.error('adhoc-heard-beat failed', e);
            });
                            
        }, 10 * 1000);
    }

    render() {
        return (<div className="bg-comp-main-div" >
            <div className="bg-comp-main-div-players">
                <CompPlayers instanceId={this.props.instanceId}></CompPlayers>
            </div>
        </div>)   
    }    

}