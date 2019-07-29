import { EasyRequest, getServiceURL, getLayerName } from '../util';
import {
    XMLNode,
    WPSInput,
    WPSLiteralData,
    WPSRawDataOutput,
    WPSComplexData,
    WFSGetFeature,
    WFSQuery,
    WPSInputReference,
    WPSExecute
} from './Builder';
import { transformExtent } from 'ol/proj';

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

export function aggregate({ cql_filter, aggregationAttribute, functions = [], groupByAttributes = [] }) {
    const url = getServiceURL(this, 'ows'),
        typename = getLayerName(this),
        workspace = typename.split(":")[0];

    const aggFncs = functions.map(fnc => new WPSInput('function', new WPSLiteralData(fnc)));
    const gpAttrs = groupByAttributes.map(attr => new WPSInput('groupByAttributes', new WPSLiteralData(attr)));

    let queryInputs = [
        new WPSInput('features', new WPSInputReference({
            complexDataEncoding: {
                "mimeType": "text/xml"
            },
            "xlink:href": "http://geoserver/wfs",
            "method": "POST"
        }, [
                new XMLNode("wps:Body", {}, [
                    new WFSGetFeature({
                        "service": "WFS",
                        "version": "1.0.0",
                        "outputFormat": "GML2",
                        [`xmlns:${workspace}`]: `${workspace}`
                    },
                        new WFSQuery({ "typeName": `${typename}` }))
                ])
            ]))
    ];

    if (cql_filter) queryInputs = queryInputs.concat(new WPSInput('filter', new WPSComplexData({ complexDataEncoding: { mimeType: 'text/plain; subtype=cql' } }, `<![CDATA[${cql_filter}]]>`)))

    const execute = new WPSExecute("gs:Aggregate", {
        "version": "1.0.0",
        "service": "WPS",
        ...executeNSs
    }, [
            new WPSInput('features', new WPSInputReference({
                complexDataEncoding: {
                    "mimeType": "text/xml"
                },
                "xlink:href": "http://geoserver/wps",
                "method": "POST"
            }, [
                    new XMLNode("wps:Body", {}, [
                        new WPSExecute('gs:Query', {
                            "version": "1.0.0",
                            "service": "WPS"
                        }, queryInputs,
                            new WPSRawDataOutput('result', { complexDataEncoding: { mimeType: 'text/xml; subtype=wfs-collection/1.0' } }))
                    ])
                ])),
            new WPSInput('aggregationAttribute', new WPSLiteralData(aggregationAttribute)),
            ...aggFncs,
            ...gpAttrs

        ],
        new WPSRawDataOutput('result', { complexDataEncoding: { mimeType: 'application/json' } }));
    return EasyRequest(url, {}, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml;charset=utf-8'
        },
        body: execute.toString()
    })
}

export function getBBOX({ cql_filter, transform }) {
    const url = getServiceURL(this, 'ows'),
        typename = getLayerName(this),
        workspace = typename.split(":")[0];

    let queryInputs = [
        new WPSInput('features', new WPSInputReference({
            complexDataEncoding: {
                "mimeType": "text/xml"
            },
            "xlink:href": "http://geoserver/wfs",
            "method": "POST"
        }, [
                new XMLNode('wps:Body', {}, [
                    new WFSGetFeature({
                        "service": "WFS",
                        "version": "1.0.0",
                        "outputFormat": "GML2",
                        [`xmlns:${workspace}`]: `${workspace}`
                    }, new WFSQuery({ "typeName": `${typename}` }))
                ])
            ])),
        new WPSInput('attribute', new WPSLiteralData('geom'))
    ];

    if (cql_filter) queryInputs = queryInputs.concat(new WPSInput('filter', new WPSComplexData({ complexDataEncoding: { mimeType: 'text/plain; subtype=cql' } }, `<![CDATA[${cql_filter}]]>`)))

    const execute = new WPSExecute('gs:Bounds', {
        "version": "1.0.0",
        "service": "WPS",
        ...executeNSs
    }, [
            new WPSInput('features', new WPSInputReference({
                complexDataEncoding: {
                    "mimeType": "text/xml"
                },
                "xlink:href": "http://geoserver/wps",
                "method": "POST"
            }, [
                    new XMLNode('wps:Body', {}, [
                        new WPSExecute('gs:Query', {
                            "version": "1.0.0",
                            "service": "WPS"
                        }, queryInputs,
                            new WPSRawDataOutput('result', { complexDataEncoding: { mimeType: 'text/xml; subtype=wfs-collection/1.0' } }))
                    ])
                ]))
        ],
        new WPSRawDataOutput('bounds'));

    return EasyRequest(url, { dataType: 'xml' }, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml;charset=utf-8'
        },
        body: execute.toString()
    })
        .then(xml => {
            const lc = (xml.getElementsByTagName("ows:LowerCorner")[0].textContent).split(" "),
                uc = (xml.getElementsByTagName("ows:UpperCorner")[0].textContent).split(" ");
            const extent = [parseFloat(lc[0]), parseFloat(lc[1]), parseFloat(uc[0]), parseFloat(uc[1])];
            if (transform) return transformExtent(extent, transform.source, transform.destination);
        });
}