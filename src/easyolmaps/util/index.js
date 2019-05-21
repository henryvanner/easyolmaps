import GeoJSON from 'ol/format/GeoJSON';
import WKT from 'ol/format/WKT';

export const createURLWithParameters = (url, parameters) => {
	const targetURL = new URL(url);
	for (let key in parameters) {
		if (parameters.hasOwnProperty(key)) {
			targetURL.searchParams.append(key, parameters[key]);
		}
	}
	return targetURL;
}

export function EasyRequest(url, { parameters = {}, dataType = 'json' } = {}, requestOptions = {}) {

	const targetURL = createURLWithParameters(url, parameters);

	return fetch(targetURL.toString(), requestOptions)
		.then(response => {
			console.log('response', response);
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

export function parseFeatures(geoJson, featureProjection) {
	const dataProjection = geoJson.crs ? 'EPSG:' + geoJson.crs.properties.name.match(/EPSG::(\d+)/)[1] : null,
		fmt = new GeoJSON({ dataProjection, featureProjection });
	return fmt.readFeatures(geoJson);
}

export function getGeometryWKT(geom, options) {
	const wktft = new WKT();
	return wktft.writeGeometry(geom, options);
}

export function getLayerName(ely) {
	return ely.getSource().getParams().LAYERS
}