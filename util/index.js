"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EasyRequest = EasyRequest;
exports.parseFeatures = parseFeatures;
exports.getGeometryWKT = getGeometryWKT;

var _GeoJSON = _interopRequireDefault(require("ol/format/GeoJSON"));

var _WKT = _interopRequireDefault(require("ol/format/WKT"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EasyRequest(url, {
  parameters = {},
  dataType = 'json'
} = {}, requestOptions = {}) {
  // pre formating
  let targetURL = new URL(url);

  for (let key in parameters) {
    if (parameters.hasOwnProperty(key)) {
      targetURL.searchParams.append(key, parameters[key]);
    }
  }

  return fetch(targetURL.toString(), requestOptions).then(response => {
    if (dataType === 'json') {
      let res = response.clone();
      return response.json().then(json => json).catch(() => res.text().then(text => {
        const xml = parseXML(text),
              exception = xml.querySelector('ServiceException') || xml.querySelector('ExceptionText');
        if (exception) throw new Error(exception.textContent.trim());
      }));
    }

    if (dataType === 'xml') {
      return response.text().then(text => {
        const xml = parseXML(text),
              exception = xml.querySelector('ServiceException') || xml.querySelector('ExceptionText');
        if (exception) throw new Error(exception.textContent.trim());
        return xml;
      }).catch(error => {
        throw new Error(error);
      });
    }
  });
}

function parseXML(text) {
  const parser = new DOMParser();
  return parser.parseFromString(text, 'application/xml');
}

function parseFeatures(geoJson, featureProjection) {
  const dataProjection = geoJson.crs ? 'EPSG:' + geoJson.crs.properties.name.match(/EPSG::(\d+)/)[1] : null,
        fmt = new _GeoJSON.default({
    dataProjection,
    featureProjection
  });
  return fmt.readFeatures(geoJson);
}

function getGeometryWKT(geom, options) {
  const wktft = new _WKT.default();
  return wktft.writeGeometry(geom, options);
}