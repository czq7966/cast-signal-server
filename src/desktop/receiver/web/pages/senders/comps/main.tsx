import React = require("react");
import ReactDOM = require('react-dom');
import { ADHOCCAST } from '../../../../common';
import * as Modules from '../modules'
import * as PageCommon from '../../common'
import { CompAvatars, CompDragAvatar } from "./avatars";
import { CompPanelID } from "./panel-id";
import { CompSenders } from "./senders";
import { CompSelected } from "./selected"
import './main.less'

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
        let divs = document.getElementsByClassName('sds-comp-main-div');
        if (divs.length > 0) {
            let div = divs[0] as HTMLDivElement;
            div.style.height = window.innerHeight + "px";
        }
    }
    onSelectSenders = (senders: {[id: string]: ADHOCCAST.Cmds.IUser}) => {
        Object.keys(senders).length

    }


    render() {
        return (<div className="sds-comp-main-div" >
            <div className="sds-comp-main-div-header">
                <div className="sds-comp-main-div-header-left">
                    <div className="sds-comp-main-div-header-left-avatar">
                        <CompAvatars fontSize="20px" instanceId={this.props.instanceId} ></CompAvatars>                        
                    </div>                    
                </div>
                <div className="sds-comp-main-div-header-middle">
                    <span className="sds-comp-main-div-header-middle-span">Panel ID</span>
                    <div>
                        <CompPanelID instanceId={this.props.instanceId}
                            className="sds-comp-main-div-header-middle-panel-id"
                        ></CompPanelID>                        
                    </div>                    
                </div>
                <div className="sds-comp-main-div-header-right"></div>

            </div>
            <div className="sds-comp-main-div-body">
                <CompSenders instanceId={this.props.instanceId}></CompSenders>
            </div>
            <div className="sds-comp-main-div-footer">
                <div  className="sds-comp-main-div-footer-left">
                    <div className="sds-comp-main-div-footer-left-img"></div>
                    <span>ScreenShare</span>

                </div>
                <div  className="sds-comp-main-div-footer-middle">
                    <CompSelected instanceId={this.props.instanceId}></CompSelected>
                </div>
                <div   className="sds-comp-main-div-footer-right">
                    <span>share.myPromethean.com</span>

                </div>
            </div>
        </div>)
    }

}