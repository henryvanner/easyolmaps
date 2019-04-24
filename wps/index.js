"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.groupBy = groupBy;
exports.getBBOX = getBBOX;

var _util = require("../util");

var _Builder = require("./Builder");

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

function getLayerWPSURL(ely) {
  return ely.getSource().getUrls()[0].replace(/wms/, 'ows');
}

function groupBy({
  aggregationAttribute,
  aggregationFunctions,
  groupByAttributes
}) {
  const url = getLayerWPSURL(this),
        typename = this.getSource().getParams().LAYERS,
        workspace = typename.split(":")[0];
  const aggFncs = aggregationFunctions.map(fnc => new _Builder.WPSInput('function', new _Builder.WPSLiteralData(fnc)));
  const gpAttrs = groupByAttributes.map(attr => new _Builder.WPSInput('groupByAttributes', new _Builder.WPSLiteralData(attr)));
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
  }, [new _Builder.WPSInput('features', new _Builder.WPSInputReference({
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
  }))])])), new _Builder.WPSInput('filter', new _Builder.WPSComplexData({
    complexDataEncoding: {
      mimeType: 'text/plain; subtype=cql'
    }
  }, `<![CDATA[${this.getFilter() || '1=1'}]]>`))], new _Builder.WPSRawDataOutput('result', {
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

function getBBOX(map) {
  const url = getLayerWPSURL(this),
        typename = this.getSource().getParams().LAYERS,
        workspace = typename.split(":")[0];
  const filter = this.getFilter() || '1=1';
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
  }, [new _Builder.WPSInput('features', new _Builder.WPSInputReference({
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
  }))])])), new _Builder.WPSInput('attribute', new _Builder.WPSLiteralData('geom')), new _Builder.WPSInput('filter', new _Builder.WPSComplexData({
    complexDataEncoding: {
      mimeType: 'text/plain; subtype=cql'
    }
  }, `<![CDATA[${filter}]]>`))], new _Builder.WPSRawDataOutput('result', {
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
    const crs = xml.getElementsByTagName("ows:BoundingBox")[0].getAttribute("crs"),
          lc = xml.getElementsByTagName("ows:LowerCorner")[0].textContent.split(" "),
          uc = xml.getElementsByTagName("ows:UpperCorner")[0].textContent.split(" ");
    const extent = [parseFloat(lc[0]), parseFloat(lc[1]), parseFloat(uc[0]), parseFloat(uc[1])];
    return {
      extent,
      crs
    };
  });
}