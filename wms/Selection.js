import TileWMS from 'ol/source/TileWMS';

function WMSSelection (map,{include,exclude,source,multiple=true}){
	this.listeners = {};
	this.source = source;
	this.map = map;

	(()=>{
		let detectLayerFn = layerDetection.bind(null,include,exclude);

		this.listeners.singleclick = olMapBrowserEvt => {
			const ly = detectLayerFn(olMapBrowserEvt),
				{map,coordinate,pixel} = olMapBrowserEvt,
				{noselection,selection,unselection,request} = this.listeners;

			if (!ly) {
				return noselection && noselection.call(null,olMapBrowserEvt);
			};

			ly.getFeaturesAtCoordinate(coordinate,map)
			.then(fts=>{
				!multiple && source.clear();
				let ftx = multiple && this.map.forEachFeatureAtPixel(pixel,ft=>ft,{layerFilter:ly=>ly.getSource()===source});
				ftx ? ( source.removeFeature(ftx) || ( unselection && unselection.call(null,ftx,ly,olMapBrowserEvt) ) )
				: ( source.addFeatures(fts) || ( selection && selection.call(null,fts[0],ly,olMapBrowserEvt) ) );
			})
			.catch(err=>request && request({error:err}))
			.finally(()=>request && request({loading:false}));
			
			request && request({loading:true});
		};

	})();
}

const WMSSelectionPrototype = WMSSelection.prototype;

WMSSelectionPrototype.on = function (event,listener){
	this.listeners[event] = listener;
	return this;
}
WMSSelectionPrototype.start = function (){
	this.map.on('singleclick',this.listeners.singleclick);
}
WMSSelectionPrototype.finish = function (){
	this.map.un('singleclick',this.listeners.singleclick);
}

/* private functions */
function layerDetection (include,exclude,{map,pixel}){
	
	return map.forEachLayerAtPixel(pixel,ly=>ly,
	{
		layerFilter: ly=>{
			let isExcluded = exclude && exclude.indexOf(ly) !== -1,
				isIncluded = (!include && !exclude) || ( !isExcluded && ( !include || include.indexOf(ly) !== -1) );
			return ly.getSource() instanceof TileWMS && isIncluded;
		}
	});
}

export default WMSSelection;