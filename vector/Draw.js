"use strict";

require("core-js/modules/web.dom.iterable");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Draw = _interopRequireWildcard(require("ol/interaction/Draw"));

var _Snap = _interopRequireDefault(require("ol/interaction/Snap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const interactionSettingsMap = {
  "Point": {
    type: "Point"
  },
  "Polygon": {
    type: "Polygon"
  },
  "Line": {
    type: "LineString"
  },
  "Section": {
    type: "LineString",
    maxPoints: 2
  },
  "Box": {
    type: "Circle",
    geometryFunction: (0, _Draw.createBox)()
  },
  "Circle": {
    type: "Circle"
  }
};

function Draw({
  shape,
  source,
  snapping = false,
  ...otherDrawInteractionOptions
}, snapOptions) {
  (() => {
    const drawOptions = { ...interactionSettingsMap[shape],
      source,
      ...otherDrawInteractionOptions
    };

    _Draw.default.call(this, drawOptions);

    if (snapping) {
      const finalSnapOptions = {
        source,
        ...snapOptions
      };
      this.set('snap', new _Snap.default(finalSnapOptions));
    }
  })();
}

Draw.prototype = Object.create(_Draw.default.prototype);
Draw.prototype.constructor = Draw;
const DrawPrototype = Draw.prototype;

DrawPrototype.start = function (map) {
  const snap = this.get('snap');
  map.addInteraction(this);
  if (snap) map.addInteraction(this.get('snap'));
};

DrawPrototype.finish = function () {
  const map = this.getMap(),
        snap = this.get('snap');
  map.removeInteraction(this);
  if (snap) map.removeInteraction(snap);
};

var _default = Draw;
exports.default = _default;