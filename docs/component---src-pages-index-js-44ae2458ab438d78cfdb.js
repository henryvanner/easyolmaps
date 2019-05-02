(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{150:function(e,a,t){"use strict";t.r(a);var n=t(0),l=t.n(n),r=t(175),o=t(294),i=t(295),s=t(314),c=t(308),u=t(309),m=t(310),d=t(311),y=t(312),E=function(e){var a=e.children;return l.a.createElement("span",{className:"eolm-feature-title"},a)};a.default=function(){return l.a.createElement(r.a,null,l.a.createElement(o.a,null,l.a.createElement(i.a,null,l.a.createElement("div",{className:"col"},l.a.createElement("h3",{className:"text-right mt-2"},"A handy library for an easy use of openlayers."),l.a.createElement("h4",null,"Motivation"),l.a.createElement("p",null,"Openlayers is awesome, very flexible and customizable, but some of its functionalities are not straightforward. So, we wanted to make it easy, have a library that allows you to use some openlayers functionality out of the box and that easily integrates with native openlayers-based code. Also, we added some functionality that leverages the WMS, WFS and WPS Standards capabilities."),l.a.createElement(s.a,{color:"info"},l.a.createElement("strong",null,"Note:")," WMS, WFS and WPS related functionality was built and tested on ",l.a.createElement("strong",null,"GeoServer")," implementations, so it is intended to be used along with it."),l.a.createElement("h4",null,"Features"),l.a.createElement(c.a,null,l.a.createElement(u.a,null,l.a.createElement(m.a,null,l.a.createElement(d.a,null,l.a.createElement(E,null,"OGC Standards-based Tiled Layers")),l.a.createElement(y.a,null,"Get a WMS-based tiled layer that you can easily add to your map, and take advantage of functionality built on WMS, WFS and WPS capabilities."))),l.a.createElement(u.a,null,l.a.createElement(m.a,null,l.a.createElement(d.a,null,l.a.createElement(E,null,"Easy styling")),l.a.createElement(y.a,null,"Style your features in an easy way, just with a single set of properties.")))),l.a.createElement(c.a,{className:"my-4"},l.a.createElement(u.a,null,l.a.createElement(m.a,null,l.a.createElement(d.a,null,l.a.createElement(E,null,"Easy drawing")),l.a.createElement(y.a,null,"Get drawing quickly, just specify what you want to draw and where, give some easy styling and start drawing!"))),l.a.createElement(u.a,null,l.a.createElement(m.a,null,l.a.createElement(d.a,null,l.a.createElement(E,null,"Easy Integration")),l.a.createElement(y.a,null,"Don't worry about integration. Easyolmaps naturally integrates with existing openlayers-based code.")))),l.a.createElement("h4",null,"Get Involved"),l.a.createElement(c.a,null,l.a.createElement(u.a,{style:{maxWidth:"320px"}},l.a.createElement("a",{href:"https://github.com/henryvanner/easyolmaps/issues",className:"card-body eolm-card-link p-2 m-0"},l.a.createElement("h4",{className:"m-0"},l.a.createElement("i",{className:"fas fa-bug mr-2"}),"Report an issue"))))))))}},165:function(e,a,t){var n;e.exports=(n=t(176))&&n.default||n},167:function(e,a,t){"use strict";t.r(a),t.d(a,"graphql",function(){return E}),t.d(a,"StaticQueryContext",function(){return d}),t.d(a,"StaticQuery",function(){return y});var n=t(0),l=t.n(n),r=t(4),o=t.n(r),i=t(154),s=t.n(i);t.d(a,"Link",function(){return s.a}),t.d(a,"withPrefix",function(){return i.withPrefix}),t.d(a,"navigate",function(){return i.navigate}),t.d(a,"push",function(){return i.push}),t.d(a,"replace",function(){return i.replace}),t.d(a,"navigateTo",function(){return i.navigateTo});var c=t(165),u=t.n(c);t.d(a,"PageRenderer",function(){return u.a});var m=t(33);t.d(a,"parsePath",function(){return m.a});var d=l.a.createContext({}),y=function(e){return l.a.createElement(d.Consumer,null,function(a){return e.data||a[e.query]&&a[e.query].data?(e.render||e.children)(e.data?e.data.data:a[e.query].data):l.a.createElement("div",null,"Loading (StaticQuery)")})};function E(){throw new Error("It appears like Gatsby is misconfigured. Gatsby related `graphql` calls are supposed to only be evaluated at compile time, and then compiled away,. Unfortunately, something went wrong and the query was left in the compiled code.\n\n.Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.")}y.propTypes={data:o.a.object,query:o.a.string.isRequired,render:o.a.func,children:o.a.func}},175:function(e,a,t){"use strict";var n=t(0),l=t.n(n),r=t(278),o=t(279),i=t(280),s=t(167),c=function(e){var a=e.to,t=e.children;return l.a.createElement(s.Link,{to:a,className:"nav-link"},t)},u=function(e){var a=e.to,t=e.children;return l.a.createElement("a",{href:a,className:"nav-link"},t)},m=function(){return l.a.createElement(r.a,{color:"dark",dark:!0,expand:"lg",fixed:"top"},l.a.createElement(s.Link,{className:"navbar-brand mr-auto",to:"/",style:{color:"white",textDecoration:"none"}},"EasyOlMaps"),l.a.createElement("button",{className:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#defaultNavbar","aria-controls":"defaultNavbar","aria-expanded":"false"},l.a.createElement("span",{className:"navbar-toggler-icon"})),l.a.createElement("div",{className:"collapse navbar-collapse",id:"defaultNavbar"},l.a.createElement(o.a,{className:"ml-auto",navbar:!0},l.a.createElement(i.a,null,l.a.createElement(c,{to:"/examples"},"Examples")),l.a.createElement(i.a,null,l.a.createElement(c,{to:"/apidoc/layer/GeoserverLayer"},"API")),l.a.createElement(i.a,null,l.a.createElement(u,{to:"https://github.com/henryvanner/easyolmaps"},"Code")))))};a.a=function(e){var a=e.children;return l.a.createElement(l.a.Fragment,null,l.a.createElement(m,null),a)}},176:function(e,a,t){"use strict";t.r(a);t(32);var n=t(0),l=t.n(n),r=t(4),o=t.n(r),i=t(52),s=t(2),c=function(e){var a=e.location,t=s.default.getResourcesForPathnameSync(a.pathname);return l.a.createElement(i.a,Object.assign({location:a,pageResources:t},t.json))};c.propTypes={location:o.a.shape({pathname:o.a.string.isRequired}).isRequired},a.default=c}}]);
//# sourceMappingURL=component---src-pages-index-js-44ae2458ab438d78cfdb.js.map