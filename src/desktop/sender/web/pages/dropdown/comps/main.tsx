import React = require("react");
import ReactDOM = require("react-dom");
import { Dropdown } from '../../../../../../../../activ-cast/src/activ-cast/pages/dropdown/index';

import './main.less'
import { WinIcons } from "./win-icons";
import { PageCommon, ADHOCCAST } from "../../../libex";


export interface IMainProps extends PageCommon.ICompBaseProps {

}
export interface IMainState extends PageCommon.ICompBaseState {
    senders?: {[id: string]: ADHOCCAST.Cmds.IUser}        
}

export class Main extends PageCommon.CompBase<IMainProps, IMainState> {
    constructor(props) {
        super(props);  
    }
    destroy() {

    }   

    componentDidMount() {

    }
    componentWillUnmount() {
        this.destroy();
    }

    onDropdownRef(ref: Dropdown) {
        let titles = document.getElementsByClassName("title");
        if (titles.length > 0) {
            let titleDiv = titles[0] as HTMLDivElement;
            titleDiv.style["-webkit-app-region"] = "drag";
            let iconsDiv = document.createElement('div');
            iconsDiv.className = "title-main-win-icons-div";
            titleDiv.appendChild(iconsDiv);
            ReactDOM.render(<WinIcons instanceId={this.props.instanceId} />, 
                iconsDiv);
    

        }
    
    }

    render() {
        return (
            <div>
                <Dropdown 
                    ref={ref => this.onDropdownRef(ref)}
                />
            </div>
            )
    }
}
