define([
	'jquery',
	'jqueryui',
  'underscore',
  'backbone'
], function($, jqueryui, _, Backbone){
   var BigSearchView = Backbone.View.extend({
   	searchActorsResultArray: [],
   	searchRequest: null,  
    onClickSortButton: null,  
   	selectedItem: null,
    searchType:"actor",    
    events: {      
        //'click #sortButton' : 'sortButtonClicked' 
        //'keyup #queryinput': 'queryInputKeyUp'
    }
     , initialize: function (options) {
        _.bindAll(this
            , 'queryInputKeyUp'
            , 'onSearchRequest'  
            , 'updateViewData'
            , 'onSelectAutoCompleteItem' 
            , 'setInputText'          
            , 'getInputText'  
            , 'selectedRadioButton'             
        );
        this.searchInputElement = $("#"+options.searchInputId);
        this.searchRadioButtonName = options.searchRadioButtonName;
        this.searchRadioButtonElement = $( "input[name='"+this.searchRadioButtonName+"']" );
    }          

    , render: function(){         
        this.addAutocompleteToQueryInput();   
        this.addChangeToRadioButton();

    }  

    , updateViewData :function(textValue, type){
        this.searchType = type;
        this.searchInputElement.val(textValue);        
        var selectedRadioButton = $('input:radio[name="'+this.searchRadioButtonName+'"][value="'+this.searchType+'"]');
        selectedRadioButton.prop('checked', true);        
    }

    , setInputText: function(textValue){
      this.searchInputElement.val(textValue);
    }

    , getInputText: function(){
      return this.searchInputElement.val();
    }

	, addAutocompleteToQueryInput : function(){
		var self = this;   	
    	this.searchInputElement.autocomplete({
      		minLength: 3 // only performs the request to the server when there is 3 or more characters
      		, source: self.onSearchRequest
      		, select: self.onSelectAutoCompleteItem
    	});    

    	// todo use keup event backbone
		this.searchInputElement.keyup(this.queryInputKeyUp);	
    }	 

    , addChangeToRadioButton : function(){        
        this.searchRadioButtonElement.click(this.selectedRadioButton)}

    , selectedRadioButton : function(){      
        this.triggerAutocompleteChangeEvent();
        var checkedRadioButtonValue = $('input:radio[name="'+this.searchRadioButtonName+'"]:checked').val();
        if( checkedRadioButtonValue == "actor"){
            this.selectedActorOption()        
        }else{
            this.selectedMovieOption()
        }
    }

    , selectedActorOption: function(){
      this.searchType ="actor";    
      this.triggerAutocompleteChangeEvent();
    } 

    , selectedMovieOption: function(){
      this.searchType ="movie";    
      this.triggerAutocompleteChangeEvent();
    }   

    , triggerAutocompleteChangeEvent : function(){
      this.searchInputElement.autocomplete("search");
    }
   
    , onSelectAutoCompleteItem: function(event, ui){
         this.setInputText(ui.item.label);
	       this.onSelectedItem(ui.item.id, this.searchType);
    }

    , onSelectedItem:function(personId, type){
		if(this.selectedItem != null){
    		this.selectedItem(personId, type);
    	}
    }

    , queryInputKeyUp : function(e){    	
		/*if (e.keyCode == 13) {

    		if(this.selectedActor != null){
    			this.selectedActor(queryInputElement.val());
    		}
    	}  */  
    }   

    , onSearchRequest: function (request, response){
    	var queryInputElement = this.searchInputElement;    	
		if(this.searchRequest != null){
    		this.searchRequest(queryInputElement.val(), this.searchType , response);
    	}    	
    }

    , hide: function () {
        this.$el.fadeOut(100);

    }

    , show: function () {
        this.$el.fadeIn(100);
    }

  });
  // Our module now returns our view
  return BigSearchView;
});

