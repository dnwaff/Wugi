/*
* Single Window Application Template:
* A basic starting point for your application.  Mostly a blank canvas.
*
* In app.js, we generally take care of a few things:
* - Bootstrap the application with any data we need
* - Check for dependencies like device type, platform version or network connection
* - Require and open our top-level UI component
*
*/

//#define kBaseURL @https://instagram.com/
//#define kInstagramAPIBaseURL @https://api.instagram.com
//#define kAuthenticationURL @oauth/authorize/?client_id=%@&redirect_uri=%@&response_type=token&scope=likes+comments+basic" //comments
//#define kClientID @377445f21ac1406a81cdc4c134f0395c
//#define kRedirectURI @http://localhost

//register_client.png
//NSString* urlString = [kBaseURL stringByAppendingFormat:kAuthenticationURL, kClientID,kRedirectURI];
 //NSURLRequest* request = [NSURLRequest requestWithURL: [NSURL URLWithString:urlString]];
//[_webView loadRequest:request];
//https://api.instagram.com/v1/users/self?access_token=1153043358.377445f.ecf37bdebb084a2ba7006380560cda86 
//NSURL *instagramURL = [NSURL URLWithString:@"instagram://"];
//if ([[UIApplication sharedApplication] canOpenURL:instagramURL])
//{
	// Open Hook
//}
//else
//{
//}
//bootstrap and check dependencies
if (Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with multiple windows in a stack
(function() {
	//render appropriate components based on the platform and form factor
	var osname = Ti.Platform.osname, 
		version = Ti.Platform.version, 
		height = Ti.Platform.displayCaps.platformHeight, 
		width = Ti.Platform.displayCaps.platformWidth;

	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 950 ));
	//
	//Print app properties
	var props = Ti.App.Properties.listProperties();
	for (var i = 0, ilen = props.length; i < ilen; i++) {
		var value = Ti.App.Properties.getString(props[i]);
		Ti.API.info(props[i] + ' = ' + value);
	}
	if(!Ti.App.Properties.getString('units')){
		Ti.App.Properties.setString('units', 'mi');
	}
	if(!Ti.App.Properties.getString('mRadius')){
		Ti.App.Properties.setString('mRadius', '20.0');
	}
	if(!Ti.App.Properties.getString('kmRadius')){
		Ti.App.Properties.setString('kmRadius', '20.0');
	}
	if(!Ti.App.Properties.getString('sharephoto')){
		Ti.App.Properties.setString('sharephoto', 'yes');
	}
	
	Titanium.App.addEventListener('open', function (e) {
    	Ti.API.info('app.js: Open event on '+Ti.Platform.osname);
	});     
	Titanium.App.addEventListener('close', function (e) {
	    Ti.API.info('app.js: Close event on '+Ti.Platform.osname);
	});     
	Titanium.App.addEventListener('pause', function (e) {
	    Ti.API.info('app.js: Pause event on '+Ti.Platform.osname);
	});     
	Titanium.App.addEventListener('resume', function (e) {
	    Ti.API.info('app.js: Resume event on '+Ti.Platform.osname);
	});
	
	var Parse = require('parse');
	
	if (Titanium.Network.online) {
			// CREATE API CALL TO GET DATA FROM SERVICE
			//Parse.com REST Queries syntax
			var td = new Date();
			var c_date = td.getDate();
			if(c_date < 10){
				c_date = "0" + c_date;
			}
			var c_month = td.getMonth() + 1;
			if (c_month < 10) {
				c_month = "0" + c_month;
			}
			var c_year = td.getFullYear();
			var nDate = c_year + '-' + c_month + '-' + c_date + 'T08:00:00.000Z';
			var query = 'order=startDate&include=venue&where={"active":1, "endDate":{"$gte":{"__type":"Date","iso":"' + nDate + '"}}}';
			//var query = 'where={"feature":1}';
			Parse.queryObjects('Event', query, function (e, response, status, statusText) {
				Ti.API.info(status);
				Ti.API.info(JSON.stringify(statusText));
				if (status == '200') {
					//Ti.API.info(status);
					//Ti.API.info(response);
					var Json = eval('(' + response + ')');
					if (Json.results.length > 0) {
						eventResults = Json.results;
						//Ti.API.info(self.events.json);
						parseVenues(eventResults);
					} else {
						alert('No events found');
						Ti.API.info('No events found');
					}
					
				} else {
					alert('Network Error(01). Please try again');
					Ti.API.info('Network Error(01). Please try again');
				}
				//Ti.API.info(response);
				//var eventData = eval('(' + response + ')');
			});
			function parseVenues(eventResults){
				// CREATE API CALL TO GET DATA FROM SERVICE
				//Parse.com REST Queries syntax
				var query = 'order=name&where={"active":1}';
				//var query = 'where={"feature":1}';
				Parse.queryObjects('Venue', query, function (e, response, status) {
					if (status == '200') {
						//Ti.API.info(status);
						//Ti.API.info(response);
						var Json = eval('(' + response + ')');
						if (Json.results.length > 0) {
							venueResults = Json.results;
							//Ti.API.info(self.venues.json);
						} else {
							Ti.API.info('No venues found');
						}
					Ti.App.fireEvent('startApp', {
						eventJson: eventResults,
						venueJson:venueResults
					});
					} else {
						alert('Network Error(02). Please try again');
						Ti.API.info('Network Error(02). Please try again');
					}
					
					//var eventData = eval('(' + response + ')');
				});
				}
		} else {
			Ti.API.info('No internet connection found');
		}
	
	Ti.App.addEventListener('startApp',function(e){
		var Window;
		// Android uses platform-specific properties to create windows.
		// All other platforms follow a similar UI pattern.
		if (osname === 'android') {
			Window = require('ui/handheld/android/ApplicationWindow');
		} else {
			Window = require('ui/handheld/ios/ApplicationWindow');
		}
		Window = new Window(e.eventJson, e.venueJson);
		Window.open();
	});
	
//function onBackPressed() {
	//Intent startMain = new Intent(Intent.Action_Main);
	//startMain.addCategory(Intent.Category_Home);
	//startMain.setFlags(Intent.Flag_Activity_New_Task);
	//startActivity(startMain);
}
	
	)();
