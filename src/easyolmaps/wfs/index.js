//on every function this references an instance of EasyLayer
import {
	EasyRequest,
	parseFeatures,
	createURLWithParameters,
	getLayerName,
	getServiceURL,
	mergeParameters
} from '../util';

const buildRequestURL = (layer, parameters) => createURLWithParameters(getServiceURL(layer, 'wfs'), parameters)

const getGenericGefFeatureRequest = (layer, { customParams, hardParams }) => {
	const params = mergeParameters({
		defaultParams: { version: '2.0.0' },
		customParams,
		hardParams: { request: 'GetFeature', typeNames: getLayerName(layer), ...hardParams }
	});

	if (!params.cql_filter) delete params.cql_filter;
	if (!params.CQL_FILTER) delete params.CQL_FILTER;

	return buildRequestURL(layer, params);
}

export function countFeatures(customParams) {

	const requestURL = getGenericGefFeatureRequest(this, {
		customParams,
		hardParams: { version: '1.1.0', resultType: 'hits' }
	});

	return EasyRequest(requestURL, { dataType: 'xml' })
		.then(xmlDoc => xmlDoc.querySelector('FeatureCollection').getAttribute("numberOfFeatures"));
};

export function getFeatures(customParams, options) {
	const requestURL = getGenericGefFeatureRequest(this, {
		customParams,
		hardParams: { outputFormat: 'application/json' }
	});

	return EasyRequest(requestURL)
		.then(data => parseFeatures(data, options));
}

export function getFeatureTypeDescription() {
	const parameters = {
		version: '2.0.0',
		request: 'DescribeFeatureType',
		typename: getLayerName(this),
		outputFormat: 'application/json'
	};
	const url = buildRequestURL(this, parameters)
	return EasyRequest(url);
}

export function exportFeatures(customParams) {
	return getGenericGefFeatureRequest(this, { customParams });
}