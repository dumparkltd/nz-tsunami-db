define(["jquery","underscore","backbone","models/ViewModel"],function(t,e,i,n){return n.extend({initialize:function(t){this.options=t||{}},setActivePageId:function(t){this.set("pageId",t)},getActivePageId:function(){return this.attributes.pageId},setActivePage:function(t){this.set("page",t)},getActivePage:function(){return this.hasActivePage()?this.attributes.pages.findWhere({id:this.attributes.pageId}):null},hasActivePage:function(){return void 0!==this.attributes.pageId&&""!==this.attributes.pageId},getPageAnchor:function(){return this.attributes.anchor},setPageAnchor:function(t){this.set("anchor",t)}})});