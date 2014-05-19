define([
	'jquery',
	'jqueryui',
  'underscore',
  'backbone',
  'text!templates/moviecard.html'
], function($, jqueryui, _, Backbone, ProjectListTemplate){
   var ListItemView = Backbone.View.extend({   	
    tagName: 'li'
    , imageSize : null
    , imageURLRoot : null
    , noPhotoFileName: null
    , onClickedView : null
    , onMouseOverView : null
    , events: {
        'click' : 'clickedView'
        , 'mouseover' : 'mouseOverView'
        //'keyup #queryinput': 'queryInputKeyUp'
    }
     , initialize: function (options) {
        _.bindAll(this
            , 'parseModel'            
        );
        this.imageSize = options.imageSize;
        this.imageURLRoot = options.imageURLRoot;
        this.noPhotoFileName = options.noPhotoFileName;
    }

    , clickedView : function(){      
      if(this.onClickedView != null){
        this.onClickedView(this.model.id);
      }
    }

    , mouseOverView : function(){
      if(this.onMouseOverView != null){
        this.onMouseOverView(this.model.id);
      }      
    }

    , parseModel: function () {
        var item = this.model;
        var imageURL = "";
          if(item.attributes.poster_path != null){
              imageURL = this.imageURLRoot + this.imageSize + item.attributes.poster_path;
          }else{
              imageURL = "assets/img/"+this.noPhotoFileName;
          }      

            var data = { 
              MovieTitle : item.attributes.original_title
              , ReleaseDate : item.attributes.release_date      
              , ImageURL : imageURL
         };    
         return data       ;
    }

    , render: function () {              
        var self = this;
        var compiledTemplate = _.template( ProjectListTemplate, this.parseModel() );
        // Append our compiled template to this Views "el"
        this.$el.append( compiledTemplate );                  

        return this;
    }    
  });
  // Our module now returns our view
  return ListItemView;
});

