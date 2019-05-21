import { EasyRequest, parseFeatures, getLayerName, createURLWithParameters } from '../util';

function getGetFeatureInfoURLAtCoordinate(ely, coordinate, map) {
    let mapView = map.getView(),
        getFeatureInfoParams = {};
    if (ely.getFilter()) {
        getFeatureInfoParams['CQL_FILTER'] = ely.getFilter();
    }

    let url = ely.getSource().getGetFeatureInfoUrl(coordinate, mapView.getResolution(), mapView.getProjection(), getFeatureInfoParams);
    return url;
}

function getWMSURL(ely) {
    return ely.getSource().getUrls()[0]
}

export function refresh() {
    this.getSource().refresh();
}

export function filter(cql_filter) {
    if (cql_filter) { this.getSource().updateParams({ 'CQL_FILTER': cql_filter }); }
    else { this.unfilter() };
}

export function unfilter() {
    delete this.getSource().getParams()['CQL_FILTER'];
    this.getSource().updateParams();
}

export function getFilter() {
    return this.getSource().getParams()["CQL_FILTER"] || '';
}

export function setStyle(style) {
    this.getSource().updateParams({ 'STYLES': style });
}

export function getStyle() {
    return this.getSource().getParams()["STYLES"] || '';
}

export function getFeaturesAtCoordinate(coordinate, map) {
    return EasyRequest(getGetFeatureInfoURLAtCoordinate(this, coordinate, map), { parameters: { 'INFO_FORMAT': 'application/json' } })
        .then(data => parseFeatures(data, map.getView().getProjection().getCode()));
}

export function getLegendGraphic({ legendOptions = {}, ...restGetLegendGraphicParams } = {}) {
    const fixedParams = { REQUEST: 'GetLegendGraphic', LAYER: getLayerName(this) },
        defaultOptions = { VERSION: '1.0.0', FORMAT: 'image/png' }
    const LEGEND_OPTIONS = Object.entries(legendOptions).map(e => e.join(':')).join(';');
    const parameters = {
        ...defaultOptions,
        ...restGetLegendGraphicParams,
        LEGEND_OPTIONS,
        ...fixedParams
    };
    const targetURL = createURLWithParameters(getWMSURL(this), parameters);
    return fetch(targetURL.toString())
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