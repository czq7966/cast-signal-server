import { ADHOCCAST } from '../../../../common'

export interface IConfigItems {
    signaler?: string
    organization?: string    

    roomPrefix: string;    
    loginID: string;
    user: ADHOCCAST.Cmds.IUser;

}

var defaultItems: IConfigItems = {
    // signaler : "https://mdm.hk.101.com:13670",
    // signalerBase: "http://adhoc-cast-signaler.ws.101.com",  
    // signaler: "https://adhoc-cast-signaler.101.com",  
    signaler: "https://servicediscovery.mypromethean.com",          
    organization: "promethean",
    roomPrefix: "promethean_",
    loginID: ADHOCCAST.Cmds.Common.Helper.uuid(6, 10),
    user: {
        id: null        
    }
}

export interface IConfig {
    items: IConfigItems;

    load(): Promise<IConfigItems> 
    reset(): Promise<any> 
    save(): Promise<any> 

    getRoomId(): string
    getUserSid(): string
}

export class Config implements IConfig {
    static _instance: IConfig;
    static getInstance(): IConfig {
        if (!this._instance) {
            this._instance = new Config();
        }
        return this._instance;
    }

    items: IConfigItems;
    constructor() {
        this.initItems({} as any);
    }
    destroy() {

    }

    initItems(items: IConfigItems) {
        this.items = JSON.parse(JSON.stringify(defaultItems));
        let sid = items.user && items.user.sid && items.user.sid || "";
        let id = items.user && items.user.id || ADHOCCAST.Cmds.Common.Helper.uuid();
        // let id = ADHOCCAST.Cmds.Common.Helper.uuid();
        let nick = items.user && items.user.nick || "";
        this.items.user.sid = sid;
        this.items.user.nick = nick;
        this.items.user.id = id;
    }    

    load(): Promise<IConfigItems> {
        return new Promise((resolve, reject) => {      
            let storage = new Storage();            
            let items = JSON.parse(storage.getItem(Config.name) || "{}");
            this.initItems(items);
            resolve(this.items);
        })
    }
    reset(): Promise<any> {
        this.initItems({} as any);
        return this.save();
    }
    save(): Promise<any> {
        return new Promise((resolve, reject) => {
            let storage = new Storage();    
            storage.setItem(Config.name, JSON.stringify(this.items));
        })        
    }    

    getRoomId(): string {
        return !this.items.loginID ? null : this.items.roomPrefix + this.items.loginID
    }
    getUserSid(): string{
        return this.items.loginID
    }
}