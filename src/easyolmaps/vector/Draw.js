import OlDraw from 'ol/interaction/Draw';
import Snap from 'ol/interaction/Snap';
import { createBox } from 'ol/interaction/Draw';

const interactionSettingsMap = {
    "Point": { type: ("Point") },
    "Polygon": { type: ("Polygon") },
    "Line": { type: ("LineString") },
    "Section": { type: ("LineString"), maxPoints: 2 },
    "Box": {
        type: ("Circle"),
        geometryFunction: createBox()
    },
    "Circle": { type: ("Circle") }
};

function Draw({ shape, source, snapping = false, ...otherDrawInteractionOptions }, snapOptions) {
    (() => {
        const drawOptions = { ...interactionSettingsMap[shape], source, ...otherDrawInteractionOptions };
        OlDraw.call(this, drawOptions);
        if (snapping) {
            const finalSnapOptions = { source, ...snapOptions };
            this.set('snap', new Snap(finalSnapOptions));
        }
    })();
}

Draw.prototype = Object.create(OlDraw.prototype);
Draw.prototype.constructor = Draw;

const DrawPrototype = Draw.prototype;

DrawPrototype.start = function (map) {
    const snap = this.get('snap');
    map.addInteraction(this);
    if (snap) map.addInteraction(this.get('snap'));
}

DrawPrototype.finish = function () {
    const map = this.getMap(), snap = this.get('snap');
    map.removeInteraction(this);
    if (snap) map.removeInteraction(snap);
}

export default Draw;