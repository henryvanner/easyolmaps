import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';
import { countFeatures, getFeatures, getFeatureTypeDescription, exportFeatures } from '../wfs';
import { getBBOX, aggregate } from '../wps';
import { refresh, filter, getFilter, setStyle, getStyle, getFeaturesAtCoordinate, getLegendGraphic } from '../wms';
import { getDefinition } from '../rest';

function GeoserverLayer(lyName, { url, params = {}, crossOrigin, visible = true } = {}, tileLayerOptions) {
    (() => {
        let tlo = tileLayerOptions;
        if (!tlo) {
            params = { 'TILED': true, ...params, 'LAYERS': lyName };
            tlo = {
                visible,
                source: new TileWMS({
                    url,
                    serverType: "geoserver",
                    params,
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
GeoserverLayerPrototype.getFilter = getFilter;
GeoserverLayerPrototype.setStyle = setStyle;
GeoserverLayerPrototype.getStyle = getStyle;
GeoserverLayerPrototype.getFeatures = getFeatures;
GeoserverLayerPrototype.getFeaturesAtCoordinate = getFeaturesAtCoordinate;
GeoserverLayerPrototype.countFeatures = countFeatures;
GeoserverLayerPrototype.getFeatureTypeDescription = getFeatureTypeDescription;
GeoserverLayerPrototype.getBBOX = getBBOX;
GeoserverLayerPrototype.aggregate = aggregate;
GeoserverLayerPrototype.exportFeatures = exportFeatures;
GeoserverLayerPrototype.getDefinition = getDefinition;
GeoserverLayerPrototype.getLegendGraphic = getLegendGraphic;

export default GeoserverLayer;