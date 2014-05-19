define([
	'jquery',
	'jqueryui',
  'underscore',
  'backbone'
], function($, jqueryui, _, Backbone){
   var ActorDetailView = Backbone.View.extend({   	
    imageSize : "w92"
    , imageURLRoot : null
    , noPhotoFileName: "nophoto92x138.jpg"

    , setImageURLRoot : function(url){
        this.imageURLRoot = url;
    }     

    , updateViewData: function(actorModel){    
        
        $("#actorname").text(actorModel.get("name"));
        $("#actorbiography").text(actorModel.get("biography"));
        $("#actorbirthday").text(actorModel.get("birthday"));
        $("#actorplace_of_birth").text(actorModel.get("place_of_birth"));
        $("#actorhomepage").text(actorModel.get("homepage"));

        var imageURL = "";
        var pasterPath = actorModel.get("profile_path");
          if(pasterPath != null){
              imageURL = this.imageURLRoot + this.imageSize + pasterPath;
          }else{
              imageURL = "assets/img/"+this.noPhotoFileName;
          }      

        $("#actorpicture").attr("src",imageURL);      
        
    }   

    , hide: function () {
        this.$el.hide();
    } 

    , show: function () {
        this.$el.show();
    }

  });
  // Our module now returns our view
  return ActorDetailView;
});

