"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refresh = refresh;
exports.filter = filter;
exports.unfilter = unfilter;
exports.getFilter = getFilter;
exports.setStyle = setStyle;
exports.getStyle = getStyle;
exports.getFeaturesAtCoordinate = getFeaturesAtCoordinate;
exports.getLegendGraphic = getLegendGraphic;

require("core-js/modules/web.dom.iterable");

var _util = require("../util");

function getGetFeatureInfoURLAtCoordinate(ely, coordinate, map) {
  let mapView = map.getView(),
      getFeatureInfoParams = {};

  if (ely.getFilter()) {
    getFeatureInfoParams['CQL_FILTER'] = ely.getFilter();
  }

  let url = ely.getSource().getGetFeatureInfoUrl(coordinate, mapView.getResolution(), mapView.getProjection(), getFeatureInfoParams);
  return url;
}

function getWMSURL(ely) {
  return ely.getSource().getUrls()[0];
}

function refresh() {
  this.getSource().refresh();
}

function filter(cql_filter) {
  if (cql_filter) {
    this.getSource().updateParams({
      'CQL_FILTER': cql_filter
    });
  } else {
    this.unfilter();
  }

  ;
}

function unfilter() {
  delete this.getSource().getParams()['CQL_FILTER'];
  this.getSource().updateParams();
}

function getFilter() {
  return this.getSource().getParams()["CQL_FILTER"] || '';
}

function setStyle(style) {
  this.getSource().updateParams({
    'STYLES': style
  });
}

function getStyle() {
  return this.getSource().getParams()["STYLES"] || '';
}

function getFeaturesAtCoordinate(coordinate, map) {
  return (0, _util.EasyRequest)(getGetFeatureInfoURLAtCoordinate(this, coordinate, map), {
    parameters: {
      'INFO_FORMAT': 'application/json'
    }
  }).then(data => (0, _util.parseFeatures)(data, map.getView().getProjection().getCode()));
}

function getLegendGraphic({
  legendOptions = {},
  ...restGetLegendGraphicParams
} = {}) {
  const fixedParams = {
    REQUEST: 'GetLegendGraphic',
    LAYER: (0, _util.getLayerName)(this)
  },
        defaultOptions = {
    VERSION: '1.0.0',
    FORMAT: 'image/png'
  };
  const LEGEND_OPTIONS = Object.entries(legendOptions).map(e => e.join(':')).join(';');
  const parameters = { ...defaultOptions,
    ...restGetLegendGraphicParams,
    LEGEND_OPTIONS,
    ...fixedParams
  };
  const targetURL = (0, _util.createURLWithParameters)(getWMSURL(this), parameters);
  return fetch(targetURL.toString()).then(response => {
    if (response.ok) return response.blob();
    throw new Error(response.statusText);
  }).then(blob => {
    const objectURL = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.src = objectURL;
    return img;
  });
}