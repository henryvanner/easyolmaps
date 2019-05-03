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
/* end tools */

function Style({
	fill,
	fillColor = '#ee9900',
	fillOpacity = 0.4,
	stroke,
	strokeColor = '#ee9900',
	strokeOpacity = 1,
	strokeWidth = 1,
	strokeLinecap = 'round',
	strokeDashstyle = 'solid',
	graphic,
	pointRadius,
	externalGraphic,
	graphicOpacity = 1,
	rotation,
	anchor = [0.5, 0.5],//openlayers 3 parameter
	label,
	labelAlign = 'center',
	labelBaseline = 'middle',
	labelXOffset,
	labelYOffset,
	labelOutlineColor = '#ffffff',
	labelOutlineWidth = 3,
	labelOutlineOpacity = 1,
	fontColor = '#000000',
	fontOpacity = 1,
	fontFamily = 'sans-serif',
	fontSize = '11px',
	fontStyle = 'normal',
	fontWeight = 'normal'
}) {
	(() => {
		const dashValues = {
			"dot": [2, 10],
			"dash": [10, 10],
			"dashdot": [10, 10, 2, 10],
			"longdash": [20, 10],
			"longdashdot": [20, 10, 2, 10],
			"solid": []
		};

		const fill1 = fill ? new Fill({
			color: hex2rgb(fillColor).concat(fillOpacity)
		}) : null;
		const stroke1 = stroke ? new Stroke({
			color: hex2rgb(strokeColor).concat(strokeOpacity),
			width: strokeWidth,
			lineCap: strokeLinecap,
			lineDash: strokeDashstyle ? dashValues[strokeDashstyle] : undefined
		}) : null;
		const image1 = pointRadius ? new CircleStyle({
			radius: pointRadius,
			fill: fill1,
			stroke: stroke1
		}) : null;
		const icon = graphic && externalGraphic ? new Icon({
			src: externalGraphic,
			opacity: graphicOpacity,
			rotation: rotation,
			anchor: anchor
		}) : null;
		const text1 = label ? new Text({
			text: label,
			textAlign: labelAlign,
			textBaseline: labelBaseline,
			offsetX: labelXOffset,
			offsetY: labelYOffset,
			font: fontStyle + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily,
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