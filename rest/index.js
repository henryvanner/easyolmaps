"use strict";

require("core-js/modules/es.string.replace");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefinition = getDefinition;

var _util = require("../util");

function getRESTURL(ely) {
  return ely.getSource().getUrls()[0].replace(/wms/, 'rest');
}

function getDefinition() {
  const layername = (0, _util.getLayerName)(this),
        restUrl = getRESTURL(this).concat(`/layers/${layername}.json`);
  return (0, _util.EasyRequest)(restUrl);
}