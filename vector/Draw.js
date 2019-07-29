"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Draw = _interopRequireWildcard(require("ol/interaction/Draw"));

var _Snap = _interopRequireDefault(require("ol/interaction/Snap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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