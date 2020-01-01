export var logLogo = function logLogo() {
  return console.log('wa~');
};
export var pick = function pick(name) {
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