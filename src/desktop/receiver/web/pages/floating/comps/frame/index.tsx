import React = require("react");
import './index.css'

export interface ICompFrameProps {

}
export interface ICompFrameState {

}

export class CompFrame extends React.Component<ICompFrameProps, ICompFrameState> {
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
            <div className="comps-frame-div" >
                <div className="comps-frame-div-close"                   
                    
                >
                    <button 
                        style={{backgroundImage:"url('../../images/close_icon.svg')"}}  
                        onClick={this.onBtnCloseClick}></button>
                </div>
            </div>
        )
    }

    onBtnCloseClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log('1111111')
        window.close();        
    }    

}
