process.env.NODE_MODE = "development";
window['IsNode'] = false;
import React = require("react");
import ReactDOM = require('react-dom');
import './index.css'
import * as Comps from './comps'
import * as Modules from './modules'
import { ADHOCCAST } from "../../../../common";
import { IPCRenderSignaler } from "../../../../common/modules/ipc-render-signaler";

var params: Modules.IMainConstructorParams = {
    adhocConnection: new Modules.AdhocConnection({instanceId: ADHOCCAST.Cmds.Common.Helper.uuid()}),
    ipcConnection: new Modules.IPCConnection({instanceId: ADHOCCAST.Cmds.Common.Helper.uuid()},
        {factorySignaler: IPCRenderSignaler.TAG} as any)
}
var moduleMain = Modules.Main.getInstance<Modules.Main>(params);

function startRender() {
    let rootEl = document.getElementById('root');
    rootEl && 
    ReactDOM.render(
        <Comps.Main instanceId={Modules.Main.getInstance<Modules.Main>().ipcConnection.instanceId}></Comps.Main>
    , rootEl);
}

async function start()  {
    startRender();
}

start();







