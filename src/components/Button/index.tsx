import React from "react";

interface PropType {
    onClick: (e) => void
}
class Button extends React.Component<PropType, any> {
    render() {
        return <button className="wa-button" onClick={this.props.onClick}>
            {this.props.children}
        </button>
    }
}
export default Button