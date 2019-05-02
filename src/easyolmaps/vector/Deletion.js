import Select from 'ol/interaction/Select';
import DragBox from 'ol/interaction/DragBox';
import { platformModifierKeyOnly } from 'ol/events/condition.js';

/* private function */
function keyPressListener(evt) {
	if (evt.key === 'Delete') {
		if (this.beforeDeletion()) {
			this.deleteFeatures();
		}
	}
}

let boundKeyPressListener, dragBox;

function guessLayers() {
	let mapLayers = this.map.getLayers().getArray(),
		layers = this.layers || mapLayers;
	if (layers instanceof Array) return layers;

	let lys = [];
	for (let ly of mapLayers) {
		if (layers.call(null, ly)) {
			lys.push(ly);
		}
	}
	return lys;
}

/* end private functions */

function Deletion(map, SelectOptions = {}) {
	this.map = map;
	this.layers = SelectOptions.layers;
	this.beforeDeletion = SelectOptions.beforeDeletion || function () { return true };
	Select.call(this, SelectOptions);

	(() => {
		boundKeyPressListener = keyPressListener.bind(this);
		dragBox = new DragBox({ condition: platformModifierKeyOnly });
		dragBox.on('boxstart', () => {
			this.getFeatures().clear();
		});
		dragBox.on('boxend', () => {
			let layers = guessLayers.call(this),
				extent = dragBox.getGeometry().getExtent(),
				selectedFeatures = this.getFeatures(), s;
			for (let ly of layers) {
				s = ly.getSource();
				if (s.__proto__.hasOwnProperty("forEachFeatureIntersectingExtent")) {
					s.forEachFeatureIntersectingExtent(extent, ft => {
						selectedFeatures.push(ft)
					});
				}
			}
		});
	})();
}

Deletion.prototype = Object.create(Select.prototype);
Deletion.prototype.constructor = Deletion;

const DeletionPrototype = Deletion.prototype;

DeletionPrototype.start = function () {
	this.map.addInteraction(this);
	this.map.addInteraction(dragBox);
	document.addEventListener('keydown', boundKeyPressListener);
};
DeletionPrototype.finish = function () {
	this.map.removeInteraction(this);
	this.map.removeInteraction(dragBox);
	document.removeEventListener('keydown', boundKeyPressListener);
};
DeletionPrototype.deleteFeatures = function () {
	// determine layers
	let layers = guessLayers.call(this),
		features = this.getFeatures();
	for (let ft of features.getArray()) {
		for (let ly of layers) {
			let s = ly.getSource();
			if (s.__proto__.hasOwnProperty("removeFeature")) {
				try { s.removeFeature(ft); } catch (err) { }
			}
		}
	}
	features.clear();
};

export default Deletion;