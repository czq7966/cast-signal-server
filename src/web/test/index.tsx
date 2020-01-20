window["IsNode"] = false;
import Es6ObjectAssign = require('es6-object-assign');
Es6ObjectAssign.polyfill();
import "url-search-params-polyfill";
import "webrtc-adapter";

import React = require('react');
import ReactDOM = require('react-dom');

import { ADHOCCAST } from '../../client/libex'
import { Test } from './test';
ADHOCCAST.Modules.Webrtc.Config.platform = ADHOCCAST.Modules.Webrtc.EPlatform.browser;

export interface IMainState {
    count: number
    content: string

}
export interface IMainProp {

}

export interface IMain extends React.Component<IMainProp, IMainState> {
    onLogin()
    onDisconnect()     
}

export class Main extends React.Component<IMainProp, IMainState> implements IMain {
    constructor(props) {
        super(props)
        this.state = {
            count: 0,
            content: "Loginning..."
        };
    }

    destroy() {

    }   


    componentDidMount() {
        this.init();
    }
    componentWillUnmount() {
        this.unInit();        
        this.destroy();
    }
    componentDidUpdate() {

    }

    init(){
        for (let index = 0; index < 20; index++) {
            new Test(this);            
        }
    }
    unInit() {

    }



    render() {  
        return (
            <div>
                {"Login Count: " + this.state.count}
            </div>    
        )
    }

    onLogin() {
        this.setState({
            count: this.state.count + 1
        })

    }
    onDisconnect() {
        this.setState({
            count: this.state.count - 1
        })
    }
}

let rootEl = document.getElementById('root');
rootEl && 
ReactDOM.render(
    <Main/>
, rootEl);
