import { EasyRequest, parseFeatures } from '../util';

function getGetFeatureInfoURLAtCoordinate(ely, coordinate, map) {
    let mapView = map.getView(),
        getFeatureInfoParams = {};
    if (ely.getFilter()) {
        getFeatureInfoParams['CQL_FILTER'] = ely.getFilter();
    }

    let url = ely.getSource().getGetFeatureInfoUrl(coordinate, mapView.getResolution(), mapView.getProjection(), getFeatureInfoParams);
    return url;
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