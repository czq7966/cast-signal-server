import React = require("react");

export class Base<TProps, TState> extends React.Component<TProps, TState>  {
    constructor(props) {
        super(props)        
    }    
    destroy() {}
}


