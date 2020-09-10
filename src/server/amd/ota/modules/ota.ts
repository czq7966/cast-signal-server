import * as Express from 'express'
import * as Modules from '../../../modules'
import * as Dts from '../dts'
import * as RedisSignaler from '../../redis-signaler'
import * as Services from '../services'


export interface IOTANamespace extends Modules.ISocketNamespace  {
    redisSignaler: RedisSignaler.IRedisSignaler
}

export class SocketNamespace  extends Modules.SocketNamespace implements IOTANamespace {
    options: Modules.ISocketNamespaceOptions<Dts.IOptionsExtra>
    redisSignaler: RedisSignaler.IRedisSignaler
    constructor(nsp: Modules.ISocketIONamespace, server?:Modules.IServer, options?: Modules.ISocketNamespaceOptions<any> ) {
        super(nsp, server, options);
        this.options = options;
        this.redisSignaler = this.server.getNamespace(this.options.extra.redis) as RedisSignaler.IRedisSignaler;
        server.httpServers.servers.forEach(httpServer => {
            let appExpress = httpServer.expressApp.express;
            let otaExpress = Express();

            this.options.extra.items.forEach(item => {
                otaExpress.use('/' + item , (req, res) => {
                    Services.OTA.onReq(this, req, res, item);
                })
            })
            
            appExpress.use("/ota", otaExpress);

            appExpress.use("/*", (req, res) => { Services.OTA.onInvalidReq(this, req, res); });
            otaExpress.use("/*", (req, res) => { Services.OTA.onInvalidReq(this, req, res); });

        })
    }

    destroy() {
        super.destroy();
    }

}