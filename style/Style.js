"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Style = _interopRequireDefault(require("ol/style/Style"));

var _Fill = _interopRequireDefault(require("ol/style/Fill"));

var _Stroke = _interopRequireDefault(require("ol/style/Stroke"));

var _Circle = _interopRequireDefault(require("ol/style/Circle"));

var _Text = _interopRequireDefault(require("ol/style/Text"));

var _Icon = _interopRequireDefault(require("ol/style/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* tools */
function hex2rgb(hex) {
  let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5), 16);
  return [r, g, b];
}

const dashValues = {
  "dot": [2, 10],
  "dash": [10, 10],
  "dashdot": [10, 10, 2, 10],
  "longdash": [20, 10],
  "longdashdot": [20, 10, 2, 10],
  "solid": []
};
/* end tools */

function Style({
  /* fill related properties */
  fill,
  fillColor = '#ee9900',
  fillOpacity = 0.4,
  stroke,
  strokeColor = '#ee9900',
  strokeOpacity = 1,
  strokeWidth = 1,
  strokeLinecap = 'round',
  strokeDashStyle = 'solid',
  pointRadius,
  graphic,
  externalGraphic,
  graphicOpacity = 1,
  graphicScale,
  //ol3 parameter
  rotation,
  anchor = [0.5, 0.5],
  //ol3 parameter
  label,
  labelAlign = 'center',
  labelBaseline = 'middle',
  labelXOffset,
  labelYOffset,
  labelOutlineColor = '#ffffff',
  labelOutlineWidth = 3,
  labelOutlineOpacity = 1,
  font,
  //ol3 parameter
  fontColor = '#000000',
  fontOpacity = 1
}) {
  (() => {
    const fill1 = fill ? new _Fill.default({
      color: hex2rgb(fillColor).concat(fillOpacity)
    }) : null;
    const stroke1 = stroke ? new _Stroke.default({
      color: hex2rgb(strokeColor).concat(strokeOpacity),
      width: strokeWidth,
      lineCap: strokeLinecap,
      lineDash: strokeDashStyle ? dashValues[strokeDashStyle] : undefined
    }) : null;
    const image1 = pointRadius && !graphic ? new _Circle.default({
      radius: pointRadius,
      fill: fill1,
      stroke: stroke1
    }) : null;
    const icon = !pointRadius && graphic && externalGraphic ? new _Icon.default({
      src: externalGraphic,
      opacity: graphicOpacity,
      rotation: rotation,
      anchor: anchor,
      scale: graphicScale
    }) : null;
    const text1 = label ? new _Text.default({
      text: label,
      textAlign: labelAlign,
      textBaseline: labelBaseline,
      offsetX: labelXOffset,
      offsetY: labelYOffset,
      font,
      stroke: labelOutlineWidth ? new _Stroke.default({
        color: hex2rgb(labelOutlineColor).concat(labelOutlineOpacity),
        width: labelOutlineWidth
      }) : null,
      fill: new _Fill.default({
        color: hex2rgb(fontColor).concat(fontOpacity)
      })
    }) : null;

    _Style.default.call(this, {
      fill: fill1,
      stroke: stroke1,
      image: icon || image1,
      text: text1
    });
  })();
}

Style.prototype = Object.create(_Style.default.prototype);
Style.prototype.constructor = Style;
var _default = Style;
exports.default = _default;