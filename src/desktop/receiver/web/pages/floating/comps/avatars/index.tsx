import React = require("react");
import ReactDOM = require('react-dom');
import './index.css'

export interface ICompAvatarsProps {

}
export interface ICompAvatarsState {

}

export class CompAvatars extends React.Component<ICompAvatarsProps, ICompAvatarsState> {
    constructor(props) {
        super(props);
        this.init();
    }
    destroy() {
        this.unInit();
    }
    componentDidMount() {
    }

    componentWillUnmount() {        
        this.destroy();
    }

    init() {

    }
    unInit() {

    }


    render() {
        return (
            <div className="comps-avatars-div" >
                {/* <img className="comps-avatars-div-icon"  src="../../images/avatars_icon.svg"></img> */}
                <div className="comps-avatars-div-icon" style={{backgroundImage:"url('../../images/avatars_icon.svg')"}} ></div>
                <div className="comps-avatars-div-bubble" style={{backgroundImage:"url('../../images/orange_bubble_icon.svg')"}} >33</div>
            </div>
        )
    }

}
