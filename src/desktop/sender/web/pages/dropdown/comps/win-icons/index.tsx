import React = require("react");
import ReactDOM = require("react-dom");
import { PageCommon } from "../../../../libex";
import * as Services from '../../services'
import * as Cmds from '../../cmds'
import './index.less'

export interface WinIconsProps extends PageCommon.ICompBaseProps  {

}

export interface WinIconsState extends PageCommon.ICompBaseState  {    

}


export class WinIcons extends PageCommon.CompBase<WinIconsProps, WinIconsState> {
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

    doClose() {
        Cmds.CustomWindow.close(this.props.instanceId)
    }

    doMinimize() {
        Cmds.CustomWindow.minimize(this.props.instanceId);
    }

    render() {
        return (
            <div className="title-win-icons-div">
                <button onClick={() =>  this.doMinimize()}
                    className="title-win-icons-min-button"
                >-</button>
                <button onClick={() => this.doClose() }
                    className="title-win-icons-close-button"
                >X</button>              
            </div>
            )
    }
}
