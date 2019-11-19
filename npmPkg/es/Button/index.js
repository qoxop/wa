import _classCallCheck from "@babel/runtime-corejs3/helpers/classCallCheck";
import _createClass from "@babel/runtime-corejs3/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime-corejs3/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime-corejs3/helpers/getPrototypeOf";
import _inherits from "@babel/runtime-corejs3/helpers/inherits";
import React from "react";
var t;

(function (t) {
  t[t["a"] = 0] = "a";
  t[t["b"] = 1] = "b";
})(t || (t = {}));

var Button =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Button, _React$Component);

  function Button() {
    _classCallCheck(this, Button);

    return _possibleConstructorReturn(this, _getPrototypeOf(Button).apply(this, arguments));
  }

  _createClass(Button, [{
    key: "render",
    value: function render() {
      console.log(t.a);
      return React.createElement("button", {
        className: "wa-button",
        onClick: this.props.onClick
      }, this.props.children);
    }
  }]);

  return Button;
}(React.Component);

export default Button;