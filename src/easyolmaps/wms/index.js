import {
    EasyRequest,
    parseFeatures,
    getLayerName,
    createURLWithParameters,
    getServiceURL,
    mergeParameters
} from '../util';

const getGetFeatureInfoURLAtCoordinate = (layer, coordinate, map, getFeatureInfoParams) => {
    const mapView = map.getView(),
        url = layer.getSource().getGetFeatureInfoUrl(coordinate, mapView.getResolution(), mapView.getProjection(), getFeatureInfoParams);
    return url;
}

export function refresh() {
    this.getSource().refresh();
}

export function filter(cql_filter) {
    if (cql_filter) { this.getSource().updateParams({ 'CQL_FILTER': cql_filter }); }
    else {
        delete this.getSource().getParams()['CQL_FILTER'];
        this.getSource().updateParams();
    };
}

export function getFilter() {
    const params = this.getSource().getParams();
    return params["CQL_FILTER"] || params['cql_filter'] || '';
}

export function setStyle(style) {
    this.getSource().updateParams({ 'STYLES': style });
}

export function getStyle() {
    return this.getSource().getParams()["STYLES"] || '';
}

export function getFeaturesAtCoordinate(coordinate, map, customParams, options) {
    return EasyRequest(getGetFeatureInfoURLAtCoordinate(this, coordinate, map, { ...customParams, 'INFO_FORMAT': 'application/json' }))
        .then(data => parseFeatures(data, options));
}

export function getLegendGraphic(customParams) {
    const parameters = mergeParameters({
        customParams,
        defaultParams: { VERSION: '1.0.0' },
        hardParams: { REQUEST: 'GetLegendGraphic', LAYER: getLayerName(this), FORMAT: 'image/png' }
    }),
        targetURL = createURLWithParameters(getServiceURL(this), parameters);
    return fetch(targetURL)
        .then(response => {
            if (response.ok) return response.blob();
            throw new Error(response.statusText);
        })
        .then(blob => {
            const objectURL = URL.createObjectURL(blob);
            const img = document.createElement('img');
            img.src = objectURL;
            return img;
        })
}