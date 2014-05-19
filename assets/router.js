// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'scripts/collections/movies',
  'scripts/collections/suggestedmovies',
  'scripts/collections/actors',  
  'scripts/models/movie',
  'scripts/models/actor',    
  'scripts/views/search',
  'scripts/views/list',
  'scripts/views/options',
  'scripts/views/actordetail',
  'scripts/views/moviedetail'
  ], function(
	$,	
	_,
	Backbone,
  Movies,
  SuggestedMovies,
  Actors,  
  Movie,  
  Actor,  
  SearchView,
  ListView,
  OptionsView	,
  ActorDetailView,
  MovieDetailView
	){

	console.log("loaded router")
	
  var AppRouter = Backbone.Router.extend({      
    // TODO get apikey form server    
    apiKey : '7d1782adfaae73da606b85799a92dbd3'
    , movieDbApiUrl : "http://api.themoviedb.org/"
    , movieDbImagesUrl : null
    , autoCompleteResponseObj : null
    , movieListArray : []
    , routes: {        
        "": "defaultRoute"
    }
    , initialize: function () {
        _.bindAll(this
          , 'searchRequestSelectAutoComplete'
          , 'showAutoCompleteInfo' 
          , 'showMovieListInfo' 
          , 'searchActorsRequestAutoCompleteSuccess'
          , 'getMovieDBConfigurationSuccess'
          , 'getMovies'
          , 'getMovieDBConfiguration'
          , 'onSelectedItem'
          , 'onClickSortButton'
          , 'sortMovieCollection'
        );      
        //_.bindAll('getSessionIdAjaxCall');      

        // current searched actor id
        this.currentActorId = null;  

        // collections of movies
        this.selectedActorModel = new Actor();        
        this.selectedActorModel.on('change', this.updateActorDetailView, this);

        // collections of movies
        this.selectedMovieModel = new Movie();        
        this.selectedMovieModel.on('change', this.updateMovieDetailView, this);
        
        // collections of movies
        this.moviesCollection = new Movies();        
        this.moviesCollection.on("reset", this.showMovieListInfo, this);

        // collections of movies
        this.moviesAutocompleteCollection = new SuggestedMovies();
        this.moviesAutocompleteCollection.on("reset", this.showAutoCompleteMovieInfo, this);      

        // collections of actors
        this.actorsCollection = new Actors();
        this.actorsCollection.on("reset", this.showAutoCompleteInfo, this);

        this.bigSearchView = new SearchView({searchInputId : 'queryinput' , searchRadioButtonName : 'queryelement'});
        this.bigSearchView.searchRequest = this.searchRequestSelectAutoComplete;        
        this.bigSearchView.selectedItem = this.onSelectedItem;                
        this.bigSearchView.setElement($('#bigsearch'));    
        this.bigSearchView.render();

        this.smallSearchView = new SearchView({searchInputId : 'smallsearchqueryinput', searchRadioButtonName : 'smallsearchqueryelement'});
        this.smallSearchView.searchRequest = this.searchRequestSelectAutoComplete;        
        this.smallSearchView.selectedItem = this.onSelectedItem;                
        this.smallSearchView.setElement($('#smallsearch'));    
        this.smallSearchView.render();

        this.listView = new ListView();        
        this.listView.setElement($('#smallsearchlist'));            
        this.listView.render();        

        this.optionsView = new OptionsView();        
        this.optionsView.onClickSortButton = this.onClickSortButton;
        this.optionsView.setElement($('#smallsearchoptionsheader'));            
        this.optionsView.render();        

        // actor detail view
        this.actorDetailView = new ActorDetailView();        
        this.actorDetailView.setElement($('#smallsearchactordetail'));            
        this.actorDetailView.render();        

        // movie detail view
        this.movieDetailView = new MovieDetailView();        
        this.movieDetailView.setElement($('#smallsearchmoviedetail'));            
        this.movieDetailView.render();              
        
        // get themobiedb api request
        //this.getMovieDBRequestToken();
        this.getMovieDBConfiguration();
              
      }
    , defaultRoute: function () {
        console.log("loaded default route");
    }

    , onClickSortButton : function(){      
        //this.sortMovieCollection()
        // TODO: find the way to sort without requesting the data again
        this.moviesCollection.is_asc = !this.moviesCollection.is_asc;        
        // get movies
        var url = this.getMovieURL(this.currentItemId, this.currentItemType);
        this.getMovies(this.currentItemType,url);    
        this.optionsView.changeButtonLabel(this.moviesCollection.is_asc);
        //this.moviesCollection.sort();
        //this.listView.refreshMovieList(this.moviesCollection);
    }  

    , sortMovieCollection : function(){        
        this.moviesCollection.is_asc = !this.moviesCollection.is_asc;
        this.moviesCollection.sort();
        this.listView.refreshMovieList(this.moviesCollection);
    }

    //http://api.themoviedb.org/3/configuration?api_key=7d1782adfaae73da606b85799a92dbd3

    , getMovieDBConfiguration: function () {
      $.ajax({
            type: 'GET',
            url: this.movieDbApiUrl+'/3/configuration?api_key=' + this.apiKey,
            //async: false,
            //jsonpCallback: 'testing',
            contentType: 'application/json',
            dataType: 'jsonp',
            success: this.getMovieDBConfigurationSuccess,
            error: this.getMovieDBConfigurationError
      });        
    }    

    , getMovieDBConfigurationSuccess: function( data, textStatus, jqXHR ){
      this.setMovieDBConfiguration(data);        
      console.dir(data);
        //http://api.themoviedb.org/3/search/movie?api_key=7d1782adfaae73da606b85799a92dbd3&query=jim
    }

    , getMovieDBConfigurationError: function(jqXHR,textStatus, errorThrown){
        // TODO dedije what to do if session fails
        console.log(jqXHR);
    }

    , getMovieDBRequestToken: function () {
      $.ajax({
            type: 'GET',
            url: 'http://api.themoviedb.org/3/authentication/token/new?api_key=' + this.apiKey,
            //async: false,
            //jsonpCallback: 'testing',
            contentType: 'application/json',
            dataType: 'jsonp',
            success: this.getMovieDBRequestTokenSuccess,
            error: this.getMovieDBRequestTokenError
      });        
    }    

    , getMovieDBRequestTokenSuccess: function( data, textStatus, jqXHR ){
        this.setMovieDBConfiguration(data);        
    }

    , setMovieDBConfiguration : function(data){      
        this.movieDbImagesUrl = data.images.base_url;
        this.listView.setImageURLRoot(this.movieDbImagesUrl);
        this.actorDetailView.setImageURLRoot(this.movieDbImagesUrl);        
        this.movieDetailView.setImageURLRoot(this.movieDbImagesUrl);        
    }

    , getMovieDBRequestTokenError: function(jqXHR,textStatus, errorThrown){
        // TODO dedije what to do if session fails
        console.log(jqXHR);
    }

    , searchRequestSelectAutoComplete: function (query, type, responseObj) {      
        this.autoCompleteResponseObj = responseObj;                
        var urlEncodedQuery = encodeURIComponent(query);
        var url = "";
        var collection = null
        if(type == "actor"){
            url = this.movieDbApiUrl + '/3/search/person?api_key=' + this.apiKey + '&query=' + urlEncodedQuery + '&page=1'
            collection = this.actorsCollection;            
        }else{
            url = this.movieDbApiUrl + '/3/search/movie?api_key=' + this.apiKey + '&query=' + urlEncodedQuery + '&page=1'
            collection = this.moviesAutocompleteCollection;            
        }        

        this.searchRequestAutoComplete(urlEncodedQuery, url, collection);
    }  

    , searchRequestAutoComplete: function (query, url, collection) {      
        
        collection.url = url;

        var fetchParameters = {          
            type: 'GET',
            contentType:'application/json',            
            cache: false,            
            dataType: 'jsonp',
            success: this.searchRequestAutoCompleteSuccess,
            error: this.searchRequestAutoCompleteError
            //error: this.onloadFunctionalError
        };
        //clientCollection.fetch(fetchParameters);
        collection.fetch(fetchParameters);
    }    



    , onSelectedItem: function(itemId, type){ 
      if(itemId != null)     {
        // set item id in the router
        this.currentItemId = itemId;
        // set item type in the router      
        this.currentItemType = type;      
        // get searched text
        this.currentSearchText = this.bigSearchView.getInputText();
        // hide bigsearchview
        this.bigSearchView.hide();      
        this.smallSearchView.updateViewData( this.currentSearchText,  this.currentItemType);            
        
        // get movies
        var url = this.getMovieURL(itemId, type);
        this.getMovies(type,url);          

        // get item info
        var itemInfoURL = this.getItemDetailURL(itemId, type);
        this.getItemInfo(type , itemInfoURL);
        this.smallSearchView.show();       
      }      
    }  

    , getItemInfo: function (type,url) {            
        if(type == 'actor'){
          this.getActor(type,url);
        }else{      
          this.getMovie(type,url);
        } 
    } 

    , getActor: function (type,url) {            
        this.selectedActorModel.url = url;        
        var fetchParameters = {          
            type: 'GET',
            contentType:'application/json',            
            cache: false,            
            dataType: 'jsonp',
            success: this.getMovieCreditsByPersonIdSuccess,
            error: this.getMovieCreditsByPersonIdError            
        };        
        this.selectedActorModel.fetch(fetchParameters);
    } 

    , getMovie: function (type,url) {            
        this.selectedMovieModel.url = url;        
        var fetchParameters = {          
            type: 'GET',
            contentType:'application/json',            
            cache: false,            
            dataType: 'jsonp',
            success: this.getMovieCreditsByPersonIdSuccess,
            error: this.getMovieCreditsByPersonIdError            
        };        
        this.selectedMovieModel.fetch(fetchParameters);
    } 

    , getItemDetailURL : function (itemId, type) {
        var returnURL = "";

        if(type == 'actor'){
          returnURL = this.movieDbApiUrl + '/3/person/'+itemId+'?api_key=' + this.apiKey;
      }else{      
        returnURL = this.movieDbApiUrl + '/3/movie/'+itemId+'?api_key=' + this.apiKey;
      }

      return returnURL;

    }  

    , getMovieURL : function (itemId, type) {
        var returnURL = "";

        if(type == 'actor'){
          returnURL = this.movieDbApiUrl + '/3/person/'+itemId+'/movie_credits?api_key=' + this.apiKey;
      }else{
        returnURL = this.movieDbApiUrl + '/3/movie/'+itemId+'/similar?api_key=' + this.apiKey;
      }

      return returnURL;

    }  

    //http://api.themoviedb.org/3/person/206/movie_credits?api_key=7d1782adfaae73da606b85799a92dbd3

    , getMovies: function (type,url) {            
        this.moviesCollection.url = url;
        this.moviesCollection.type = type;
        var fetchParameters = {          
            type: 'GET',
            contentType:'application/json',            
            cache: false,            
            dataType: 'jsonp',
            success: this.getMovieCreditsByPersonIdSuccess,
            error: this.getMovieCreditsByPersonIdError
            //error: this.onloadFunctionalError
        };
        //clientCollection.fetch(fetchParameters);
        this.moviesCollection.fetch(fetchParameters);
    } 

    , updateActorDetailView : function(){
        this.hideDetailViews();
        this.actorDetailView.show();
        this.actorDetailView.updateViewData(this.selectedActorModel);
        
    }

    , updateMovieDetailView : function(){
        this.hideDetailViews();
        this.movieDetailView.show();
        this.movieDetailView.updateViewData(this.selectedMovieModel);

    }  

    , hideDetailViews : function (){
        this.actorDetailView.hide();
        this.movieDetailView.hide();
    } 

    , getMovieCreditsByPersonIdSuccess: function( data, textStatus, jqXHR ){
        console.dir(data);
        //http://api.themoviedb.org/3/search/movie?api_key=7d1782adfaae73da606b85799a92dbd3&query=jim
    }

    , getMovieCreditsByPersonIdError: function(jqXHR,textStatus, errorThrown){
        // TODO dedije what to do if session fails
        console.log(jqXHR);
    }

    //tocallmoviedetail
    //http://api.themoviedb.org/3/movie/100042?api_key=7d1782adfaae73da606b85799a92dbd3

    , searchActorsRequest: function (query) {      
      $.ajax({
            type: 'GET',
            url: this.movieDbApiUrl + '/3/search/person?api_key=' + this.apiKey + '&query=' + query,
            //async: false,
            //jsonpCallback: 'testing',
            contentType: 'application/json',
            dataType: 'jsonp',
            success: successFunc,
            error: errorFunc
      });        
    }  

    , searchActorsRequestAutoCompleteSuccess: function( data, textStatus, jqXHR ){
        var i;
        //this.actorsCollection.reset(data.results);        
    }

    , searchActorsRequestAutoCompleteError: function(jqXHR,textStatus, errorThrown){
        // TODO dedije what to do if session fails
        console.log(jqXHR);
    }

    

    , showAutoCompleteInfo : function(){      

        var autoCompleteResult = [];
        var counter = 0;                      

        if(this.actorsCollection.length > 0){
            this.actorsCollection.each(function (item, idx) {
              // only show 5 results in th suggestion box
              if(counter < 5){
                counter++;
                var itemId = item.attributes.id;
                var itemName = item.attributes.name;
                var autoCompleteResultObject = {};
                autoCompleteResultObject.label = itemName;
                autoCompleteResultObject.value = itemName;
                autoCompleteResultObject.id = itemId;
                autoCompleteResult.push(autoCompleteResultObject);                          
              }            
            });                 
        }else{
            var autoCompleteResultObject = {};
            autoCompleteResultObject.label = "No actor was find";
            autoCompleteResultObject.value = "No actor was find";
            autoCompleteResultObject.id = null;
            autoCompleteResult.push(autoCompleteResultObject);                          
        }
        
        this.autoCompleteResponseObj(autoCompleteResult);
    }

    , showAutoCompleteMovieInfo : function(){      

        var autoCompleteResult = [];
        var counter = 0;
        if(this.moviesAutocompleteCollection.length > 0){
            this.moviesAutocompleteCollection.each(function (item, idx) {
              // only show 5 results in th suggestion box
              if(counter < 5){
                counter++;
                var itemId = item.attributes.id;
                var itemName = item.attributes.original_title;
                var autoCompleteResultObject = {};
                autoCompleteResultObject.label = itemName;
                autoCompleteResultObject.value = itemName;
                autoCompleteResultObject.id = itemId;
                autoCompleteResult.push(autoCompleteResultObject);                          
              }            
            });                
        }else{
            var autoCompleteResultObject = {};
            autoCompleteResultObject.label = "No movie was find";
            autoCompleteResultObject.value = "No movie was find";
            autoCompleteResultObject.id = null;
            autoCompleteResult.push(autoCompleteResultObject);                          
        }
        
        this.autoCompleteResponseObj(autoCompleteResult);
    }



    , showMovieListInfo : function(){  
        //this.moviesCollection.sort();
        $.merge(this.movieListArray,this.moviesCollection.models);
        this.listView.refreshMovieList(this.moviesCollection);
    }

    

  });

  Backbone.history.start();

  var initialize = function(){
    //var app_router = new AppRouter();
    Backbone.history.start();
    /*
    app_router.on('showProjects', function(){
      // Call render on the module we loaded in via the dependency array
      // 'views/projects/list'
      var projectListView = new ProjectListView();
      projectListView.render();
    });
      // As above, call render on our loaded module
      // 'views/users/list'
    app_router.on('showUsers', function(){
      var userListView = new UserListView();
      userListView.render();
    });
    app_router.on('defaultAction', function(actions){
      // We have no matching route, lets just log what the URL was
      console.log('No route:', actions);
    });*/
    
  };
  /*return {
    initialize: initialize
  };*/
  return AppRouter;
});