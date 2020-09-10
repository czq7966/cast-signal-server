import * as Express from 'express'
import * as Modules from '../modules'
import * as Dts from '../dts'


export class OTA {
    static getItemTopPath(item: string): string {
        return Dts.EOTA.topPath + item;
    }
    static async onReq(namespace: Modules.IOTANamespace, req: Express.Request, res: Express.Response, item: string) {
        this.checkCurrentVersionRecord(namespace, req, res, item);
    }

    //返回已是最新版本
    static isLatestVersion(namespace: Modules.IOTANamespace, req: Express.Request, res: Express.Response, item:string, message?: string) {
        let pkg: Dts.IOTAResponse = {
            code: 0,
            message: message
        }
        res.send(pkg);
    }

    //返回升级包信息
    static async hasUpdatePackage(namespace: Modules.IOTANamespace, req: Express.Request, res: Express.Response, item:string, version: Dts.IOTAVersion, toVersion:  Dts.IOTAVersion) {
        let pkg: Dts.IOTAResponse = {
            code: 1,
            package: {
                url: toVersion.package.url,
                md5: toVersion.package.md5,
                version: version.toVersion
            }

        }
        res.send(pkg);
    }    


    // 当前版本记录检查
    static async checkCurrentVersionRecord(namespace: Modules.IOTANamespace, req: Express.Request, res: Express.Response, item:string ) {
        let params = req.query as Dts.IOTAParams;
        let versionStr = await namespace.redisSignaler.hget(this.getItemTopPath(item), params.version);
        let version: Dts.IOTAVersion = versionStr ? JSON.parse(versionStr) as Dts.IOTAVersion : null;
        if (version) {
            ////升级版本记录检查
            version.version = params.version;
            this.checkUpdateVersionRecord(namespace, req, res, item, version );
        } else { //已是最新版本
            this.isLatestVersion(namespace, req, res, item, '无此版本记录：' + params.version);
        }
    }

    //升级版本记录检查
    static async checkUpdateVersionRecord(namespace: Modules.IOTANamespace, req: Express.Request, res: Express.Response, item:string, version: Dts.IOTAVersion) {
        if (version.toVersion) {
            let params = req.query as Dts.IOTAParams;
            let toVersionStr = await namespace.redisSignaler.hget(this.getItemTopPath(item), version.toVersion);
            let toVersion: Dts.IOTAVersion = toVersionStr ? JSON.parse(toVersionStr) as Dts.IOTAVersion : null;
            if (toVersion) {
                //升级白名单检查
                toVersion.version = version.toVersion;
                this.checkUpdateWhiteList(namespace, req, res, item, version, toVersion)
            } else { 
                //没有升级版本记录，已是最新版本
                this.isLatestVersion(namespace, req, res, item, '无升级版本记录:' + version.toVersion);
            } 

        } else {
             //没有设置升级版本，已是最新版本
             this.isLatestVersion(namespace, req, res, item, '未设置升级版本号');
        }      
    }

    // 升级版本白名单检查
    static async checkUpdateWhiteList(namespace: Modules.IOTANamespace, req: Express.Request, res: Express.Response, item:string, version: Dts.IOTAVersion, toVersion:  Dts.IOTAVersion) {
        let params = req.query as Dts.IOTAParams;
        let sn = params.sn;

        let isWhite =   sn && 
                        toVersion.whitelist && 
                        toVersion.whitelist.enabled && 
                        toVersion.whitelist.items && 
                        toVersion.whitelist.items.length > 0 && 
                        toVersion.whitelist.items.indexOf(sn) > 0;
        if (isWhite) {
            // 是白名单且激活
            this.checkUpdateBlackList(namespace, req, res, item, version, toVersion);
        } else {
            // 不是白名单, 检查升级是否激活
            this.checkCurrentVersionEnabled(namespace, req, res, item, version, toVersion)

        }
    }

    // 升级版本黑名单检查
    static async checkUpdateBlackList(namespace: Modules.IOTANamespace, req: Express.Request, res: Express.Response, item:string, version: Dts.IOTAVersion, toVersion:  Dts.IOTAVersion) {
        let params = req.query as Dts.IOTAParams;
        let sn = params.sn;

        let isBlack =   sn && 
                        toVersion.blacklist && 
                        toVersion.blacklist.enabled && 
                        toVersion.blacklist.items && 
                        toVersion.blacklist.items.length > 0 && 
                        toVersion.blacklist.items.indexOf(sn) > 0;
        if (!isBlack) {
            // 不是黑名单
            this.checkCurrentVersionEnabled(namespace,req, res, item, version, toVersion)

        } else {
            // 是黑名单且激活，已是最新版本
            this.isLatestVersion(namespace, req, res, item, '该设备属于黑名单:' + sn);

        }
    }

    //检查当前版本是否激活
    static async checkCurrentVersionEnabled(namespace: Modules.IOTANamespace, req: Express.Request, res: Express.Response, item:string, version: Dts.IOTAVersion, toVersion:  Dts.IOTAVersion) {
        if (version.enabled) {
            //激活, 黑名单检查
            this.checkUpdateBlackList(namespace, req, res, item, version, toVersion);
        } else {
            //未激活，已是最新版本
            this.isLatestVersion(namespace, req, res, item, '升级未激活');
        }
    }

    //检查升级版本信息
    static async checkUpdateVersionPackage(namespace: Modules.IOTANamespace, req: Express.Request, res: Express.Response, item:string, version: Dts.IOTAVersion, toVersion:  Dts.IOTAVersion) {
        if (toVersion.package && toVersion.package.url && toVersion.package.md5) {
            //信息完整，返回
             
        } else {
            //信息不完整，返回
            this.isLatestVersion(namespace, req, res, item, '升级包信息不完整');
        }
    }    


}