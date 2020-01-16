"use strict";

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refresh = refresh;
exports.filter = filter;
exports.getFilter = getFilter;
exports.setStyle = setStyle;
exports.getStyle = getStyle;
exports.getFeaturesAtCoordinate = getFeaturesAtCoordinate;
exports.getLegendGraphic = getLegendGraphic;

var _util = require("../util");

const getGetFeatureInfoURLAtCoordinate = (layer, coordinate, map, getFeatureInfoParams) => {
  const mapView = map.getView(),
        url = layer.getSource().getGetFeatureInfoUrl(coordinate, mapView.getResolution(), mapView.getProjection(), getFeatureInfoParams);
  return url;
};

function refresh() {
  this.getSource().updateParams({
    "time": Date.now()
  });
  this.getSource().refresh();
}

function filter(cql_filter) {
  if (cql_filter) {
    this.getSource().updateParams({
      'CQL_FILTER': cql_filter
    });
  } else {
    delete this.getSource().getParams()['CQL_FILTER'];
    this.getSource().updateParams();
  }

  ;
}

function getFilter() {
  const params = this.getSource().getParams();
  return params["CQL_FILTER"] || params['cql_filter'] || '';
}

function setStyle(style) {
  this.getSource().updateParams({
    'STYLES': style
  });
}

function getStyle() {
  return this.getSource().getParams()["STYLES"] || '';
}

function getFeaturesAtCoordinate(coordinate, map, customParams, options) {
  return (0, _util.EasyRequest)(getGetFeatureInfoURLAtCoordinate(this, coordinate, map, { ...customParams,
    'INFO_FORMAT': 'application/json'
  })).then(data => (0, _util.parseFeatures)(data, options));
}

function getLegendGraphic(customParams) {
  const parameters = (0, _util.mergeParameters)({
    customParams,
    defaultParams: {
      VERSION: '1.0.0'
    },
    hardParams: {
      REQUEST: 'GetLegendGraphic',
      LAYER: (0, _util.getLayerName)(this),
      FORMAT: 'image/png'
    }
  }),
        targetURL = (0, _util.createURLWithParameters)((0, _util.getServiceURL)(this), parameters);
  return fetch(targetURL).then(response => {
    if (response.ok) return response.blob();
    throw new Error(response.statusText);
  }).then(blob => {
    const objectURL = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.src = objectURL;
    return img;
  });
}