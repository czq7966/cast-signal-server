import React = require("react");
import { EventEmitter } from "events";

export interface IReactCompClass {
    new(...args: any[]) : Object
}

export interface IReactCompBase {
    notDestroyed: boolean
    eventEmitter: EventEmitter,
    instanceId: string;
    isInstance(): boolean     
    getInstance<T extends IReactCompBase>(params?: IReactCompBaseProps | string, create?: boolean): T
    destroy()
}

export interface IReactCompBaseClass extends IReactCompClass {
    instances : {[name: string]: IReactCompBase} 
    instanceDefauleName: string
    getInstance<T extends IReactCompBase>(params?: IReactCompBaseProps | string, create?: boolean): T
}

export interface IReactCompBaseProps {
    instanceId?: string
}
export interface IReactCompBaseState {

}

var InstancesName = 'instances';
export class ReactCompBase<IProps extends IReactCompBaseProps, IState extends IReactCompBaseState> extends React.Component<IProps, IState> implements IReactCompBase {
    notDestroyed: boolean
    eventEmitter: EventEmitter
    instanceId: string;
    
    getInstance<T extends IReactCompBase>(params?: IReactCompBaseProps | string, create?: boolean): T{
        params = params || this.instanceId;
        return (this.constructor as any as IReactCompBaseClass).getInstance(params, create);
    }  
    isInstance(): boolean {
        let constructor = this.constructor as any as IReactCompBaseClass;
        if (constructor.hasOwnProperty(InstancesName)) {
            return this === this.getInstance(this.instanceId, false);
        } else {
            return false
        }        
    } 

    public static instances : {[name: string]: IReactCompBase} = {};
    public static instanceDefauleName: string = 'default'
    public static getInstance<T extends IReactCompBase>(params?: IReactCompBaseProps | string, create: boolean = false): T {
        !this.hasOwnProperty(InstancesName) && (this.instances = {});  
        if (typeof params === 'string') {
            params = { instanceId: params }
        } else {
            params = params || { instanceId: ReactCompBase.instanceDefauleName };
        }

        let id = params.instanceId;
        return this.instances[id] ? this.instances[id] : create ? this.instances[id] = new (this as any)(params) : null;
    }       


    constructor(props) {
        super(props);
        this.notDestroyed = true;
        this.instanceId = this.props.instanceId;
        this.eventEmitter = new EventEmitter();
    }
    destroy() {
        if (this.isInstance() ) {
            let constructor = this.constructor as any as IReactCompBaseClass;
            delete constructor.instances[this.instanceId];
        }
        this.eventEmitter.removeAllListeners();
        delete this.eventEmitter;

        delete this.instanceId;
        delete this.notDestroyed;
    }

    componentDidMount() {
    }    
    componentWillUnmount() {        
        this.destroy();
    }
}