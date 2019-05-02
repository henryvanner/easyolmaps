import Draw from 'ol/interaction/Draw';
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

function Drawing(map, { shape, source, ...otherDrawInteractionOptions }) {
	this.listeners = {};
	this.interactions = {};
	this.map = map;
	this.source = source;

	(() => {
		const { listeners, interactions } = this,
			drawInitOptions = { ...interactionSettingsMap[shape], source, ...otherDrawInteractionOptions },
			di = interactions.drawInteraction = new Draw(drawInitOptions);

		di.on("drawstart", drawEvt => {
			const { drawstart, drawing } = listeners,
				sketch = drawEvt.feature,
				sketchGeom = sketch.getGeometry();

			sketchGeom.on("change", evt => {
				drawing && drawing.call(null, evt);
			});
			drawstart && drawstart.call(null, drawEvt);
		});
		di.on("drawend", drawEvt => {
			const { drawend } = listeners;
			drawend && drawend.call(null, drawEvt);
		});
	})();
}

const DrawingPrototype = Drawing.prototype;

DrawingPrototype.on = function (event, listener) {
	this.listeners[event] = listener;
	return this;
}
DrawingPrototype.start = function () {
	const { map, source, interactions } = this;
	interactions.snapInteraction = new Snap({ source });
	map.addInteraction(interactions.drawInteraction);
	map.addInteraction(interactions.snapInteraction);
}
DrawingPrototype.finish = function () {
	const { map } = this;
	const { drawInteraction, snapInteraction } = this.interactions;
	drawInteraction.finishDrawing();
	map.removeInteraction(drawInteraction);
	map.removeInteraction(snapInteraction);
}

export default Drawing;