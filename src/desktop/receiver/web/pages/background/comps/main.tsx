import React = require("react");
import ReactDOM = require('react-dom');
import { Base } from "./base";
import * as Modules from '../modules'

export interface IMainProps {

}
export interface IMainState {

}

export class Main extends Base<IMainProps, IMainState> {
    constructor(props) {
        super(props);
        this.init();
    }
    destroy() {
        this.unInit();
        super.destroy();        
    }
    componentDidMount() {
    }

    componentWillUnmount() {        
        this.destroy();
    }

    init() {
        Modules.Main.getInstance<Modules.IMain>().adhocConnection.connection.retryLogin();
    }
    unInit() {

    }


    render() {
        return <div>tttttttttttt</div>
    }

}