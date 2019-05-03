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

function Drawing(map, {
  shape,
  source,
  ...otherDrawInteractionOptions
}) {
  this.listeners = {};
  this.interactions = {};
  this.map = map;
  this.source = source;

  (() => {
    const {
      listeners,
      interactions
    } = this,
          drawInitOptions = { ...interactionSettingsMap[shape],
      source,
      ...otherDrawInteractionOptions
    },
          di = interactions.drawInteraction = new _Draw.default(drawInitOptions);
    di.on("drawstart", drawEvt => {
      const {
        drawstart,
        drawing
      } = listeners,
            sketch = drawEvt.feature,
            sketchGeom = sketch.getGeometry();
      sketchGeom.on("change", () => {
        drawing && drawing.call(null, drawEvt);
      });
      drawstart && drawstart.call(null, drawEvt);
    });
    di.on("drawend", drawEvt => {
      const {
        drawend
      } = listeners;
      drawend && drawend.call(null, drawEvt);
    });
  })();
}

const DrawingPrototype = Drawing.prototype;

DrawingPrototype.on = function (event, listener) {
  this.listeners[event] = listener;
  return this;
};

DrawingPrototype.start = function () {
  const {
    map,
    source,
    interactions
  } = this;
  interactions.snapInteraction = new _Snap.default({
    source
  });
  map.addInteraction(interactions.drawInteraction);
  map.addInteraction(interactions.snapInteraction);
};

DrawingPrototype.finish = function () {
  const {
    map
  } = this;
  const {
    drawInteraction,
    snapInteraction
  } = this.interactions;
  drawInteraction.finishDrawing();
  map.removeInteraction(drawInteraction);
  map.removeInteraction(snapInteraction);
};

var _default = Drawing;
exports.default = _default;