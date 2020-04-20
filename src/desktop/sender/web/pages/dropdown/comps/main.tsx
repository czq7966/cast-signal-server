import React = require("react");
import ReactDOM = require("react-dom");
import { Dropdown } from '../../../../../../../../activ-cast/src/activ-cast/pages/dropdown/index';
import './main.less'
import { WinIcons } from "./win-icons";
export interface MainProps {

}

export interface MainState {    

}


export class Main extends React.Component<MainProps, MainState> {

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
            iconsDiv.className = "title-icons-div";
            titleDiv.appendChild(iconsDiv);
            // const title = React.createElement("button", {className: "main"}, "XX");
            ReactDOM.render(<WinIcons />, 
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
