"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.countFeatures = countFeatures;
exports.getFeatures = getFeatures;
exports.getFeatureTypeDescription = getFeatureTypeDescription;
exports.exportFeatures = exportFeatures;

var _util = require("../util");

//on every function this references an instance of EasyLayer
const buildRequestURL = (layer, parameters) => (0, _util.createURLWithParameters)((0, _util.getServiceURL)(layer, 'wfs'), parameters);

const getGenericGefFeatureRequest = (layer, {
  customParams,
  hardParams
}) => {
  const params = (0, _util.mergeParameters)({
    defaultParams: {
      version: '2.0.0'
    },
    customParams,
    hardParams: {
      request: 'GetFeature',
      typeNames: (0, _util.getLayerName)(layer),
      ...hardParams
    }
  });
  if (!params.cql_filter) delete params.cql_filter;
  if (!params.CQL_FILTER) delete params.CQL_FILTER;
  return buildRequestURL(layer, params);
};

function countFeatures(customParams) {
  const requestURL = getGenericGefFeatureRequest(this, {
    customParams,
    hardParams: {
      version: '1.1.0',
      resultType: 'hits'
    }
  });
  return (0, _util.EasyRequest)(requestURL, {
    dataType: 'xml'
  }).then(xmlDoc => xmlDoc.querySelector('FeatureCollection').getAttribute("numberOfFeatures"));
}

;

function getFeatures(customParams, options) {
  const requestURL = getGenericGefFeatureRequest(this, {
    customParams,
    hardParams: {
      outputFormat: 'application/json'
    }
  });
  return (0, _util.EasyRequest)(requestURL).then(data => (0, _util.parseFeatures)(data, options));
}

function getFeatureTypeDescription() {
  const parameters = {
    version: '2.0.0',
    request: 'DescribeFeatureType',
    typename: (0, _util.getLayerName)(this),
    outputFormat: 'application/json'
  };
  const url = buildRequestURL(this, parameters);
  return (0, _util.EasyRequest)(url);
}

function exportFeatures(customParams) {
  return getGenericGefFeatureRequest(this, {
    customParams
  });
}