process.env.NODE_MODE = "development";
window['IsNode'] = false;
import React = require("react");
import ReactDOM = require('react-dom');
import * as Comps from './comps'
import * as Modules from './modules'
import './index.css'


function startRender() {
    let rootEl = document.getElementById('root');
    rootEl && 
    ReactDOM.render(
        <Comps.Main instanceId={Modules.Main.getInstance<Modules.Main>().ipcConnection.instanceId} ></Comps.Main>
    , rootEl);
}

async function start()  {
    startRender();
}

start();







