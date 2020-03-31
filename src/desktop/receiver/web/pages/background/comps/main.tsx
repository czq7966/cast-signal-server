import * as Modules from '../modules'
import * as PageCommon from '../../common'
import * as Services from '../services';
import { ADHOCCAST } from '../../../../common'

import React = require("react");
import { Player } from './player';

import './main.css';


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
        setTimeout(() => {
            this.onWindowResize(null);                    
        }, 100);
    }
    onWindowResize(ev) {
        let elems = document.getElementsByClassName('bg-comp-main-player-div');
        let count = elems.length;
        if (elems.length > 0) {
            let wc = Math.floor(Math.sqrt(count))
            let hc = wc;
            wc * hc < count ? wc++ : null;
            wc * hc < count ? hc++ : null;

            let w = Math.floor(window.innerWidth / wc) - 1;
            let h = Math.floor(window.innerHeight / hc) - 1;
            for (let idx = 0; idx < elems.length; idx++) {
                const elem = elems[idx] as HTMLElement;
                elem.style.width = 100 / wc  + "%";
                elem.style.height = h  + "px";                
            }
        }
    }

    init() {
        this.setRooterEvent(null, this.onIPCAfterRoot);
        this.moduleMain.adhocConnection.eventRooter.onBeforeRoot.add(this.onAdhocBeforeRoot);
        this.moduleMain.adhocConnection.eventRooter.onAfterRoot.add(this.onAdhocAfterRoot);

        this.moduleMain.adhocConnection.config.items.loginID = "783701";
        Services.Modules.AdhocConnection.login(this.moduleMain.adhocConnection)
        .then(v => {
            // this.heartBeat();
        });        
    }
    unInit() {
        this.moduleMain.adhocConnection.eventRooter.onBeforeRoot.remove(this.onAdhocBeforeRoot);
        this.moduleMain.adhocConnection.eventRooter.onAfterRoot.remove(this.onAdhocAfterRoot);
        this.resetRooterEvent();
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
        let players = [];

        if (this.state.senders) {
            let keys = Object.keys(this.state.senders);

            // for (let idx = 0; idx < 7; idx++) {
            //     keys = keys.concat(Object.keys(this.state.senders));
            // }
            
            for (let idx = 0; idx < keys.length; idx++) {
                const key = keys[idx];
                let palyer = (
                    <div className="bg-comp-main-player-div" >
                        <Player  key={idx} instanceId={this.props.instanceId} userId={key}></Player>
                    </div>
                )
                players.push(palyer);                
            }
        }
        return (<div className="bg-comp-main-div" >
            {players}
        </div>)   
    }    

}