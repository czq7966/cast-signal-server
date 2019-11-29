import React = require("react");
import ReactDOM = require('react-dom');
import './main.css'
import { CompAvatars } from "./avatars";
import { CompFrame } from "./frame";
import { CompPanelID } from "./panel-id";

export interface IMainProps {

}
export interface IMainState {

}

export class Main extends React.Component<IMainProps, IMainState> {
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
                        <input></input>
                    </div>
                    <div className="comps-main-div-body-devider" ></div>
                    <div className="comps-main-div-body-label-id" >
                        <span>Panel ID</span>
                    </div>
                    <div className="comps-main-div-body-panel-id" >
                        <img src="../../images/refresh_icon.svg" ></img>
                        <CompPanelID></CompPanelID>                        
                    </div>
                
                </div>
                <div className="comps-main-div-footer">
                    <div>
                        <CompAvatars></CompAvatars>
                    </div>
                    <CompFrame></CompFrame>
                </div>
            </div>
        )
    }

}