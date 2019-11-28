import electron = require('electron')
import fs = require('fs')
import path = require('path')

window['mynode'] =  {
    electron: electron,
    process: process,
    fs: fs,
    path: path,
    robotjs: null
};
window['Electron'] = electron;

window.addEventListener('DOMContentLoaded', () => {
    console.log("Versions: ", process.versions);
})