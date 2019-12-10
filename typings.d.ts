
declare var adhoc_cast_connection_console : {
    log(...args: any[])
    warn(...args: any[])
    dir(...args: any[])
    trace(...args: any[])
    error(...args: any[])
}

declare var global: any;
declare var IsNode: boolean;
declare var __non_webpack_require__: any;



interface Window {
    MyNode: typeof MyNode;
}

declare namespace MyNode {
    var electron: Electron.MainInterface;
    var process: NodeJS.Process;
    var fs: any;
    var path: any;
    var robotjs: any;
    var __dirname: string;
    var __filename: string;
    var require: any;
}