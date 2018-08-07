'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('../es5/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CameraRotateIcon = function CameraRotateIcon(props) {
  return _react2.default.createElement(_index2.default, _extends({ dangerouslySetGlyph: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><g fill="currentColor" fill-rule="evenodd"><rect x="2" y="5" width="20" height="16" rx="2"/><path d="M8 4c0-.552.453-1 .997-1h6.006c.55 0 .997.444.997 1v1H8V4z"/><circle cx="12" cy="17" r="1"/><path d="M16.9 14a5 5 0 1 0-4.9 4v-2a3 3 0 1 1 2.83-2h2.07z" fill-rule="nonzero"/><path d="M13.292 12.291a1.004 1.004 0 0 0 0 1.415l1.997 1.996c.197.197.453.298.712.298.254 0 .511-.099.711-.298l1.995-1.996a1 1 0 1 0-1.414-1.415L16 13.585l-1.294-1.294a1 1 0 0 0-1.414 0z"/></g></svg>' }, props));
};
exports.default = CameraRotateIcon;