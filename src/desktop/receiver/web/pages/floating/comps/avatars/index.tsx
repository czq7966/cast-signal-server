import React = require("react");
import * as PageCommon from '../../../common'
import * as Common from '../../../../../common'
import { ADHOCCAST } from '../../../../../common';
import Avatar, { AvatarProps } from 'antd/lib/avatar'
import Badge, { BadgeProps } from "antd/lib/badge";
// import { UserOutline } from '@ant-design/icons';
import 'antd/lib/Avatar/style/index.css'
import 'antd/lib/Badge/style/index.css'
import './index.less'

export interface ICompAvatarsProps extends PageCommon.ICompBaseProps {
    avatar: AvatarProps
    badge: BadgeProps
}
export interface ICompAvatarsState extends PageCommon.ICompBaseState {
    count: any;
}

export class CompAvatars extends PageCommon.CompBase<ICompAvatarsProps, ICompAvatarsState> {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
        this.setRooterEvent(null, this.onAfterRoot);
    }

    componentDidMount() {
        Common.Services.Cmds.CustomGetSendingUsers.req(this.props.instanceId);
        super.componentDidMount();
    }

    destroy() {
        this.resetRooterEvent();
        super.destroy();
    }


    render() {
        return (
            // <div style={{position: "relative", width: "100%", height: "100%"}}>
            //     <Avatar 
            //         shape={this.props.avatar.shape}
            //         size={this.props.avatar.size || 61}
            //         /** Src of image avatar */
            //         src={this.props.avatar.src}
            //         /** Srcset of image avatar */
            //         srcSet={this.props.avatar.srcSet}
            //         /** Type of the Icon to be used in avatar */
            //         // icon={this.props.avatar.icon || "user"}
            //         style={{
            //             position: "absolute", 
            //             width:null, 
            //             height:null,
            //             lineHeight: null,
            //             fontSize: "600%"
            //         }}
            //         prefixCls={this.props.avatar.prefixCls}
            //         className={this.props.avatar.className || "fit-comp-avatar"}
            //         children={this.props.avatar.children}
            //         alt={this.props.avatar.alt}
            //         onError={this.props.avatar.onError}                    
            //     />
            //     <Badge 
            //         /** Number to show in badge */
            //         count={this.props.badge.count || this.state.count || 12}
            //         showZero={this.props.badge.showZero}
            //         /** Max count to show */
            //         overflowCount={this.props.badge.overflowCount}
            //         /** whether to show red dot without number */
            //         dot={this.props.badge.dot}
            //         style={{position: "absolute"}}
            //         prefixCls={this.props.badge.prefixCls}
            //         scrollNumberPrefixCls={this.props.badge.scrollNumberPrefixCls}
            //         className={this.props.badge.className || "fit-comp-badge"}
            //         status={this.props.badge.status}
            //         text={this.props.badge.text}
            //         offset={this.props.badge.offset}
            //         title={this.props.badge.title}
            //     />
            // </div>
            <div className="fit-comp-avatar-div" >
                <div className="fit-comp-avatar-avatar" ></div>
                <div className="fit-comp-avatar-badge" >
                    <div>
                        {this.state.count || 123}
                    </div>
                </div>
            </div>
        )
    }

    onAfterRoot = (cmd: ADHOCCAST.Cmds.Common.ICommand): any => {
        let cmdId = cmd.data.cmdId;
        let type = cmd.data.type;   
        switch(cmdId) {            
            case Common.Cmds.ECommandId.custom_get_sendering_users:
                if (type == ADHOCCAST.Cmds.ECommandType.resp) {
                    let users: {[id: string]: ADHOCCAST.Cmds.IUser} = cmd.data.extra;
                    let length = users ? Object.keys(users).length: 0;
                    this.setState({
                        count: length
                    })
                }
                break;
            case ADHOCCAST.Cmds.ECommandId.network_disconnect:
                this.setState({count: 0});
                break;
            default:
                break;
        }     
    }      

}
