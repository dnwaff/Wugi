Ti.include(Titanium.Filesystem.resourcesDirectory + "controls/RightMenu.js");
var globals = require('globals').Globals;
var styles = require('globals').Styles;
var mapdata = require('globals').MapData;
var mapModule = require('ti.map');

function directionsButton(data) {
	var btn_right_menu = Ti.UI.createButton({
		width : 24 * dp,
		height : 16 * dp,
		title:'Directions'
	});

	btn_right_menu.addEventListener('click', function(e) {
		var fullAddress = data.address[0] + ' ' + data.address[1];
		//echo(fullAddress)
		//var geopoint = geoloc;
		Ti.Platform.openURL("http://maps.apple.com/maps?daddr="+ fullAddress);
	});

	return btn_right_menu;
}
function Map(argument) {
	return this.init.apply(this, arguments);
}

Map.prototype.init = function(argument, Info) {
	var that = this;
	this.navGroup = argument;
	this.mapData = Info;

	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		barColor : styles.win.barColor,
		rightNavButton : directionsButton(this.mapData),
		navTintColor : styles.navTintColor
	});
	//this.window.setTitleControl(globals.setCustomTitle(that.mapData.title));
	// CREATE MENU VIEW
	this.menuView = createRightMenu(this);
	this.window.add(this.menuView);
	this.isMenuShown = false;

	this.window.addEventListener('open', function(e) {
		if (Titanium.Network.online) {
			var annotations = [];
			//for (var i = 0; i < mapdata.annotations.length; i++) {
			var mountainView = mapModule.createAnnotation({
						latitude : that.mapData.geolocation.latitude,
						longitude : that.mapData.geolocation.longitude,
						title : that.mapData.name,
						subtitle : '',
					pincolor : mapModule.ANNOTATION_RED,
					leftButton : '/images/sample_map_image.png',
					animate : false
				});
				annotations.push(mountainView);
			//};


			var mapview = mapModule.createView({
				mapType : mapModule.NORMAL_TYPE,
				region : {
						//latitude : mapdata.origin.latitude, //37.390749,
						//longitude : mapdata.origin.longitude, //-122.081651,
						latitude: that.mapData.geolocation.latitude,
						longitude: that.mapData.geolocation.longitude,
						latitudeDelta : 0.01,
						longitudeDelta : 0.01
				},
				animate : true,
				regionFit : true,
				userLocation : true,
				annotations : annotations
			});
			var geoloc = mapview.region.latitude+','+mapview.region.longitude;
			that.window.add(mapview);
		} else {
			alert('No internet connection found');
		}

	});

	this.window.addEventListener('click', function(e) {
		that.isMenuShown = false;
		that.menuView.animate(slide_out_top);
	});

	return this.window;
};

module.exports = Map;
