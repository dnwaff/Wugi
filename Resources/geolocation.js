

//
//  SHOW CUSTOM ALERT IF DEVICE HAS GEO TURNED OFF
//
if (Titanium.Geolocation.locationServicesEnabled==false)
{
	Titanium.UI.createAlertDialog({title:'', message:'Your device gps is off - turn it on.'}).show();
}
else
{
	Titanium.Geolocation.purpose = "Recieve User Location";
	//
	//  SET ACCURACY - THE FOLLOWING VALUES ARE SUPPORTED
	//
	// Titanium.Geolocation.ACCURACY_BEST
	// Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS
	// Titanium.Geolocation.ACCURACY_HUNDRED_METERS
	// Titanium.Geolocation.ACCURACY_KILOMETER
	// Titanium.Geolocation.ACCURACY_THREE_KILOMETERS
	//
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

	//
	//  SET DISTANCE FILTER.  THIS DICTATES HOW OFTEN AN EVENT FIRES BASED ON THE DISTANCE THE DEVICE MOVES
	//  THIS VALUE IS IN METERS
	//
	Titanium.Geolocation.distanceFilter = 10;

	//
	// GET CURRENT POSITION - THIS FIRES ONCE
	//
	Titanium.Geolocation.getCurrentPosition(function(e)
	{
		if (e.error)
		{
			Ti.API.info('error: ' + JSON.stringify(e.error));
			return;
		}

		var longitude = e.coords.longitude;
		var latitude = e.coords.latitude;
		var altitude = e.coords.altitude;
		var heading = e.coords.heading;
		var accuracy = e.coords.accuracy;
		var speed = e.coords.speed;
		var timestamp = e.coords.timestamp;
		var altitudeAccuracy = e.coords.altitudeAccuracy;

		//Ti.API.info('long:' + longitude + ' lat: ' + latitude);
		
		//Titanium.API.info('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
	});

	//
	// EVENT LISTENER FOR GEO EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON DISTANCE FILTER)
	//
	Titanium.Geolocation.addEventListener('location',function(e)
	{
		if (e.error)
		{
			Ti.API.info('error:' + JSON.stringify(e.error));
			
			return;
		}

		var longitude = e.coords.longitude;
		var latitude = e.coords.latitude;
		var altitude = e.coords.altitude;
		var heading = e.coords.heading;
		var accuracy = e.coords.accuracy;
		var speed = e.coords.speed;
		var timestamp = e.coords.timestamp;
		var altitudeAccuracy = e.coords.altitudeAccuracy;

		//Ti.API.info('long:' + longitude);
		//Ti.API.info('lat: '+ latitude);
		//Ti.API.info('accuracy:' + accuracy);
		//Ti.API.info('timestamp:' +new Date(timestamp));
		
		// reverse geo
		Titanium.Geolocation.reverseGeocoder(latitude,longitude,function(evt)
		{
			var places = evt.places;
			//Ti.API.info("reverse geo:" + places[0].address);
			//Ti.API.debug("reverse geolocation result = "+JSON.stringify(evt));
		});
		
		var lat = latitude,
			lng = longitude,
			latp = 33.77393,
			lngp = -84.36312;
		//Titanium.API.info('geo - location updated: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
		var dist = Math.sqrt(Math.pow((111.3 * (lat - latp)),2) + Math.pow((71.5 * (lng - lngp)),2)) * 1000;
		var miles = dist * 0.000621371;
		var km = dist * 0.001;
		//Titanium.API.info('meters:'+dist+'; miles:'+miles+'; km:'+km);
	});

	
}
function getDistance(glat,glong, label, type){
	Titanium.Geolocation.purpose = "Recieve User Distance";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 10;
	var distance = Titanium.Geolocation.getCurrentPosition(function(e)
	{
		if (e.error)
		{
			Ti.API.info('error: ' + JSON.stringify(e.error));
			return;
		}

		var longitude = e.coords.longitude;
		var latitude = e.coords.latitude;
		var altitude = e.coords.altitude;
		var heading = e.coords.heading;
		var accuracy = e.coords.accuracy;
		var speed = e.coords.speed;
		var timestamp = e.coords.timestamp;
		var altitudeAccuracy = e.coords.altitudeAccuracy;

		//Ti.API.info('long:' + longitude + ' lat: ' + latitude);
		
		//Titanium.API.info('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
		var lat = latitude,
			lng = longitude;
		//Titanium.API.info('geo - location updated: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
		var dist = Math.sqrt(Math.pow((111.3 * (lat - glat)),2) + Math.pow((71.5 * (lng - glong)),2)) * 1000;
		var miles = Math.ceil((dist * 0.000621371) * 10) / 10;
		var km = Math.ceil((dist * 0.001) * 10) / 10;
		if(Ti.App.Properties.getString('units') == 'km'){
			label.setText(km+'km');
		}else{
			label.setText(miles+'mi');
		}
		//Titanium.API.info('meters:'+dist+'; miles:'+miles+'; km:'+km);
	});
}
function getCurrentPosition(json, param){
	Titanium.Geolocation.purpose = "Recieve User Location";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 10;
	var distance = Titanium.Geolocation.getCurrentPosition(function(e)
	{
		if (e.error)
		{
			Ti.API.info('error: ' + JSON.stringify(e.error));
			return;
		}
		
		var longitude = e.coords.longitude;
		var latitude = e.coords.latitude;
		var altitude = e.coords.altitude;
		var heading = e.coords.heading;
		var accuracy = e.coords.accuracy;
		var speed = e.coords.speed;
		var timestamp = e.coords.timestamp;
		var altitudeAccuracy = e.coords.altitudeAccuracy;
		
		if(param){
			Ti.App.fireEvent('geoPositionVenues',{
				latitude: latitude,
				longitude: longitude,
				json: json
			});
		}else{
			Ti.App.fireEvent('geoPosition',{
				latitude: latitude,
				longitude: longitude,
				json: json
			});
		}
		
		
		
		//Titanium.API.info('meters:'+dist+'; miles:'+miles+'; km:'+km);
	});
}

