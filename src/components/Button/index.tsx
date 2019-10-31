import React from "react";

enum t {
    a,
    b,
}
interface PropType {
    onClick: (e: any) => void
}
class Button extends React.Component<PropType, any> {
    render() {
        console.log(t.a)
        return <button className="wa-button" onClick={this.props.onClick}>
            {this.props.children}
        </button>
    }
}
export default Button