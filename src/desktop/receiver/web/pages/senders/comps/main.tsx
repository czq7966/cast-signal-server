import React = require("react");
import ReactDOM = require('react-dom');
import * as Modules from '../modules'
import * as PageCommon from '../../common'
import { CompAvatars } from "./avatars";
import { CompPanelID } from "./panel-id";
import { CompSenders } from "./senders";
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
        window.addEventListener('resize', this.onWindowResize);
        this.onWindowResize(null);
    }

    componentWillUnmount() {        
        window.removeEventListener('resize', this.onWindowResize)
        this.destroy();
    }

    init() {

    }
    unInit() {

    }
    onWindowResize(ev) {
        let divs = document.getElementsByClassName('comp-main-div');
        if (divs.length > 0) {
            let div = divs[0] as HTMLDivElement;
            div.style.height = window.innerHeight + "px";
        }
    }


    render() {
        return (<div className="comp-main-div" >
            <div className="comp-main-div-header">
                <div className="comp-main-div-header-left">
                    <div style={{height: "60px", width: "60px"}}>
                        <CompAvatars instanceId={this.props.instanceId} ></CompAvatars>                        
                    </div>                    
                </div>
                <div className="comp-main-div-header-middle">
                    <div>
                        <CompPanelID instanceId={this.props.instanceId}></CompPanelID>                        
                    </div>                    
                </div>
                <div className="comp-main-div-header-right"></div>

            </div>
            <div className="comp-main-div-body">
                <CompSenders instanceId={this.props.instanceId}></CompSenders>
            </div>
            <div className="comp-main-div-footer"></div>
        </div>)
    }

}