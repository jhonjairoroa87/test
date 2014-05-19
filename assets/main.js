require.config({ 
	paths: { 
        text : 'http://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text',
		jquery: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min', 
		jqueryui: 'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min',	
		underscore: 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
    	backbone: 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min'    	
	} 
}); 

require([ 'app' ], function(App){  
  //App.initialize();
  var myApp = new App();
});

// load main
/*
require(['jquery' , 'jqueryui'], function ($, jqueryui) {
	console.log('main:require:completed'); 
	console.log('main:jq object is ' + $);

	var availableTags = [	      
	];
    $( "#queryinput" ).autocomplete({
      source: availableTags
    });

    $("#queryinput").keyup(function (e) {
    	if (e.keyCode == 13) {
        	var queryinputvalue = $("#queryinput").val();
        	availableTags.push(queryinputvalue);
    	}
});

});
*/