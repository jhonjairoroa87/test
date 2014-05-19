define([
	'jquery',
	'jqueryui',
  'underscore',
  'backbone'
], function($, jqueryui, _, Backbone){
   var MovieDetailView = Backbone.View.extend({   	
    imageSize : "w92"
    , imageURLRoot : null
    , noPhotoFileName: "nophoto92x138.jpg"

    , setImageURLRoot : function(url){
        this.imageURLRoot = url;
    }     

    , updateViewData: function(movieModel){    
        
        $("#movietitle").text(movieModel.get("title"));
        $("#movierelease_date").text(movieModel.get("release_date"));
        $("#movieoverview").text(movieModel.get("overview"));        

        var imageURL = "";
        var pasterPath = movieModel.get("poster_path");
          if(pasterPath != null){
              imageURL = this.imageURLRoot + this.imageSize + pasterPath;
          }else{
              imageURL = "assets/img/"+this.noPhotoFileName;
          }      

        $("#moviepicture").attr("src",imageURL);      
        
    }

    , hide: function () {
        this.$el.hide();
    }

    , show: function () {
        this.$el.show();
    }
    
  });  
  return MovieDetailView;
});

