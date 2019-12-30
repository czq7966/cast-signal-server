import electron = require('electron')
import fs = require('fs')
import path = require('path')
import robotjs = require('robotjs')

window['MyNode'] =  {
    electron: electron,
    process: process,
    fs: fs,
    path: path,
    robotjs: robotjs,
    __dirname: __dirname,
    __filename: __filename,
    require: __non_webpack_require__
};

window['Electron'] = electron;

fs['mkdirpSync'] = fs['mkdirpSync']  || function(dir: string) {
    if (!fs.existsSync(dir)) {
        let _dir = path.dirname(dir);
        if (_dir && !fs.existsSync(_dir)) {
            fs['mkdirpSync'](_dir);
        } else {
            fs.mkdirSync(dir);
        }
    }
}
