define([
  'underscore',
  'backbone',
  'scripts/models/movie'
], function(_, Backbone , Movie){
	var MovieCollection = Backbone.Collection.extend({
		model: Movie
		, parse: function (response) {
      if(this.type == "actor"){
        this.reset(response.cast);  
      }else{
        this.reset(response.results);
      }      
    }
  	
    , initialize: function() {
    		this.sort_key = 'release_date';
    		this.is_asc = false;
		}
		, comparator: function(a, b) {
    		// Assuming that the sort_key values can be compared with '>' and '<',
    		// modifying this to account for extra processing on the sort_key model
    		// attributes is fairly straight forward.
    		a = a.get(this.sort_key);
    		b = b.get(this.sort_key);

    		var returnValue = 0;
			if(this.is_asc == true){
				returnValue = a > b ?  1 : a < b ? -1 : 0;
			}else{
				returnValue = a > b ?  -1 : a < b ? 1 : 0;				
			}

    		return returnValue;
		}   
  	});  
  // Return the model for the module
  return MovieCollection;
});