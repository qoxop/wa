import _Object$defineProperty from "@babel/runtime-corejs3/core-js-stable/object/define-property";
import _Object$defineProperties from "@babel/runtime-corejs3/core-js-stable/object/define-properties";
import _Object$getOwnPropertyDescriptors from "@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors";
import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/for-each";
import _Object$getOwnPropertyDescriptor from "@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor";
import _filterInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/filter";
import _Object$getOwnPropertySymbols from "@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols";
import _Object$keys from "@babel/runtime-corejs3/core-js-stable/object/keys";
import _extends from "@babel/runtime-corejs3/helpers/extends";
import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _Object$assign from "@babel/runtime-corejs3/core-js-stable/object/assign";
import _Promise from "@babel/runtime-corejs3/core-js-stable/promise";
import _classCallCheck from "@babel/runtime-corejs3/helpers/classCallCheck";
import _createClass from "@babel/runtime-corejs3/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime-corejs3/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime-corejs3/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime-corejs3/helpers/assertThisInitialized";
import _inherits from "@babel/runtime-corejs3/helpers/inherits";
import _defineProperty from "@babel/runtime-corejs3/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context2; _forEachInstanceProperty(_context2 = ownKeys(source, true)).call(_context2, function (key) { _defineProperty(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { var _context3; _forEachInstanceProperty(_context3 = ownKeys(source)).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
export default function EnhancePageLoad(pageSize, service) {
  var initIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var cache = null;
  return function (Comp) {
    var _temp;

    return _temp =
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(EnhanceComp, _React$Component);

      function EnhanceComp(props) {
        var _this;

        _classCallCheck(this, EnhanceComp);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(EnhanceComp).call(this, props));

        _defineProperty(_assertThisInitialized(_this), "syncLoading", false);

        _defineProperty(_assertThisInitialized(_this), "params", void 0);

        _defineProperty(_assertThisInitialized(_this), "loadFn", service);

        _defineProperty(_assertThisInitialized(_this), "state", {
          size: pageSize,
          index: initIndex,
          data: [],
          loading: false,
          done: false
        });

        _defineProperty(_assertThisInitialized(_this), "cacheState", function () {
          cache = {
            state: _objectSpread({}, _this.state),
            params: _this.params
          };
        });

        _defineProperty(_assertThisInitialized(_this), "reset", function (params) {
          _this.params = params;
          return new _Promise(function (resolve) {
            _this.setState({
              size: pageSize,
              index: initIndex,
              data: [],
              loading: false,
              done: false
            }, function () {
              resolve();
            });
          });
        });

        _defineProperty(_assertThisInitialized(_this), "reload", function (params) {
          _this.reset(params).then(function () {
            _this.load();
          });
        });

        _defineProperty(_assertThisInitialized(_this), "load", function () {
          var _this$state = _this.state,
              index = _this$state.index,
              size = _this$state.size,
              isDone = _this$state.done,
              oldData = _this$state.data;

          if (!_this.syncLoading && !isDone && typeof _this.loadFn === 'function') {
            _this.syncLoading = true;

            _this.setState({
              loading: true
            });

            return _this.loadFn(_Object$assign({
              pageIndex: index + 1,
              pageSize: size,
              curLength: oldData.length
            }, _this.params)).then(function (_ref) {
              var _context;

              var data = _ref.data,
                  done = _ref.done;

              _this.setState({
                done: done,
                loading: false,
                index: index + 1,
                data: _concatInstanceProperty(_context = _this.state.data).call(_context, data)
              });

              _this.syncLoading = false;
            }).catch(function () {
              _this.syncLoading = false;
            });
          }

          return _Promise.resolve();
        });

        if (cache && props.location && props.location.action === "POP") {
          _this.state = _objectSpread({}, _this.state, {}, cache.state || {});
          _this.params = cache.params || undefined;
        }

        cache = null;
        return _this;
      }

      _createClass(EnhanceComp, [{
        key: "render",
        value: function render() {
          var _this$state2 = this.state,
              index = _this$state2.index,
              data = _this$state2.data;
          return React.createElement(Comp, _extends({}, this.props, {
            pageState: _objectSpread({}, this.state, {
              searched: index > initIndex,
              isEmpty: data.length < 1 && index > initIndex
            }),
            pageActions: {
              load: this.load,
              reset: this.reset,
              reload: this.reload,
              cacheState: this.cacheState
            }
          }));
        }
      }]);

      return EnhanceComp;
    }(React.Component), _temp;
  };
}