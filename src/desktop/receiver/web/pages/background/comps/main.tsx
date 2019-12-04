import * as Modules from '../modules'
import * as PageCommon from '../../common'
import * as Services from '../services';
import { ADHOCCAST } from '../../../../common'

import React = require("react");
import Card from 'antd/lib/card'
import 'antd/lib/card/style/index.css'


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
        this.init();
    }
    destroy() {
        this.unInit();
        delete this.moduleMain;
        super.destroy();        
    }
    componentDidMount() {
    }

    componentWillUnmount() {        
        this.destroy();
    }

    init() {
        this.setRooterEvent(null, this.onIPCAfterRoot);

        let sid = "783701";
        this.moduleMain.adhocConnection.connection.retryLogin(
            {
                id: null,
                sid: sid,
                room: {
                    id: "promethean_" + sid
                }
            }
        )
        .then(v => {
            // this.heartBeat();
        });

        
    }
    unInit() {
        this.resetRooterEvent();
    }

    onIPCAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Comps.Main.on_ipc_after_root(this, cmd);
    }      

    heartBeat() {
        setTimeout(() => {
            let instanceId = Modules.Main.getInstance<Modules.IMain>().adhocConnection.connection.instanceId;
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
        return (<div style={{ background: '#ECECEC', padding: '30px'  }}>

                    <Card title="Card title" bodyStyle={{ border: "none", padding:"0px" }} >
                        <div style={{ background: 'red', width: "100px", height: "100px" }} ></div>
                    </Card>
            
        </div>)   
    }    

}