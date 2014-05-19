define([
  'underscore',
  'backbone',
  'scripts/models/movie'
], function(_, Backbone , Movie){
	var MovieCollection = Backbone.Collection.extend({
		model: Movie
		, parse: function (response) {      
			 this.reset(response.results);	
  	}
  	
  	});  
  // Return the model for the module
  return MovieCollection;
});