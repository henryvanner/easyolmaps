"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Draw = _interopRequireWildcard(require("ol/interaction/Draw"));

var _Modify = _interopRequireDefault(require("ol/interaction/Modify"));

var _Collection = _interopRequireDefault(require("ol/Collection"));

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
  measure = false,
  ...DrawOptions
}) {
  this.listeners = {};
  this.interactions = {};
  this.map = map;

  (() => {
    const {
      listeners,
      interactions,
      map
    } = this,
          settings = { ...interactionSettingsMap[shape],
      ...DrawOptions
    },
          di = interactions.drawinteraction = new _Draw.default(settings);
    di.on("drawstart", drawEvt => {
      const {
        drawstart,
        drawing
      } = listeners,
            {
        modifyInteraction
      } = interactions,
            sketch = drawEvt.feature,
            sketchGeom = sketch.getGeometry();
      map.removeInteraction(modifyInteraction);
      drawstart && drawstart.call(null, drawEvt);
      sketchGeom.on("change", evt => {
        drawing && drawing.call(null, evt);
      });
    });
    di.on("drawend", drawEvt => {
      const {
        drawend
      } = listeners;
      const features = new _Collection.default([drawEvt.feature]);
      interactions.modifyInteraction = new _Modify.default({
        features
      });
      map.addInteraction(interactions.modifyInteraction);
      drawend && drawend.call(null, drawEvt);
    });
  })();
}
/* prototype functions */


const DrawingPrototype = Drawing.prototype;

DrawingPrototype.on = function (event, listener) {
  this.listeners[event] = listener;
  return this;
};

DrawingPrototype.start = function () {
  const {
    map
  } = this;
  const {
    drawinteraction
  } = this.interactions;
  map.addInteraction(drawinteraction);
};

DrawingPrototype.finish = function () {
  const {
    map
  } = this;
  const {
    drawinteraction,
    modifyInteraction
  } = this.interactions;
  drawinteraction.finishDrawing();
  map.removeInteraction(drawinteraction);
  map.removeInteraction(modifyInteraction);
};

var _default = Drawing;
exports.default = _default;