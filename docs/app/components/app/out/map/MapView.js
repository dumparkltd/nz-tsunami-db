define(["jquery","underscore","backbone","leaflet","esri.leaflet","leaflet.rrose","leaflet.draw","./mapControl/MapControlView","./mapControl/MapControlModel","./mapPlot/mapPlotLat/MapPlotLatView","./mapPlot/MapPlotModel","text!./map.html","text!./mapPopupMultipeRecords.html","text!./drawActions.html","text!templates/triangleIcon.html"],function(e,t,o,i,s,l,r,a,n,d,u,h,c,p,g){return o.View.extend({events:{"click .layer-select":"layerSelect","mouseenter .layer-select":"layerMouseOver","mouseleave .layer-select":"layerMouseOut","click .toggle-option":"toggleOptionClick","click .nav-link":"handleNavLink"},initialize:function(){this.handleActive(),this.viewUpdating=!1,this.views=this.model.getViews(),this.render(),this.listenTo(this.model,"change:active",this.handleActive),this.listenTo(this.model,"change:view",this.handleViewUpdate),this.listenTo(this.model,"change:outShowRecords",this.handleViewUpdate),this.listenTo(this.model,"change:outShowSources",this.handleViewUpdate),this.listenTo(this.model,"change:outColorColumn",this.updateViews),this.listenTo(this.model,"change:outSourceColorColumn",this.updateViews),this.listenTo(this.model,"change:outPlotColumns",this.updateViews),this.listenTo(this.model,"change:outType",this.updateViews),this.listenTo(this.model,"change:invalidateSize",this.invalidateSize),this.listenTo(this.model,"change:popupLayers",this.popupLayersUpdated),this.listenTo(this.model,"change:selectedLayerId",this.selectedLayerUpdated),this.listenTo(this.model,"change:mouseOverLayerId",this.mouseOverLayerUpdated),this.listenTo(this.model,"change:recordsUpdated",this.recordsUpdated),this.listenTo(this.model,"change:sourcesUpdated",this.sourcesUpdated),this.listenTo(this.model,"change:geoQuery",this.updateGeoQuery),this.listenTo(this.model,"change:geoQuerySources",this.updateGeoQuerySources)},render:function(){return this.$el.html(t.template(h)({t:this.model.getLabels()})),this.configureMap(),this.updateViews(),this.initDraw(),this},initDraw:function(){var o=this.model.getMap(),i=this.model.getLabels();L.drawLocal.draw.handlers.rectangle.tooltip.start=i.out.map.draw.start,L.drawLocal.draw.handlers.simpleshape.tooltip.end=i.out.map.draw.end;var s=new L.Draw.Rectangle(o);L.Control.CustomDraw=L.Control.extend({options:{position:"topleft"},onAdd:function(e){var t=L.DomUtil.create("div","custom-draw-toolbar leaflet-bar");return L.DomEvent.addListener(t,"click",L.DomEvent.stopPropagation).addListener(t,"click",L.DomEvent.preventDefault),t}});var l=new L.Control.CustomDraw;o.addControl(l),this.$(".custom-draw-toolbar").html(t.template(p)({t:this.model.getLabels()}));var r=this;this.$(".toggle-draw-options").on("click",t.bind(function(e){this.toggleDrawOptions()},this)),this.$(".action-filter-records").on("click",function(e){r.model.set("drawActiveType","records"),s.enable()}),this.$(".action-filter-sources").on("click",function(e){r.model.set("drawActiveType","sources"),s.enable()}),this.$(".action-cancel-draw").on("click",function(e){s.disable(),r.toggleDrawOptions(!1)}),o.on("draw:created",t.bind(this.onDrawCreated,this)),L.Control.CustomDelete=L.Control.extend({options:{position:"topleft"},onAdd:function(){var o=L.DomUtil.create("div","leaflet-bar leaflet-control leaflet-control-delete"),s=L.DomUtil.create("a","",o);return e(s).attr("href","#"),e(s).attr("title",i.out.map.draw.clear),L.DomUtil.create("span","icon-icon_draw-reset",s),s.onclick=t.bind(r.queryDeleteClicked,r),o}}),this.model.set("queryDeleteControl",new L.Control.CustomDelete)},toggleDrawOptions:function(e){var t=this.$(".custom-draw-actions"),o=!t.hasClass("hide");void 0===e?o?t.addClass("hide"):t.removeClass("hide"):e?t.removeClass("hide"):t.addClass("hide")},initMapControlView:function(){this.$("#map-control").length>0&&(this.views.control=this.views.control||new a({el:this.$("#map-control"),model:new n({labels:this.model.getLabels(),columnCollection:this.model.get("columnCollection"),sourceColumnCollection:this.model.get("sourceColumnCollection"),outShowRecords:this.model.getShowRecords(),outShowSources:this.model.getShowSources(),active:!1})}))},initMapPlotLatView:function(){if(this.$("#map-plot-lat").length>0){var e=this.model.get("columnCollection").byAttribute("plot");this.views.plotLat=this.views.plotLat||new d({el:this.$("#map-plot-lat"),model:new u({labels:this.model.getLabels(),columnCollection:e,currentRecordCollection:[],mouseOverLayerId:"",selectedLayerId:"",active:!1,outPlotColumns:t.pluck(e.models,"id")})})}},updateMapPlotLatView:function(){if(this.views.plotLat.model.set({outPlotColumns:void 0!==this.model.getOutPlotColumns()?this.model.getOutPlotColumns():t.pluck(this.model.get("columnCollection").byAttribute("plot").models,"id")}),void 0!==this.model.getCurrentRecords()){var e=this.model.getMap().getBounds().getNorthEast(),o=this.model.getMap().getBounds().getSouthWest();this.views.plotLat.model.setCurrentRecords(this.model.getCurrentRecords().byBounds({north:e.lat,east:e.lng,south:o.lat,west:o.lng}).models)}},updateMapControlView:function(){this.views.control.model.set({outColorColumn:this.model.getOutColorColumn(),outSourceColorColumn:this.model.getOutSourceColorColumn(),outShowRecords:this.model.getShowRecords(),outShowSources:this.model.getShowSources()})},updateViews:function(){switch(this.$("#map-options button").removeClass("active"),this.$('#map-options [data-option="'+this.model.getOutType()+'"]').addClass("active"),this.model.getOutType()){case"control":this.$el.removeClass("full-width"),this.initMapControlView(),this.views.plotLat&&this.views.plotLat.model.setActive(!1),this.views.control.model.setActive(),this.updateMapControlView();break;case"plot-lat":this.$el.removeClass("full-width"),this.initMapPlotLatView(),this.views.control&&this.views.control.model.setActive(!1),this.views.plotLat.model.setActive(),this.updateMapPlotLatView();break;default:this.$el.addClass("full-width"),this.views.control&&this.views.control.model.setActive(!1),this.views.plotLat&&this.views.plotLat.model.setActive(!1)}this.invalidateSize(!0),this.toggleDrawOptions(!1)},configureMap:function(){var e=this.model.getConfig(),o=L.map(e.mapID,e.mapOptions).on("popupclose",t.bind(this.onPopupClose,this)).on("zoomstart",t.bind(this.onZoomStart,this)).on("movestart",t.bind(this.onMoveStart,this)).on("zoomend",t.bind(this.onZoomEnd,this)).on("moveend",t.bind(this.onMoveEnd,this)).on("resize",t.debounce(t.bind(this.resize,this),500)),i=L.control.attribution({position:"bottomright"}).setPrefix("").addAttribution(e.attribution);o.addControl(i),this.model.setMap(o),this.initLayerGroups(),this.model.mapConfigured(!0),this.$el.trigger("mapConfigured")},checkLayers:function(){var e=this.model.getMap();this.model.getLayerGroup("records")&&("1"==this.model.getShowRecords()?this.model.getLayerGroup("records").addTo(e):this.model.getLayerGroup("records").remove()),this.model.getLayerGroup("sources")&&("1"==this.model.getShowSources()?this.model.getLayerGroup("sources").addTo(e):this.model.getLayerGroup("sources").remove())},initLayerGroups:function(){var e=this.model.getMap(),o=this.model.getConfig(),i=new L.featureGroup;i.addTo(e);var s={query:i};t.each(o.layerGroups,function(t,o){var i=new L.layerGroup;s[o]=i,i.addTo(e)}),this.model.setLayerGroups(s),t.each(this.model.getLayers().models,function(e){e.setLayerGroup(this.model.getLayerGroup("default"))},this),t.each(o.layerGroups,function(e,o){"default"!==o&&t.each(this.model.getLayers().where(e),function(e){e.setLayerGroup(this.model.getLayerGroup(o)),"base"===o&&e.addToMap()},this)},this),this.checkLayers()},updateMapView:function(){var e=this.model.getView(),t=this.model.getMap();if(null!==e&&"string"==typeof e&&(e=this.model.getConfigView(e)),null!==e&&void 0!==e)if(void 0!==e.center&&void 0!==e.zoom&&void 0!==e.dimensions)if(this.model.mapConfigured()){var o=this.getZoomForDimensions(e);t.getZoom()===o&&this.roundDegrees(t.getCenter().lat)===e.center.lat&&this.roundDegrees(t.getCenter().lng)===e.center.lng||t.setView(e.center,o,{animate:!0})}else this.zoomToDefault();else void 0!==e.south&&void 0!==e.west&&void 0!==e.north&&void 0!==e.east?t.fitBounds([[e.south,e.west],[e.north,e.east]]):this.zoomToDefault();else this.zoomToDefault();this.checkLayers(),this.updateViews(),this.triggerMapViewUpdated()},zoomToDefault:function(){var e=this.model.getDefaultView();this.model.getMap().setView(e.center,this.getZoomForDimensions(e),{animate:!0})},recordsUpdated:function(){this.updateViews()},sourcesUpdated:function(){this.updateViews()},handleActive:function(){if(this.model.isActive()){this.$el.show();var e=this;waitFor(function(){return e.model.mapConfigured()},function(){e.invalidateSize(!1)})}else this.$el.hide()},handleViewUpdate:function(){var e=this;waitFor(function(){return e.model.mapConfigured()},function(){e.updateMapView()})},mouseOverLayerUpdated:function(){"plot-lat"===this.model.getOutType()&&this.views.plotLat&&this.views.plotLat.model.set("mouseOverRecordId",this.model.get("mouseOverLayerId"))},selectedLayerUpdated:function(){this.updatePopupContent(),"plot-lat"===this.model.getOutType()&&this.views.plotLat&&this.views.plotLat.model.set("selectedRecordId",this.model.get("selectedLayerId"))},popupLayersUpdated:function(){var e=this.model.get("popupLayers"),t=this.model.getMap();if(t.closePopup(),e.length>0){var o=e[0],i=new L.Rrose({offset:"source"===o.recordType?new L.Point(0,-12):new L.Point(0,-4),closeButton:!1,autoPan:!1}).setContent(this.getMultiplesPopupContent()).setLatLng(o.layer.getLayers()[0].getLatLng()).openOn(t);this.model.set("multipleTooltip",i)}},updatePopupContent:function(){void 0!==this.model.get("multipleTooltip")&&null!==this.model.get("multipleTooltip")&&this.model.get("multipleTooltip").setContent(this.getMultiplesPopupContent())},getMultiplesPopupContent:function(){var e=this.model.get("popupLayers"),o=e.length>20?e.length-20:0;return t.template(c)({layers:t.map(e.slice(0,20),function(e){var o=e.color.colorToRgb();return{label:e.label,color:e.color,fillColor:"rgba("+o[0]+","+o[1]+","+o[2]+",0.4)",id:e.id,selected:this.model.get("selectedLayerId")===e.id,mouseOver:this.model.get("mouseOverLayerId")===e.id,icon:"source"===e.recordType&&g&&t.template(g)({fill:e.color,color:e.color})}},this),noNotShowing:o})},updateGeoQuery:function(){var e=this.model.get("geoQuery"),t=this.model.get("queryLayer"),o=this.model.get("queryDeleteControl"),i=this.model.getLayerGroups().query,s=this.model.getMap();void 0!==t&&i.hasLayer(t)&&i.removeLayer(t),void 0!==o&&o.remove(),void 0!==e&&(void 0===e.north&&void 0===e.south&&void 0===e.west&&void 0===e.east||(t=L.rectangle(L.latLngBounds(L.latLng(void 0!==e.south?parseFloat(e.south):-90,void 0!==e.west?e.west<0?parseFloat(e.west)+360:parseFloat(e.west):0),L.latLng(void 0!==e.north?parseFloat(e.north):90,void 0!==e.east?e.east<0?parseFloat(e.east)+360:parseFloat(e.east):360)),this.model.getConfig().layerStyles.query),i.addLayer(t),t.bringToBack(),this.model.set("queryLayer",t),s.addControl(o)))},updateGeoQuerySources:function(){var e=this.model.get("geoQuerySources"),t=this.model.get("queryLayerSources"),o=this.model.get("queryDeleteControl"),i=this.model.getLayerGroups().query,s=this.model.getMap();void 0!==t&&i.hasLayer(t)&&i.removeLayer(t),void 0!==e&&(void 0===e.north&&void 0===e.south&&void 0===e.west&&void 0===e.east||(t=L.rectangle(L.latLngBounds(L.latLng(void 0!==e.south?parseFloat(e.south):-90,void 0!==e.west?e.west<0?parseFloat(e.west)+360:parseFloat(e.west):0),L.latLng(void 0!==e.north?parseFloat(e.north):90,void 0!==e.east?e.east<0?parseFloat(e.east)+360:parseFloat(e.east):360)),this.model.getConfig().layerStyles.querySources),i.addLayer(t),t.bringToBack(),this.model.set("queryLayerSources",t),s.addControl(o)))},resize:function(){this.updateMapView()},invalidateSize:function(e){e=void 0!==e&&e,void 0!==this.model.getMap()&&this.model.getMap().invalidateSize(e)},onPopupClose:function(e){this.model.set("multipleTooltip",null),this.$el.trigger("mapPopupClosed")},onZoomStart:function(e){this.zooming=!0},onMoveStart:function(e){this.moving=!0},onZoomEnd:function(e){this.zooming=!1,this.triggerMapViewUpdated()},onMoveEnd:function(e){this.moving=!1,this.triggerMapViewUpdated()},triggerMapViewUpdated:function(){var e=this.model.getMap();if(!this.viewUpdating){var o=this;this.viewUpdating=!0,waitFor(function(){return o.model.mapConfigured()&&null!==o.model.getView()},function(){o.viewUpdating=!1;var i=o.model.getView();void 0===i||i.zoom===e.getZoom()&&i.center.lat===o.roundDegrees(e.getCenter().lat)&&i.center.lng===o.roundDegrees(e.getCenter().lng)&&t.isEqual(i.dimensions,o.getDimensions())||o.$el.trigger("mapViewUpdated",{view:{zoom:e.getZoom(),center:{lat:o.roundDegrees(e.getCenter().lat),lng:o.roundDegrees(e.getCenter().lng)},dimensions:o.getDimensions()}})})}},queryDeleteClicked:function(e){e.preventDefault(),this.$el.trigger("geoQueryDelete"),this.$el.trigger("geoQuerySourcesDelete")},layerSelect:function(t){t.preventDefault(),this.$el.trigger("mapLayerSelect",{id:e(t.currentTarget).attr("data-layerid")})},layerMouseOver:function(t){t.preventDefault(),this.$el.trigger("mapLayerMouseOver",{id:e(t.currentTarget).attr("data-layerid")})},layerMouseOut:function(t){t.preventDefault(),this.$el.trigger("mapLayerMouseOut",{id:e(t.currentTarget).attr("data-layerid")})},toggleOptionClick:function(t){t.preventDefault(),this.$el.trigger("mapOptionToggled",{option:e(t.currentTarget).attr("data-option")})},toggleShowRecordsClick:function(t){t.preventDefault(),this.$el.trigger("mapShowRecordsToggled",{option:e(t.currentTarget).attr("data-option")})},toggleShowSourcesClick:function(t){t.preventDefault(),this.$el.trigger("mapShowSourcesToggled",{option:e(t.currentTarget).attr("data-option")})},onDrawStart:function(t){var o=this.model.getMap();o.closePopup(),e(o.getPane("popupPane")).hide()},onDrawCreated:function(t){var o=this.model.getMap(),i=this.model.get("drawActiveType");o.closePopup(),e(o.getPane("popupPane")).show(),this.$el.trigger("sources"===i?"geoQuerySourcesSubmit":"geoQuerySubmit",{geoQuery:{north:this.roundDegrees(t.layer.getBounds().getNorth()),south:this.roundDegrees(t.layer.getBounds().getSouth()),west:this.roundDegrees(t.layer.getBounds().getWest()),east:this.roundDegrees(t.layer.getBounds().getEast())}});var s=this.model.getLayerGroups().query;o.fitBounds(s.getBounds(),{padding:[20,20]})},handleNavLink:function(t){t.preventDefault(),t.stopPropagation();var o=e(t.target).data("id"),i=e(t.target).data("route"),s=e(t.target).data("type");this.$el.trigger("navLink",{target:t.target,id:o,route:i,type:s})},getDimensions:function(){return[this.$el.innerWidth(),this.$el.innerHeight()]},getZoomOffset:function(e){var t=this.getDimensions(),o=[e.dimensions[0],e.dimensions[1]],i=1,s=0,l=1;if(1===(i=t[0]/t[1]>o[0]/o[1]?t[1]/o[1]:t[0]/o[0]))return s;if(i>1)for(;1.9*l<i;)l*=2,s++;else for(var s=0,l=1;l>i;)l/=2,s--;return s},getZoomForDimensions:function(e){var t=this.model.getMap();return Math.max(Math.min(e.zoom+this.getZoomOffset(e),t.getMaxZoom()),t.getMinZoom())},setZoomClass:function(){this.$el.removeClass(function(e,t){return(t.match(/\bzoom-level-\S+/g)||[]).join(" ")}),this.$el.addClass("zoom-level-"+this.model.getZoom())},roundDegrees:function(e){return Math.round(1e4*e)/1e4}})});