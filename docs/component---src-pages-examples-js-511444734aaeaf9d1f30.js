(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{152:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(175),l=n(294),i=n(295),s=n(7),p=n.n(s),c=n(239),u=n.n(c),m=n(313),h=n(303),d=n(237),f=n(265),y=n(170),v=n(195),E=n.n(v);function g(){var e=E()(["\n    width: 100%;\n    height: 340px;\n"]);return g=function(){return e},e}var w=n(196).a.div(g()),b=n(292),L=n.n(b),C=function(e){function t(){return e.apply(this,arguments)||this}p()(t,e);var n=t.prototype;return n.componentDidMount=function(){L.a.highlightAll()},n.render=function(){var e=this.props.children;return r.a.createElement("pre",null,r.a.createElement("code",{className:"language-javascript"},e))},t}(a.Component),S=n(187),x=function(e){function t(t){var n;return(n=e.call(this,t)||this).map=null,n.mapElement=null,n}p()(t,e);var n=t.prototype;return n.componentDidMount=function(){this.map=new m.a({target:this.mapElement,layers:[new d.default({source:new f.a}),new u.a("tiger:poly_landmarks",{url:"http://gisteco.epsgrau.pe:8080/geoserver/wms"})],view:new h.a({center:Object(y.d)([-73.96168,40.78606]),zoom:11})})},n.render=function(){var e=this;return r.a.createElement("div",null,r.a.createElement("h5",{className:"my-3"},"GeoServer Layer"),r.a.createElement(w,{ref:function(t){return e.mapElement=t}}),r.a.createElement("p",{className:"mt-3"},"This example shows how to use ",r.a.createElement(S.a,null,"easyolmaps/layer/GeoserverLayer")," to add a Layer published by GeoServer WMS."),r.a.createElement(C,null,"import React, { Component } from 'react';\nimport GeoserverLayer from 'easyolmaps/layer/GeoserverLayer';\nimport MapContainer from '../components/MapContainer';\nimport { Map, View } from 'ol';\nimport TileLayer from 'ol/layer/Tile';\nimport OSM from 'ol/source/OSM';\nimport { fromLonLat } from 'ol/proj';\n\nclass GeoserverLayerExample extends Component {\n    constructor(props) {\n        super(props);\n        this.map = null;\n        this.mapElement = null;\n    }\n    componentDidMount() {\n        this.map = new Map({\n            target: this.mapElement,\n            layers: [\n                new TileLayer({ source: new OSM() }),\n                /* See how naturally integrates with Openlayers. Nice, isn't it? */\n                new GeoserverLayer('tiger:poly_landmarks', {\n                    url: 'http://gisteco.epsgrau.pe:8080/geoserver/wms'\n                })\n            ],\n            view: new View({\n                center: fromLonLat([-73.96168, 40.78606]),\n                zoom: 11\n            })\n        })\n    }\n    render() {\n        return <MapContainer ref={mapElement => this.mapElement = mapElement} />\n    }\n}"))},t}(a.Component),M=function(e){function t(t){var n;return(n=e.call(this,t)||this).handleInputChange=function(e){n.setState({filter:e.target.value})},n.handleApplyButtonClick=function(e){n.toppStates.filter(n.state.filter)},n.state={filter:"P_FEMALE > 0.51"},n.map=null,n.mapElement=null,n.toppStates=null,n}p()(t,e);var n=t.prototype;return n.componentDidMount=function(){this.toppStates=new u.a("topp:states",{url:"http://gisteco.epsgrau.pe:8080/geoserver/wms"}),this.map=new m.a({target:this.mapElement,layers:[new d.default({source:new f.a}),this.toppStates],view:new h.a({center:Object(y.d)([-102.04102,39.90234]),zoom:4})})},n.render=function(){var e=this,t=this.state.filter;return r.a.createElement("div",null,r.a.createElement("h5",{className:"my-3"},"GeoServer Layer filtering"),r.a.createElement(w,{ref:function(t){return e.mapElement=t}}),r.a.createElement("div",{className:"py-2"},r.a.createElement("input",{className:"mr-2",style:{width:"500px"},type:"text",placeholder:"Enter a valid ECQL expression here",value:t,onChange:this.handleInputChange}),r.a.createElement("button",{type:"button",onClick:this.handleApplyButtonClick},"Apply")),r.a.createElement("p",{className:"mt-3"},"This example shows how to apply a filter to a Layer published by GeoServer WMS."),r.a.createElement(C,null,"import React, { Component } from 'react';\nimport GeoserverLayer from 'easyolmaps/layer/GeoserverLayer';\nimport { Map, View } from 'ol';\nimport TileLayer from 'ol/layer/Tile';\nimport OSM from 'ol/source/OSM';\nimport { fromLonLat } from 'ol/proj';\nimport MapContainer from '../components/MapContainer';\n\nclass GeoserverLayerFilteringExample extends Component {\n    constructor(props) {\n        super(props);\n        this.state = { filter: 'P_FEMALE > 0.51' }\n        this.map = null;\n        this.mapElement = null;\n        this.toppStates = null;\n    }\n    handleInputChange = (e) => {\n        this.setState({ filter: e.target.value });\n    }\n    handleApplyButtonClick = (e) => {\n        /* No need of more than one line to apply a filter. Isn't that cool!? */\n        this.toppStates.filter(this.state.filter);\n    }\n    componentDidMount() {\n        this.toppStates = new GeoserverLayer('topp:states', {\n            url: 'http://gisteco.epsgrau.pe:8080/geoserver/wms'\n        });\n        this.map = new Map({\n            target: this.mapElement,\n            layers: [\n                new TileLayer({ source: new OSM() }),\n                this.toppStates\n            ],\n            view: new View({\n                center: fromLonLat([-102.04102, 39.90234]),\n                zoom: 4\n            })\n        })\n    }\n    render() {\n        const { filter } = this.state;\n        return <div>\n            <MapContainer ref={mapElement => this.mapElement = mapElement} />\n            <div className='py-2'>\n                <input\n                    className='mr-2'\n                    style={{ width: '500px' }}\n                    type='text'\n                    placeholder='Enter a valid ECQL expression here'\n                    value={filter}\n                    onChange={this.handleInputChange}\n                />\n                <button type='button' onClick={this.handleApplyButtonClick}>Apply</button>\n            </div>\n        </div>\n    }\n}"))},t}(a.Component);t.default=function(){return r.a.createElement(o.a,null,r.a.createElement(l.a,null,r.a.createElement(i.a,null,r.a.createElement("div",{className:"col"},r.a.createElement(x,null),r.a.createElement(M,null)))))}},165:function(e,t,n){var a;e.exports=(a=n(176))&&a.default||a},167:function(e,t,n){"use strict";n.r(t),n.d(t,"graphql",function(){return d}),n.d(t,"StaticQueryContext",function(){return m}),n.d(t,"StaticQuery",function(){return h});var a=n(0),r=n.n(a),o=n(4),l=n.n(o),i=n(154),s=n.n(i);n.d(t,"Link",function(){return s.a}),n.d(t,"withPrefix",function(){return i.withPrefix}),n.d(t,"navigate",function(){return i.navigate}),n.d(t,"push",function(){return i.push}),n.d(t,"replace",function(){return i.replace}),n.d(t,"navigateTo",function(){return i.navigateTo});var p=n(165),c=n.n(p);n.d(t,"PageRenderer",function(){return c.a});var u=n(33);n.d(t,"parsePath",function(){return u.a});var m=r.a.createContext({}),h=function(e){return r.a.createElement(m.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};function d(){throw new Error("It appears like Gatsby is misconfigured. Gatsby related `graphql` calls are supposed to only be evaluated at compile time, and then compiled away,. Unfortunately, something went wrong and the query was left in the compiled code.\n\n.Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.")}h.propTypes={data:l.a.object,query:l.a.string.isRequired,render:l.a.func,children:l.a.func}},171:function(e,t,n){e.exports={highlighted:"Highlighted-module--highlighted--2fzAw"}},175:function(e,t,n){"use strict";var a=n(0),r=n.n(a),o=n(278),l=n(279),i=n(280),s=n(167),p=function(e){var t=e.to,n=e.children;return r.a.createElement(s.Link,{to:t,className:"nav-link"},n)},c=function(e){var t=e.to,n=e.children;return r.a.createElement("a",{href:t,className:"nav-link"},n)},u=function(){return r.a.createElement(o.a,{color:"dark",dark:!0,expand:"lg",fixed:"top"},r.a.createElement(s.Link,{className:"navbar-brand mr-auto",to:"/",style:{color:"white",textDecoration:"none"}},"EasyOlMaps"),r.a.createElement("button",{className:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#defaultNavbar","aria-controls":"defaultNavbar","aria-expanded":"false"},r.a.createElement("span",{className:"navbar-toggler-icon"})),r.a.createElement("div",{className:"collapse navbar-collapse",id:"defaultNavbar"},r.a.createElement(l.a,{className:"ml-auto",navbar:!0},r.a.createElement(i.a,null,r.a.createElement(p,{to:"/examples"},"Examples")),r.a.createElement(i.a,null,r.a.createElement(p,{to:"/apidoc/layer/GeoserverLayer"},"API")),r.a.createElement(i.a,null,r.a.createElement(c,{to:"https://github.com/henryvanner/easyolmaps"},"Code")))))};t.a=function(e){var t=e.children;return r.a.createElement(r.a.Fragment,null,r.a.createElement(u,null),t)}},176:function(e,t,n){"use strict";n.r(t);n(32);var a=n(0),r=n.n(a),o=n(4),l=n.n(o),i=n(52),s=n(2),p=function(e){var t=e.location,n=s.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(i.a,Object.assign({location:t,pageResources:n},n.json))};p.propTypes={location:l.a.shape({pathname:l.a.string.isRequired}).isRequired},t.default=p},187:function(e,t,n){"use strict";var a=n(0),r=n.n(a),o=n(171);t.a=function(e){var t=e.children;return r.a.createElement("label",{className:o.highlighted},t)}}}]);
//# sourceMappingURL=component---src-pages-examples-js-511444734aaeaf9d1f30.js.map