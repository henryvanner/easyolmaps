"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggregate = aggregate;
exports.getBBOX = getBBOX;

var _util = require("../util");

var _Builder = require("./Builder");

var _proj = require("ol/proj");

const executeNSs = {
  "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
  "xmlns": "http://www.opengis.net/wps/1.0.0",
  "xmlns:wps": "http://www.opengis.net/wps/1.0.0",
  "xmlns:wfs": "http://www.opengis.net/wfs",
  "xmlns:ows": "http://www.opengis.net/ows/1.1",
  "xmlns:gml": "http://www.opengis.net/gml",
  "xmlns:ogc": "http://www.opengis.net/ogc",
  "xmlns:wcs": "http://www.opengis.net/wcs/1.1.1",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  "xsi:schemaLocation": "http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd"
};

function aggregate({
  cql_filter,
  aggregationAttribute,
  functions = [],
  groupByAttributes = []
}) {
  const url = (0, _util.getServiceURL)(this, 'ows'),
        typename = (0, _util.getLayerName)(this),
        workspace = typename.split(":")[0];
  const aggFncs = functions.map(fnc => new _Builder.WPSInput('function', new _Builder.WPSLiteralData(fnc)));
  const gpAttrs = groupByAttributes.map(attr => new _Builder.WPSInput('groupByAttributes', new _Builder.WPSLiteralData(attr)));
  let queryInputs = [new _Builder.WPSInput('features', new _Builder.WPSInputReference({
    complexDataEncoding: {
      "mimeType": "text/xml"
    },
    "xlink:href": "http://geoserver/wfs",
    "method": "POST"
  }, [new _Builder.XMLNode("wps:Body", {}, [new _Builder.WFSGetFeature({
    "service": "WFS",
    "version": "1.0.0",
    "outputFormat": "GML2",
    [`xmlns:${workspace}`]: `${workspace}`
  }, new _Builder.WFSQuery({
    "typeName": `${typename}`
  }))])]))];
  if (cql_filter) queryInputs = queryInputs.concat(new _Builder.WPSInput('filter', new _Builder.WPSComplexData({
    complexDataEncoding: {
      mimeType: 'text/plain; subtype=cql'
    }
  }, `<![CDATA[${cql_filter}]]>`)));
  const execute = new _Builder.WPSExecute("gs:Aggregate", {
    "version": "1.0.0",
    "service": "WPS",
    ...executeNSs
  }, [new _Builder.WPSInput('features', new _Builder.WPSInputReference({
    complexDataEncoding: {
      "mimeType": "text/xml"
    },
    "xlink:href": "http://geoserver/wps",
    "method": "POST"
  }, [new _Builder.XMLNode("wps:Body", {}, [new _Builder.WPSExecute('gs:Query', {
    "version": "1.0.0",
    "service": "WPS"
  }, queryInputs, new _Builder.WPSRawDataOutput('result', {
    complexDataEncoding: {
      mimeType: 'text/xml; subtype=wfs-collection/1.0'
    }
  }))])])), new _Builder.WPSInput('aggregationAttribute', new _Builder.WPSLiteralData(aggregationAttribute)), ...aggFncs, ...gpAttrs], new _Builder.WPSRawDataOutput('result', {
    complexDataEncoding: {
      mimeType: 'application/json'
    }
  }));
  return (0, _util.EasyRequest)(url, {}, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml;charset=utf-8'
    },
    body: execute.toString()
  });
}

function getBBOX({
  cql_filter,
  transform
}) {
  const url = (0, _util.getServiceURL)(this, 'ows'),
        typename = (0, _util.getLayerName)(this),
        workspace = typename.split(":")[0];
  let queryInputs = [new _Builder.WPSInput('features', new _Builder.WPSInputReference({
    complexDataEncoding: {
      "mimeType": "text/xml"
    },
    "xlink:href": "http://geoserver/wfs",
    "method": "POST"
  }, [new _Builder.XMLNode('wps:Body', {}, [new _Builder.WFSGetFeature({
    "service": "WFS",
    "version": "1.0.0",
    "outputFormat": "GML2",
    [`xmlns:${workspace}`]: `${workspace}`
  }, new _Builder.WFSQuery({
    "typeName": `${typename}`
  }))])])), new _Builder.WPSInput('attribute', new _Builder.WPSLiteralData('geom'))];
  if (cql_filter) queryInputs = queryInputs.concat(new _Builder.WPSInput('filter', new _Builder.WPSComplexData({
    complexDataEncoding: {
      mimeType: 'text/plain; subtype=cql'
    }
  }, `<![CDATA[${cql_filter}]]>`)));
  const execute = new _Builder.WPSExecute('gs:Bounds', {
    "version": "1.0.0",
    "service": "WPS",
    ...executeNSs
  }, [new _Builder.WPSInput('features', new _Builder.WPSInputReference({
    complexDataEncoding: {
      "mimeType": "text/xml"
    },
    "xlink:href": "http://geoserver/wps",
    "method": "POST"
  }, [new _Builder.XMLNode('wps:Body', {}, [new _Builder.WPSExecute('gs:Query', {
    "version": "1.0.0",
    "service": "WPS"
  }, queryInputs, new _Builder.WPSRawDataOutput('result', {
    complexDataEncoding: {
      mimeType: 'text/xml; subtype=wfs-collection/1.0'
    }
  }))])]))], new _Builder.WPSRawDataOutput('bounds'));
  return (0, _util.EasyRequest)(url, {
    dataType: 'xml'
  }, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml;charset=utf-8'
    },
    body: execute.toString()
  }).then(xml => {
    const lc = xml.getElementsByTagName("ows:LowerCorner")[0].textContent.split(" "),
          uc = xml.getElementsByTagName("ows:UpperCorner")[0].textContent.split(" ");
    const extent = [parseFloat(lc[0]), parseFloat(lc[1]), parseFloat(uc[0]), parseFloat(uc[1])];
    if (transform) return (0, _proj.transformExtent)(extent, transform.source, transform.destination);
  });
}