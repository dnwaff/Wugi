var uberUrls =
		{
			products: 'https://api.uber.com/v1/products',
			time: 'https://api.uber.com/v1/time',
			price: 'https://api.uber.com/v1/price'
		};
		// TODO: add server token so we can try out the requests
		var token;

function getPriceEstimate(startLat, startLong, endLat, endLong){
	   
	// TODO: add a check if internet is enabled
	   
	   var price = 'N/A';
	   
	   var params = {
	   	server_token : token,
	   	start_latitude: startLat,
	   	start_longitude: startLong,
	   	end_latitude: endLat,
	   	end_longitude: endLong
	   };
	   
	    var xhr = Ti.Network.createHTTPClient({
		onsendstream: function(e){
			Ti.API.error(e.progress);
		}
    });
 
    xhr.setTimeout(15000); // set timeout of connection
   
   // TODO: add could not connect error message.
  
   // xhr.onerror = function(e) {
   //     callback(0,this.responseText, this.status, this);
   // };
 
   // xhr.onload = function() {
   //     callback(1,this.responseText, this.status);
   // };
 
   //opens the get request and sends parameters  
    xhr.open('GET', uberUrls.price);

    xhr.send(params);
    
    // returns the response in a js object
    var priceObject = JSON.parse(xhr.responseText);
    
    // TODO: get price from object priceObject
    
    return price;
    
}

function getTimeEstimate(startLat, startLong){
		// add a check if internet is enabled
	   
	   var time = 'N/A';
	   
	   // add a paramater valid check ?
	   
	   var params = {
	   	server_token : token,
	   	start_latitude: startLat,
	   	start_longitude: startLong,
	   };
	   
	    var xhr = Ti.Network.createHTTPClient({
		onsendstream: function(e){
			Ti.API.error(e.progress);
		}
    });
 
    xhr.setTimeout(15000); // set timeout of connection
   
   // add could not connect error message.
  
   // xhr.onerror = function(e) {
   //     callback(0,this.responseText, this.status, this);
   // };
 
   // xhr.onload = function() {
   //     callback(1,this.responseText, this.status);
   // };
 	
 	
   //opens the get request and sends parameters  
    xhr.open('GET', uberUrls.time);

    xhr.send(params);
    
    // returns the response in a js object
    var timeObject =JSON.parse(xhr.responseText);
    
    // TODO: get time from object timeObject 
    
    return price;
}

function callUber(){
	// check if uber is installed. unfortunately Titanium does not support Package manager directly so we have to use a try and catch
	try {
	// if uber is installed, go to to uber 
	var intent = Ti.Android.createIntent({
		packageName : "com.ubercab"
	});

	Ti.Android.currentActivity.startActivity(intent);

} catch(e){
	Ti.API.info("Not installed");
	// Fallback - if app is not installed
	
	// TODO: launch uber mobile website signup 
}

	
	
	
		
}
