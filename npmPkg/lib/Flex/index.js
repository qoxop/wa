"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var A = function A(props) {
  return _react.default.createElement("div", null, "a - ", props.children);
};

var B = function B(props) {
  return _react.default.createElement(A, null, "b - ", props.children);
};

var C = function C(props) {
  return _react.default.createElement(B, null, "c - ", props.children);
};

var _default = _react.default.createElement(C, null, "666");

exports.default = _default;