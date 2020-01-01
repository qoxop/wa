import React from 'react';

var A = function A(props) {
  return React.createElement("div", null, "a - ", props.children);
};

var B = function B(props) {
  return React.createElement(A, null, "b - ", props.children);
};

var C = function C(props) {
  return React.createElement(B, null, "c - ", props.children);
};

export default React.createElement(C, null, "666");