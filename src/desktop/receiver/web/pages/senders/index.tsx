process.env.NODE_MODE = "development";
import React = require("react");
import ReactDOM = require('react-dom');
import './index.css'



function startRender() {
    let rootEl = document.getElementById('root');
    rootEl && 
    ReactDOM.render(
        <div>bbbbbbbbbbbbbbb</div>
    , rootEl);
}

async function start()  {
    startRender();
}

start();







