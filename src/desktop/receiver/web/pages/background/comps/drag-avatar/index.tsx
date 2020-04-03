import React = require("react");
import * as Floating from '../../../floating/comps/avatars'
import * as PageCommon from '../../../common'
import * as Services from '../../services'
import { ADHOCCAST } from '../../../../../common'
import Draggable from 'react-draggable'
import Affix from 'antd/lib/affix';

import './index.css'

export interface ICompDragAvatarProps extends PageCommon.ICompBaseProps {
    onClick?: Function
}
export interface ICompDragAvatarState extends PageCommon.ICompBaseState {

}

export class CompDragAvatar extends PageCommon.CompBase<ICompDragAvatarProps, ICompDragAvatarState> {
    _dragged: boolean;
    constructor(props) {
        super(props);
        this.setRooterEvent(null, this.onAfterRoot);
    }
    componentDidMount() {
        super.componentDidMount();
    }

    destroy() {
        this.resetRooterEvent();
        super.destroy();
    }

    render() {
        return (
            <div style={{ position: 'absolute', top: '50%', right: '10%'}}>
                <Draggable  onDrag={()=>this.onDrag()} 
                            onMouseDown={()=>this.onMouseDown()}
                            onStart={()=>this.onStart()} 
                            onStop={()=>this.onStop()}>
                    <Affix >
                        <Floating.CompAvatars instanceId={this.props.instanceId} ></Floating.CompAvatars>
                    </Affix>     
                </Draggable>
            </div>
        )
    }


    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;    
        switch(cmdId) {            
            default:
                break;
        }     
    } 

    onDrag() {
        this._dragged = true;
    }
    onMouseDown() {

    }
    onStart() {
        this._dragged = false;
    }
    onStop() {
        if (!this._dragged) {
            if (this.props.onClick) {
                this.props.onClick()
            }
        }
    }

}