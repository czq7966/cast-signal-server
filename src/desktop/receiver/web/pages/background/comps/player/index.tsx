import * as Modules from '../../modules'
import * as PageCommon from '../../../common'
import * as Services from '../../services';
import { ADHOCCAST } from '../../../../../common'

import React = require("react");
import Card from 'antd/lib/card'
import 'antd/lib/card/style/index.css'


export interface IPlayerProps extends PageCommon.ICompBaseProps {
    userId: string    
    viewId?: string
}
export interface IPlayerState extends PageCommon.ICompBaseState {
    user: ADHOCCAST.Cmds.IUser
}

export class Player extends PageCommon.CompBase<IPlayerProps, IPlayerState> {
    viewId: string;
    moduleMain: Modules.IMain;
    videoElement: HTMLVideoElement;
    constructor(props) {
        super(props);
        this.moduleMain = Modules.Main.getInstance<Modules.IMain>();
        this.viewId = this.props.viewId || ADHOCCAST.Cmds.Common.Helper.uuid();
        this.init();
    }
    destroy() {
        this.unInit();
        delete this.moduleMain;
        delete this.viewId;
        delete this.videoElement;
        super.destroy();        
    }
    init() {
        this.setRooterEvent(null, this.onIPCAfterRoot);
        this.moduleMain.adhocConnection.eventRooter.onAfterRoot.add(this.onAdhocAfterRoot);        
        Services.Modules.AdhocConnection.incRecvingClient(this.moduleMain.adhocConnection, this.viewId, this.props.userId);        
    }
    unInit() {
        Services.Modules.AdhocConnection.decRecvingClient(this.moduleMain.adhocConnection, this.viewId);     
        this.moduleMain.adhocConnection.eventRooter.onAfterRoot.remove(this.onAdhocAfterRoot);        
        this.resetRooterEvent();
    }
    onIPCAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Comps.Player.on_ipc_after_root(this, cmd);
    }      
    onAdhocAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        return Services.Comps.Player.on_adhoc_after_root(this, cmd);
    }  
    onVideoRef(video: HTMLVideoElement) {
        this.videoElement = video
        Services.Comps.Player.play(this);
    }  



    render() {
        return (<div>
            <Card title="Card title1" bodyStyle={{ border: "none", padding:"0px" }} >
                <video
                    style={{width:"100%"}}
                    ref={ref => {this.onVideoRef(ref)}}
                    controls
                    autoPlay
                    playsInline                            
                >
                </video>
            </Card>            
        </div>)   
    }    

}