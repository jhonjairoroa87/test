define([
	'jquery',
	'jqueryui',
  'underscore',
  'backbone'
], function($, jqueryui, _, Backbone){
   var OptionsView = Backbone.View.extend({   	
    events: {
        //'click #sortButton' : 'sortButtonClicked' 
        //'keyup #queryinput': 'queryInputKeyUp'
    }
     , initialize: function (options) {
        _.bindAll(this            
            , 'sortButtonClicked'       
        );                                
    }
    , render: function(){ 
        var self = this;        
        this.$el.find("#sortButton").on( "click", self.sortButtonClicked);        
    }

    , sortButtonClicked : function(){         
        if (this.onClickSortButton != null ){
            this.onClickSortButton();
        }
    }  

    , changeButtonLabel : function(isAsc){   
        var buttonLabel = "Older Movies First!";
        if (isAsc == true){
            var buttonLabel = "Recent Movies First!";                        
        }

        this.$el.find("#sortButton").html(buttonLabel);
    }  

    , 
  });
  // Our module now returns our view
  return OptionsView;
});

