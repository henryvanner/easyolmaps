//on every function this references an instance of EasyLayer
import { EasyRequest, parseFeatures } from '../util';

function getNativeOutputFormat(format) {
	var ft = '';

	switch (format) {
		case 'csv': ft = 'csv'; break;
		case 'json': ft = 'application/json'; break;
		case 'jsonp': ft = 'text/javascript'; break;
		case 'gml2': ft = 'GML2'; break;
		case 'gml3': ft = 'GML3'; break;
		case 'shapefile': ft = 'shape-zip'; break;
		case 'excel': ft = 'excel'; break;
		case 'excel2007': ft = 'excel2007'; break;
		case 'autocad': ft = 'dxf'; break;
	}

	return ft;
}

function getLayerWFSURL(ely) {
	return ely.getSource().getUrls()[0].replace(/wms/, 'wfs');
}

function inlineJSON(json) {
	let attrs = []
	for (let key in json) {
		if (json.hasOwnProperty(key)) {
			attrs.push(`${key}:${json[key]}`);
		}
	}
	return attrs.join(';');
}

function performDataExporting(url, parameters) {
	let targetURL = new URL(url);
	for (let key in parameters) {
		if (parameters.hasOwnProperty(key)) {
			targetURL.searchParams.append(key, parameters[key]);
		}
	}
	window.open(targetURL.toString(), "_blank");
}

export function countFeatures({ cql_filter, ...restOfGetFeatureParams } = {}) {
	const url = getLayerWFSURL(this),
		wmsParams = this.getSource().getParams();
	let conds = [];
	let parameters = {
		...restOfGetFeatureParams,
		request: 'GetFeature',
		resultType: 'hits',
		typeNames: wmsParams.LAYERS,
		version: '1.1.0'
	};

	if (this.getFilter()) { conds.push(this.getFilter()) };
	if (cql_filter) { conds.push(cql_filter) };
	if (conds.length) { parameters['cql_filter'] = conds.join(' AND ') };

	return EasyRequest(url, { parameters, dataType: 'xml' })
		.then(xmlDoc => {
			let nof = xmlDoc.querySelector('FeatureCollection').getAttribute("numberOfFeatures");
			return nof;
		});
};

export function getFeatures({ format = 'json', dxfSpecificOptions = {}, exportFeatures = false, ...getFeaturesParams }, featureProjection) {
	const url = getLayerWFSURL(this),
		wmsParams = this.getSource().getParams();
	let parameters = {
		...getFeaturesParams,
		version: '2.0.0',
		request: 'GetFeature',
		typeNames: wmsParams.LAYERS,
		outputFormat: getNativeOutputFormat(format)
	};

	dxfSpecificOptions.layers = dxfSpecificOptions.layers || wmsParams.LAYERS;
	dxfSpecificOptions && (parameters.format_options = inlineJSON(dxfSpecificOptions));

	if (exportFeatures) {
		return performDataExporting(url, parameters);
	}

	return EasyRequest(url, { parameters })
		.then(data => parseFeatures(data, featureProjection));
}

export function getAttributes() {
	const url = getLayerWFSURL(this),
		wmsParams = this.getSource().getParams();
	let parameters = {
		version: '2.0.0',
		request: 'DescribeFeatureType',
		typename: wmsParams.LAYERS,
		outputFormat: 'application/json'
	};
	return EasyRequest(url, { parameters });
}

export function exportFeatures(options = {}) {
	const opts = { exportFeatures: true, format: 'excel', ...options };
	return getFeatures.call(this, opts, null);
}