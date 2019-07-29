import GeoJSON from 'ol/format/GeoJSON';

export const createURLWithParameters = (url, parameters) => {
	const targetURL = new URL(url);
	for (let key in parameters) {
		if (parameters.hasOwnProperty(key)) {
			targetURL.searchParams.append(key, parameters[key]);
		}
	}
	return targetURL;
}

export const mergeParameters = ({ defaultParams, customParams, hardParams }) => ({ ...defaultParams, ...customParams, ...hardParams });

export function EasyRequest(url, { dataType = 'json' } = {}, requestOptions = {}) {

	return fetch(url, requestOptions)
		.then(response => {
			if (dataType === 'json') {
				let res = response.clone();
				return response.json()
					.then(json => json)
					.catch(() => res.text().then(text => {
						const xml = parseXML(text),
							exception = xml.querySelector('ServiceException') || xml.querySelector('ExceptionText');
						if (exception) throw new Error(exception.textContent.trim());
					}));
			}
			if (dataType === 'xml') {
				return response.text()
					.then(text => {
						const xml = parseXML(text),
							exception = xml.querySelector('ServiceException') || xml.querySelector('ExceptionText');
						if (exception) throw new Error(exception.textContent.trim());
						return xml;
					}).catch(error => { throw new Error(error); });
			}
		});
}

function parseXML(text) {
	const parser = new DOMParser();
	return parser.parseFromString(text, 'application/xml');
}

export function parseFeatures(geoJson, options) {
	const fmt = new GeoJSON();
	return fmt.readFeatures(geoJson, options);
}

export function getLayerName(layer) {
	return layer.getSource().getParams().LAYERS
}

export function getServiceURL(layer, service = 'wms') {
	const baserURL = layer.getSource().getUrls()[0];
	return service === 'wms' ? baserURL : baserURL.replace(/wms/, service);
}