"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.default = EnhancePageLoad;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context2; (0, _forEach.default)(_context2 = ownKeys(source, true)).call(_context2, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context3; (0, _forEach.default)(_context3 = ownKeys(source)).call(_context3, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

function EnhancePageLoad(pageSize, service) {
  var initIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var cache = null;
  return function (Comp) {
    var _temp;

    return _temp =
    /*#__PURE__*/
    function (_React$Component) {
      (0, _inherits2.default)(EnhanceComp, _React$Component);

      function EnhanceComp(props) {
        var _this;

        (0, _classCallCheck2.default)(this, EnhanceComp);
        _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(EnhanceComp).call(this, props));
        (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "syncLoading", false);
        (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "params", void 0);
        (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "loadFn", service);
        (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "state", {
          size: pageSize,
          index: initIndex,
          data: [],
          loading: false,
          done: false
        });
        (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "cacheState", function () {
          cache = {
            state: _objectSpread({}, _this.state),
            params: _this.params
          };
        });
        (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "reset", function (params) {
          _this.params = params;
          return new _promise.default(function (resolve) {
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
        (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "reload", function (params) {
          _this.reset(params).then(function () {
            _this.load();
          });
        });
        (0, _defineProperty3.default)((0, _assertThisInitialized2.default)(_this), "load", function () {
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

            return _this.loadFn((0, _assign.default)({
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
                data: (0, _concat.default)(_context = _this.state.data).call(_context, data)
              });

              _this.syncLoading = false;
            }).catch(function () {
              _this.syncLoading = false;
            });
          }

          return _promise.default.resolve();
        });

        if (cache && props.location && props.location.action === "POP") {
          _this.state = _objectSpread({}, _this.state, {}, cache.state || {});
          _this.params = cache.params || undefined;
        }

        cache = null;
        return _this;
      }

      (0, _createClass2.default)(EnhanceComp, [{
        key: "render",
        value: function render() {
          var _this$state2 = this.state,
              index = _this$state2.index,
              data = _this$state2.data;
          return _react.default.createElement(Comp, (0, _extends2.default)({}, this.props, {
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
    }(_react.default.Component), _temp;
  };
}