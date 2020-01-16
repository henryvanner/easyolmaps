"use strict";

require("core-js/modules/es.promise");

require("core-js/modules/es.string.replace");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EasyRequest = EasyRequest;
exports.parseFeatures = parseFeatures;
exports.getLayerName = getLayerName;
exports.getServiceURL = getServiceURL;
exports.mergeParameters = exports.createURLWithParameters = void 0;

var _GeoJSON = _interopRequireDefault(require("ol/format/GeoJSON"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createURLWithParameters = (url, parameters) => {
  const targetURL = new URL(url);

  for (let key in parameters) {
    if (parameters.hasOwnProperty(key)) {
      targetURL.searchParams.append(key, parameters[key]);
    }
  }

  return targetURL;
};

exports.createURLWithParameters = createURLWithParameters;

const mergeParameters = ({
  defaultParams,
  customParams,
  hardParams
}) => ({ ...defaultParams,
  ...customParams,
  ...hardParams
});

exports.mergeParameters = mergeParameters;

function EasyRequest(url, {
  dataType = 'json'
} = {}, requestOptions = {}) {
  return fetch(url, requestOptions).then(response => {
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

function parseFeatures(geoJson, options) {
  const fmt = new _GeoJSON.default();
  return fmt.readFeatures(geoJson, options);
}

function getLayerName(layer) {
  return layer.getSource().getParams().LAYERS;
}

function getServiceURL(layer, service = 'wms') {
  const baserURL = layer.getSource().getUrls()[0];
  return service === 'wms' ? baserURL : baserURL.replace(/wms/, service);
}