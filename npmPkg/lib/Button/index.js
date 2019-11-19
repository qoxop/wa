"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var t;

(function (t) {
  t[t["a"] = 0] = "a";
  t[t["b"] = 1] = "b";
})(t || (t = {}));

var Button =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Button, _React$Component);

  function Button() {
    (0, _classCallCheck2.default)(this, Button);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Button).apply(this, arguments));
  }

  (0, _createClass2.default)(Button, [{
    key: "render",
    value: function render() {
      console.log(t.a);
      return _react.default.createElement("button", {
        className: "wa-button",
        onClick: this.props.onClick
      }, this.props.children);
    }
  }]);
  return Button;
}(_react.default.Component);

var _default = Button;
exports.default = _default;