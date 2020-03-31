process.env.NODE_MODE = "development";
window['IsNode'] = false;
import React = require("react");
import ReactDOM = require('react-dom');
import * as Modules from './modules'
import * as Comps from './comps'
import * as BGComps from '../background/comps'
import * as SDSComps from '../senders/comps'
import './index.css'

var moduleMain = Modules.Main.getInstance<Modules.IMain>()

function startRender() {
    let rootEl = document.getElementById('root');
    rootEl && 
    ReactDOM.render(
        <Comps.Main moduleMain={moduleMain} instanceId={moduleMain.sdsModuleMain.ipcConnection.instanceId} ></Comps.Main>
    , rootEl);
    // let bgRootEl = document.getElementById('bg-root');
    // bgRootEl && 
    // ReactDOM.render(
    //     <BGComps.Main instanceId={moduleMain.bgModuleMain.ipcConnection.instanceId} ></BGComps.Main>
    // , bgRootEl);

    // let sdsRootEl = document.getElementById('sds-root');
    // sdsRootEl && 
    // ReactDOM.render(
    //     <SDSComps.Main instanceId={moduleMain.sdsModuleMain.ipcConnection.instanceId} ></SDSComps.Main>
    // , sdsRootEl);
}

async function start()  {
    startRender();
}

start();







