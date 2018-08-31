'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('../../es5/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditorIndentIcon = function EditorIndentIcon(props) {
  return _react2.default.createElement(_index2.default, _extends({ dangerouslySetGlyph: '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M9 9H6.49a.495.495 0 0 0-.49.505v.99c0 .291.22.505.49.505H9v2l3-3-3-3v2zm4-1.495c0-.279.228-.505.491-.505h5.018a.49.49 0 0 1 .491.505v.99a.503.503 0 0 1-.491.505h-5.018A.49.49 0 0 1 13 8.495v-.99zm0 4c0-.279.228-.505.491-.505h5.018a.49.49 0 0 1 .491.505v.99a.503.503 0 0 1-.491.505h-5.018a.49.49 0 0 1-.491-.505v-.99zm-6 4c0-.279.229-.505.5-.505h11c.276 0 .5.214.5.505v.99a.506.506 0 0 1-.5.505h-11a.495.495 0 0 1-.5-.505v-.99z" fill="currentColor" fill-rule="evenodd"/></svg>' }, props));
};
EditorIndentIcon.displayName = 'EditorIndentIcon';
exports.default = EditorIndentIcon;