import { EasyRequest, getLayerName } from "../util";

function getRESTURL(ely) {
    return ely.getSource().getUrls()[0].replace(/wms/, 'rest');
}

export function getDefinition() {
    const layername = getLayerName(this),
        restUrl = getRESTURL(this).concat(`/layers/${layername}.json`);

    return EasyRequest(restUrl);
}