"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TileWMS = _interopRequireDefault(require("ol/source/TileWMS"));

var _Tile = _interopRequireDefault(require("ol/layer/Tile"));

var _wfs = require("../wfs");

var _wps = require("../wps");

var _wms = require("../wms");

var _rest = require("../rest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function GeoserverLayer(lyName, {
  url,
  params = {},
  crossOrigin,
  visible = true
} = {}, tileLayerOptions) {
  (() => {
    let tlo = tileLayerOptions;

    if (!tlo) {
      params = {
        'TILED': true,
        ...params,
        'LAYERS': lyName
      };
      tlo = {
        visible,
        source: new _TileWMS.default({
          url,
          serverType: "geoserver",
          params,
          crossOrigin
        })
      };
    }

    ;

    _Tile.default.call(this, tlo);
  })();
}

;
GeoserverLayer.prototype = Object.create(_Tile.default.prototype);
GeoserverLayer.prototype.constructor = GeoserverLayer;
/*static functions*/

GeoserverLayer.build = function (tileLayerOptions) {
  return new GeoserverLayer(null, null, tileLayerOptions);
};
/* prototype functions*/


const GeoserverLayerPrototype = GeoserverLayer.prototype;
GeoserverLayerPrototype.refresh = _wms.refresh;
GeoserverLayerPrototype.filter = _wms.filter;
GeoserverLayerPrototype.getFilter = _wms.getFilter;
GeoserverLayerPrototype.setStyle = _wms.setStyle;
GeoserverLayerPrototype.getStyle = _wms.getStyle;
GeoserverLayerPrototype.getFeatures = _wfs.getFeatures;
GeoserverLayerPrototype.getFeaturesAtCoordinate = _wms.getFeaturesAtCoordinate;
GeoserverLayerPrototype.countFeatures = _wfs.countFeatures;
GeoserverLayerPrototype.getFeatureTypeDescription = _wfs.getFeatureTypeDescription;
GeoserverLayerPrototype.getBBOX = _wps.getBBOX;
GeoserverLayerPrototype.aggregate = _wps.aggregate;
GeoserverLayerPrototype.exportFeatures = _wfs.exportFeatures;
GeoserverLayerPrototype.getDefinition = _rest.getDefinition;
GeoserverLayerPrototype.getLegendGraphic = _wms.getLegendGraphic;
var _default = GeoserverLayer;
exports.default = _default;