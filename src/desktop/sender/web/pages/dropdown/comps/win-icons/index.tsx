import React = require("react");
import ReactDOM = require("react-dom");
import './index.less'

export interface WinIconsProps {

}

export interface WinIconsState {    

}


export class WinIcons extends React.Component<WinIconsProps, WinIconsState> {
    constructor(props) {
        super(props);  
    }
    destroy() {

    }   

    componentDidMount() {

    }

    componentWillUnmount() {
        this.destroy();
    }

    render() {
        return (
            <div className="title-win-icons-div">
                <button onClick={() => window.blur()}
                    className="title-win-icons-min-button"
                >-</button>
                <button onClick={() => window.close()}
                    className="title-win-icons-close-button"
                >X</button>              
            </div>
            )
    }
}
