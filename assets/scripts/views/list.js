define([
	'jquery',
	'jqueryui',
  'underscore',
  'backbone',
  'scripts/views/listitem',
  'text!templates/moviecard.html'
], function($, jqueryui, _, Backbone, ListItemView, ProjectListTemplate){
   var ListView = Backbone.View.extend({   	
    imageSize : "w92"
    , imageURLRoot : null
    , noPhotoFileName: "nophoto92x138.jpg"
    , clickedMovieId : null
    , mouseOverMovieId : null
    , viewListItemArray: []
    , events: {
        
        //'keyup #queryinput': 'queryInputKeyUp'
    }
     , initialize: function () {                
        _.bindAll(this
            , 'onClickedView'            
            , 'onMouseOverView'            
        );      
    }


    , render: function(){

    }  

    , setImageURLRoot : function(url){
        this.imageURLRoot = url;
    } 
    
    , refreshMovieList :function (movieCollection){
        this.removeCurrentMovieItems();
        this.showMovieList(movieCollection);
    }

    , showMovieList: function(movieCollection){

      var self = this;
      movieCollection.each(function (item, idx) {
          /*var imageURL = "";
          if(item.attributes.poster_path != null){
              imageURL = self.imageURLRoot + self.imageSize + item.attributes.poster_path;
          }else{
              imageURL = "assets/img/"+self.noPhotoFileName;
          }      

            var data = { 
              MovieTitle : item.attributes.original_title
              , ReleaseDate : item.attributes.release_date      
              , ImageURL : imageURL
            };  */          


            /*this.selectedCardView = null;
            var singleCaseView = new SkyDesk.Views.CaseList.SingleCase({ model: caseModel, index: index });
            this.viewList.push(singleCaseView);
            singleCaseView.onSelectCase = this.selectCase;
            this.$el.append(singleCaseView.render().el);*/

            self.selectedMovieId = null;           
            var listItemViewOptions = { 
              model: item
              , index: idx 
              , imageSize: self.imageSize
              , imageURLRoot : self.imageURLRoot
              , noPhotoFileName : self.noPhotoFileName
            };
            var listItemView = new ListItemView(listItemViewOptions);
            self.viewListItemArray.push(listItemView);
            listItemView.onClickedView = self.onClickedView;
            listItemView.onMouseOverView = self.onMouseOverView;
            self.$el.append(listItemView.render().el);

            //var compiledTemplate = _.template( ProjectListTemplate, data );
            // Append our compiled template to this Views "el"
            //self.$el.append( compiledTemplate );
        });      

      


    }
  
    , onClickedView: function(movieId){
        if(this.clickedMovieId != movieId){
          this.clickedMovieId = movieId;
          console.log("clicked movieId: " + movieId);
        }        
    }

    , onMouseOverView: function(movieId){
        if(this.mouseOverMovieId != movieId){
          this.mouseOverMovieId = movieId;
          console.log("mouse over movieId: " + movieId);
        }        
    }

    , removeCurrentMovieItems: function(){
        this.$el.empty();
    }

  });
  // Our module now returns our view
  return ListView;
});

