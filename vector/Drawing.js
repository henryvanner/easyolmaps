import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import { createBox } from 'ol/interaction/Draw';
import Collection from 'ol/Collection'

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

function Drawing(map, { shape, measure = false, ...DrawOptions }) {
	this.listeners = {};
	this.interactions = {};
	this.map = map;

	(() => {
		const { listeners, interactions, map } = this,
			settings = { ...interactionSettingsMap[shape], ...DrawOptions },
			di = interactions.drawinteraction = new Draw(settings);

		di.on("drawstart", drawEvt => {
			const { drawstart, drawing } = listeners,
				{ modifyInteraction } = interactions,
				sketch = drawEvt.feature,
				sketchGeom = sketch.getGeometry();

			map.removeInteraction(modifyInteraction);
			drawstart && drawstart.call(null, drawEvt);
			sketchGeom.on("change", evt => {
				drawing && drawing.call(null, evt);
			});
		});
		di.on("drawend", drawEvt => {
			const { drawend } = listeners;
			const features = new Collection([drawEvt.feature]);
			interactions.modifyInteraction = new Modify({ features });
			map.addInteraction(interactions.modifyInteraction);
			drawend && drawend.call(null, drawEvt);
		});
	})();
}

/* prototype functions */
const DrawingPrototype = Drawing.prototype;

DrawingPrototype.on = function (event, listener) {
	this.listeners[event] = listener;
	return this;
}
DrawingPrototype.start = function () {
	const { map } = this;
	const { drawinteraction } = this.interactions;
	map.addInteraction(drawinteraction);
}
DrawingPrototype.finish = function () {
	const { map } = this;
	const { drawinteraction, modifyInteraction } = this.interactions;
	drawinteraction.finishDrawing();
	map.removeInteraction(drawinteraction);
	map.removeInteraction(modifyInteraction);
}

export default Drawing;