process.env.NODE_MODE = "development";
import './polyfills'
import React = require("react");
import ReactDOM = require('react-dom');
import { Main as Background } from "../../../../../../../activ-cast/src/activ-cast/background/main";
import { storage } from "../../../../../../../activ-cast/src/activ-cast/background/storage";
import * as Comps from './comps'
import * as Modules from './modules'
import { ADHOCCAST } from "../../../../common";
import { IPCRenderSignaler } from "../../../../common/modules/ipc-render-signaler";

var params: Modules.IMainConstructorParams = {
    ipcConnection: new Modules.IPCConnection({instanceId: ADHOCCAST.Cmds.Common.Helper.uuid()},
        {factorySignaler: IPCRenderSignaler.TAG} as any)
}
var moduleMain = Modules.Main.getInstance<Modules.Main>(params);


function startRender() {
    new Background();
    let rootEl = document.getElementById('desktop-root');

    rootEl && 
    ReactDOM.render(
        <Comps.Main instanceId={Modules.Main.getInstance<Modules.Main>().ipcConnection.instanceId} />
    , rootEl);
}

async function start()  {
    await chrome.i18n.loadUILanguage()
    await storage.load();
    startRender();
}

start();







