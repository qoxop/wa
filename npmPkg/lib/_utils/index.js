"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.pick = exports.logLogo = void 0;

var logLogo = function logLogo() {
  return console.log('wa~');
};

exports.logLogo = logLogo;

var pick = function pick(name) {
  var rewrite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (rewrite) {
    return function (props) {
      return props[name] || props.theme[name];
    };
  }

  return function (props) {
    return props.theme[name];
  };
};

exports.pick = pick;