process.env.NODE_MODE = "development";
import './polyfills'
import React = require("react");
import ReactDOM = require('react-dom');
import { Main as Background } from "../../../../../../../activ-cast/src/activ-cast/background/main";
import { storage } from "../../../../../../../activ-cast/src/activ-cast/background/storage";
import * as Comps from './comps'


function startRender() {
    new Background();
    let rootEl = document.getElementById('desktop-root');

    rootEl && 
    ReactDOM.render(
        <Comps.Main />
    , rootEl);
}

async function start()  {
    await chrome.i18n.loadUILanguage()
    await storage.load();
    startRender();
}

start();







