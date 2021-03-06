define([
  'jquery', 'underscore', 'backbone',
  'models/ViewModel'
], function($,_, Backbone,ViewModel) {

  return ViewModel.extend({
    initialize : function(options){
      this.options = options || {};
      this.set('expanded',false)

    },
    getOutColorColumn:function(){
      return this.attributes.outColorColumn
    },
    getOutSourceColorColumn:function(){
      return this.attributes.outSourceColorColumn
    },
    getShowRecords:function(){
      return this.attributes.outShowRecords
    },
    getShowSources:function(){
      return this.attributes.outShowSources
    },
    setShowRecords:function(show){
      return this.set('outShowRecords', show)
    },
    setShowSources:function(show){
      return this.set('outShowSources', show)
    },
  });


});
