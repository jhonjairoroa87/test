define([
  'underscore',
  'backbone',
  'scripts/models/actor'
], function(_, Backbone , Actor){
  var ActorCollection = Backbone.Collection.extend({
	model: Actor
	, parse: function (response) {
		this.reset(response.results);
		//return response.results;    	
  	}});
  // Return the model for the module
  return ActorCollection;
});