import { ADHOCCAST } from '../../../common';
import { ReactCompBase, IReactCompBaseProps, IReactCompBaseState, IReactCompBase } from "./react-comp-base";


export interface ICompBase extends IReactCompBase {
    dispatcher: ADHOCCAST.Modules.Dispatchers.IDispatcher;
    setRooterEvent(onBeforeRoot: Function, onAfterRoot: Function);
    resetRooterEvent()
}

export interface ICompBaseProps extends IReactCompBaseProps{}
export interface ICompBaseState extends IReactCompBaseState{}

export class CompBase<IProps extends ICompBaseProps, IState extends ICompBaseState> extends ReactCompBase<IProps, IState> implements ICompBase {
    _onBeforeRoot: Function;
    _onAfterRoot: Function;
    dispatcher: ADHOCCAST.Modules.Dispatchers.IDispatcher;
    constructor(props) {
        super(props);
        this.dispatcher = ADHOCCAST.Modules.Dispatchers.Dispatcher.getInstance(this.props.instanceId, false);
    }
    destroy() {
        this.resetRooterEvent();      
        delete this.dispatcher;
        super.destroy();
    }

    setRooterEvent(onBeforeRoot: Function, onAfterRoot: Function) {
        this.resetRooterEvent();
        if (this.dispatcher) {  
            this._onBeforeRoot = onBeforeRoot;
            this._onAfterRoot = onAfterRoot;
            this._onBeforeRoot && this.dispatcher.eventRooter.onBeforeRoot.add(this._onBeforeRoot as any);
            this._onAfterRoot && this.dispatcher.eventRooter.onAfterRoot.add(this._onAfterRoot as any);
        }
    }
    resetRooterEvent() {
        if (this.dispatcher) {            
            this._onBeforeRoot && this.dispatcher.eventRooter.onBeforeRoot.remove(this._onBeforeRoot as any);
            this._onAfterRoot && this.dispatcher.eventRooter.onAfterRoot.remove(this._onAfterRoot as any);
            delete this._onBeforeRoot;
            delete this._onAfterRoot;
        }        
    }
}