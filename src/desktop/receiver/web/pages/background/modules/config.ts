import { ADHOCCAST } from '../../../../common'

export interface IConfig {
    signalerBase: string;
    namespace: string;
    roomPrefix: string;
    loginID: string;
    user: ADHOCCAST.Cmds.IUser;
    destroy()
    getRoomId(): string
    getUserSid(): string
}

export class Config implements IConfig {
    static getInstance(): IConfig {
        return new Config()
    }

    signalerBase: string;
    namespace: string;
    roomPrefix: string;
    loginID: string;
    user: ADHOCCAST.Cmds.IUser;
    constructor() {
            // this.signalerBase = "https://adhoc-cast-signaler-product.k8s.101.com",
            this.signalerBase = "https://mdm.hk.101.com:13670",
            // signalerBase: "http://adhoc-cast-signaler.ws.101.com",  
            // this.signalerBase = "https://adhoc-cast-signaler.101.com";            
            this.namespace = "promethean";
            this.roomPrefix = "promethean_";
            this.loginID = "";
            this.user = {
                id: null
            }
    }
    destroy() {

    }

    getRoomId(): string {
        return (this.roomPrefix == null ? null : this.roomPrefix) + (this.loginID == null ? "" : this.loginID);
    }
    getUserSid(): string{
        return this.loginID
    }
}