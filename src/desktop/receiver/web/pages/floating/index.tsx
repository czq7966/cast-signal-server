process.env.NODE_MODE = "development";
window['IsNode'] = false;
import React = require("react");
import ReactDOM = require('react-dom');
import * as Comps from './comps'
import './index.css'



function startRender() {
    let rootEl = document.getElementById('root');
    rootEl && 
    ReactDOM.render(
        <Comps.Main></Comps.Main>
    , rootEl);
}

async function start()  {
    startRender();
}

start();







