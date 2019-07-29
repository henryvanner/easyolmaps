import OlStyle from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import Text from 'ol/style/Text';
import Icon from 'ol/style/Icon';

/* tools */
function hex2rgb(hex) {
	let r = parseInt(hex.slice(1, 3), 16),
		g = parseInt(hex.slice(3, 5), 16),
		b = parseInt(hex.slice(5), 16);
	return [r, g, b];
}

const dashValues = {
	"dot": [2, 10],
	"dash": [10, 10],
	"dashdot": [10, 10, 2, 10],
	"longdash": [20, 10],
	"longdashdot": [20, 10, 2, 10],
	"solid": []
};
/* end tools */

function Style({
	/* fill related properties */
	fill,
	fillColor = '#ee9900',
	fillOpacity = 0.4,
	stroke,
	strokeColor = '#ee9900',
	strokeOpacity = 1,
	strokeWidth = 1,
	strokeLinecap = 'round',
	strokeDashStyle = 'solid',
	pointRadius,
	graphic,
	externalGraphic,
	graphicOpacity = 1,
	graphicScale,//ol3 parameter
	rotation,
	anchor = [0.5, 0.5],//ol3 parameter
	label,
	labelAlign = 'center',
	labelBaseline = 'middle',
	labelXOffset,
	labelYOffset,
	labelOutlineColor = '#ffffff',
	labelOutlineWidth = 3,
	labelOutlineOpacity = 1,
	font, //ol3 parameter
	fontColor = '#000000',
	fontOpacity = 1
}) {
	(() => {
		const fill1 = fill ? new Fill({
			color: hex2rgb(fillColor).concat(fillOpacity)
		}) : null;
		const stroke1 = stroke ? new Stroke({
			color: hex2rgb(strokeColor).concat(strokeOpacity),
			width: strokeWidth,
			lineCap: strokeLinecap,
			lineDash: strokeDashStyle ? dashValues[strokeDashStyle] : undefined
		}) : null;
		const image1 = pointRadius && !graphic ? new CircleStyle({
			radius: pointRadius,
			fill: fill1,
			stroke: stroke1
		}) : null;
		const icon = !pointRadius && (graphic && externalGraphic) ? new Icon({
			src: externalGraphic,
			opacity: graphicOpacity,
			rotation: rotation,
			anchor: anchor,
			scale: graphicScale
		}) : null;
		const text1 = label ? new Text({
			text: label,
			textAlign: labelAlign,
			textBaseline: labelBaseline,
			offsetX: labelXOffset,
			offsetY: labelYOffset,
			font,
			stroke: labelOutlineWidth ? new Stroke({
				color: hex2rgb(labelOutlineColor).concat(labelOutlineOpacity),
				width: labelOutlineWidth
			}) : null,
			fill: new Fill({
				color: hex2rgb(fontColor).concat(fontOpacity)
			})
		}) : null;

		OlStyle.call(this, {
			fill: fill1,
			stroke: stroke1,
			image: icon || image1,
			text: text1
		});
	})();
}

Style.prototype = Object.create(OlStyle.prototype);
Style.prototype.constructor = Style;

export default Style;