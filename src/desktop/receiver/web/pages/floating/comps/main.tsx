import React = require("react");
import ReactDOM = require('react-dom');
import { CompAvatars } from "./avatars";
import { CompFrame } from "./frame";
import { CompPanelID } from "./panel-id";
import * as Modules from '../modules'
import * as PageCommon from '../../common'
import './main.css'

export interface IMainProps extends PageCommon.ICompBaseProps {

}
export interface IMainState extends PageCommon.ICompBaseState {

}

export class Main extends PageCommon.CompBase<IMainProps, IMainState> {
    constructor(props) {
        super(props);
        this.init();
    }
    destroy() {
        this.unInit();
    }
    componentDidMount() {
    }

    componentWillUnmount() {        
        this.destroy();
    }

    init() {

    }
    unInit() {

    }


    render() {
        return (
            <div className="comps-main-div"  style={{backgroundImage:"url('../../images/black_container_80_percent.svg')"}}>
                <div className="comps-main-div-body"  style={{backgroundImage:"url('../../images/white_container.svg')"}}>
                    <div className="comps-main-div-body-panel-name" >
                        <input placeholder="Enter Panel Name"></input>
                    </div>
                    <div className="comps-main-div-body-devider" ></div>
                    <div className="comps-main-div-body-label-id" >
                        <span>Panel ID</span>
                    </div>
                    <div className="comps-main-div-body-panel-id" >
                        <img src="../../images/refresh_icon.svg" ></img>
                        <CompPanelID instanceId={this.props.instanceId} ></CompPanelID>                        
                    </div>
                
                </div>
                <div className="comps-main-div-footer">
                    <div className="comps-main-div-footer-avatars">
                        <CompAvatars avatar={{}} badge={{}} instanceId={this.props.instanceId}></CompAvatars>
                    </div>
                    <CompFrame></CompFrame>
                </div>
            </div>
        )
    }

}