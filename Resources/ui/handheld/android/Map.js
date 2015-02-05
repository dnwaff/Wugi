Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var globals = require('globals').Globals;
var styles = require('globals').Styles;
var mapdata = require('globals').MapData;

function Map(argument) {
	return this.init.apply(this, arguments);
}

Map.prototype.init = function(argument, isFlyout) {
	var that = this;
	this.mapData = argument;
	//this.winTitle = (argument != null) ? argument.menuItem.title : 'Map';
	this.winTitle = '';
	
	
	var btn_directions = Ti.UI.createButton({
		title : 'Directions',
		backgroundColor:'Transparent',
		height : 40 * dp,
		width : Ti.UI.SIZE,
		right : 5 * dp,
		zIndex : 5,
		color: '#7eb162'
	});
	

	
	btn_directions.addEventListener('click',function(){
		var fullAddress = that.mapData.address[0] + ' ' + that.mapData.address[1];
		//echo(fullAddress)
		//var geopoint = geoloc;
		Ti.Platform.openURL("http://maps.google.com/maps?daddr="+ fullAddress);
	});
	
	if (isFlyout) {
		this.MapWin = require('/ui/handheld/android/ParentView');
		this.MapWin = new this.MapWin();

		var lbl_title = Ti.UI.createLabel({
			color : '#ffffff',
			text : this.winTitle,
			font : {
				fontSize : 18 * dp,
				fontFamily : 'Montserrat',
				fontWeight : 'Bold'
			}
			
		});
		this.MapWin.headerView.add(lbl_title);
		this.MapWin.headerView.add(btn_directions);
		//this.MapWin.headerView.add(rightNavButton(this));
	} else {
		this.MapWin = Ti.UI.createWindow({
			backgroundColor : styles.win.backgroundColor,
			zIndex : 20,
			exitOnClose : false,
			navBarHidden : true,
			orientationModes : [Ti.UI.PORTRAIT]
		});
		this.headerView = globals.setHeaderBar(this.MapWin, this.winTitle);
		this.headerView.add(btn_directions);
		//this.headerView.add(rightNavButton(this));

		this.MapWin.add(this.headerView);
	}

	// CREATE MENU VIEW
	//this.menuView = createRightMenu(this);
	//this.MapWin.add(this.menuView);
	this.isMenuShown = false;

	if (Titanium.Network.online) {
		var annotations = [];
			//for (var i = 0; i < mapdata.annotations.length; i++) {
				var mountainView = Titanium.Map.createAnnotation({
						latitude : that.mapData.geolocation.latitude,
						longitude : that.mapData.geolocation.longitude,
						title : that.mapData.name,
						subtitle : '',
					pincolor : Titanium.Map.ANNOTATION_RED,
					leftButton : '/images/sample_map_image.png',
					animate : false
				});
				annotations.push(mountainView);
			//};
		var mapview = Titanium.Map.createView({
			top : 48 * dp,
			mapType : Titanium.Map.STANDARD_TYPE,
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
		this.MapWin.add(mapview);
	} else {
		alert('No internet connection found');
	}

	return this.MapWin;

};

module.exports = Map;
