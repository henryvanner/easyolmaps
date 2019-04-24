import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';
import { countFeatures, getFeatures, getAttributes, exportFeatures } from '../wfs';
import { getBBOX, groupBy } from '../wps';
import { refresh, filter, unfilter, getFilter, setStyle, getStyle, getFeaturesAtCoordinate } from '../wms';

function GeoserverLayer(lyName, { url, getMapParams = {}, crossOrigin, visible = true } = {}, tileLayerOptions) {
    (() => {
        let tlo = tileLayerOptions;
        if (!tlo) {
            getMapParams = { 'TILED': true, ...getMapParams, 'LAYERS': lyName };
            tlo = {
                visible,
                source: new TileWMS({
                    url,
                    serverType: "geoserver",
                    params: getMapParams,
                    crossOrigin
                })
            }
        };
        TileLayer.call(this, tlo);
    })();
};

GeoserverLayer.prototype = Object.create(TileLayer.prototype);
GeoserverLayer.prototype.constructor = GeoserverLayer;

/*static functions*/
GeoserverLayer.build = function (tileLayerOptions) {
    return new GeoserverLayer(null, null, tileLayerOptions);
}

/* prototype functions*/
const GeoserverLayerPrototype = GeoserverLayer.prototype;

GeoserverLayerPrototype.refresh = refresh;
GeoserverLayerPrototype.filter = filter;
GeoserverLayerPrototype.unfilter = unfilter;
GeoserverLayerPrototype.getFilter = getFilter;
GeoserverLayerPrototype.setStyle = setStyle;
GeoserverLayerPrototype.getStyle = getStyle;
GeoserverLayerPrototype.getFeatures = getFeatures;
GeoserverLayerPrototype.getFeaturesAtCoordinate = getFeaturesAtCoordinate;
GeoserverLayerPrototype.countFeatures = countFeatures;
GeoserverLayerPrototype.getAttributes = getAttributes;
GeoserverLayerPrototype.getBBOX = getBBOX;
GeoserverLayerPrototype.groupBy = groupBy;
GeoserverLayerPrototype.exportFeatures = exportFeatures;

export default GeoserverLayer;