
export enum EOTA {
    topPath = "ota:"
}

export interface IOptionsExtra {
    redis?: string
    items?: string[]
}

export interface IOTAParams {
    version?: string
    sn?: string
    os?: string
}


export interface IOTAWhiteList {
    enabled: boolean,
    items: Array<string>
}

export interface IOTABlackList extends IOTAWhiteList {}
export interface IOTAPackage {
    url: string,
    md5: string
}

export interface IOTAVersion {
    version?: string
    enabled: boolean,
    package: IOTAPackage,
    toVersion: string
    whitelist: IOTAWhiteList,
    blacklist: IOTABlackList,
}

export interface IOTAVersions {
    [version: string]: IOTAVersion
}

export interface IOTAResponse {
    code: 0 | 1 | 2;  //0：已是最新版本；1: 有升级包，属性位于package字段；2：错误，错误信息位于message字段
    message?: string
    package?: {
        url?: string
        md5?: string
        version?: string
    }
}