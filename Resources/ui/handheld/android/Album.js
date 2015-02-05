var globals = require('globals').Globals;
var styles = require('globals').Styles;
Ti.include(Titanium.Filesystem.resourcesDirectory + "controls/RightMenu.js");
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
Ti.include(Titanium.Filesystem.resourcesDirectory + "calendar.js");

function createEventView(context, event, position) {
	/*
	 * Event View
	 */
	var view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		bottom : 7 * dp,
		top : 0,
		left : position.left,
		//backgroundSelectedColor : styles.home_button.selectedBackgroundColor,
		//width : (Ti.Platform.displayCaps.platformWidth - (42 * dp)) / 2,
		width : (Ti.Platform.displayCaps.platformWidth - (14 * dp)) / 2,
		info : event
	});
	/*
	 * Event inner View
	 * We need this View in order to 
	 * add a padding for the Events View.
	 * This padding is visible when the Hover Effect 
	 * occur. 
	 */
	var inner_view = Ti.UI.createView({
		top: 0,
		right: 7 * dp,
		bottom : 7 * dp,
		left : 7 * dp,
		layout : 'vertical',
		height : Ti.UI.SIZE,
		info : event,
	});
	
	/*
	 * Hover effect
	 */
	/*view.addEventListener('touchstart', function(e) {
		view.backgroundColor = styles.home_button.selectedBackgroundColor;
	});

	view.addEventListener('touchcancel', function(e) {
		view.backgroundColor = 'transparent';
	});

	view.addEventListener('touchend', function(e) {
		view.backgroundColor = 'transparent';
	});
	*/
	/*
	 * Open Details window
	 */
	view.addEventListener('click', function(e) {
		var detailWin = require('/ui/handheld/android/AlbumPhotos');
		detailWin = new detailWin(e.source.info);
		detailWin.open();
	});
	/*
	 * Image
	 */
	var image = Ti.UI.createImageView({
		height : 145 * dp,
		hires : true,
		preventDefaultImage : true,
		image : event.filename,
		left : 0,
		top : 0,
		width : (Ti.Platform.displayCaps.platformWidth - (42 * dp)) / 2,
		info : event
	});
	//view.add(image);
	inner_view.add(image);

	/*image.addEventListener('touchstart', function(e) {
		view.backgroundColor = styles.home_button.selectedBackgroundColor;
	});

	image.addEventListener('touchcancel', function(e) {
		view.backgroundColor = 'transparent';
	});

	image.addEventListener('touchend', function(e) {
		view.backgroundColor = 'transparent';
	});*/
	
	view.add(inner_view);
	return view;
}

function createLayout(context, Events, OuterView) {
	var row;
	var _left = 7 * dp;
	for (var i = 0; i < Events.length; i++) {
		var view1 = createEventView(context, Events[i], {
			left : _left
		});
		if (i == 0) {
			row = Titanium.UI.createView({
				backgroundSelectedColor : 'transparent',
				height : Ti.UI.SIZE
			});
		}
		row.add(view1);
		if (((i - 1) % 2 == 0) || (i == Events.length - 1)) {
			_left = 7 * dp;
			OuterView.add(row);

			var divider = Ti.UI.createView({
				height : 1 * dp,
				width : Ti.Platform.displayCaps.platformWidth,
				backgroundColor : '#efefef'
			});
			//OuterView.add(divider);

			row = Titanium.UI.createView({
				backgroundSelectedColor : 'transparent',
				height : Ti.UI.SIZE
			});
		} else {
			//_left = (Ti.Platform.displayCaps.platformWidth / 2) + (7 * dp);
			_left = (Ti.Platform.displayCaps.platformWidth / 2);
		}
	}
}

function createScroll(context, Events) {
	var scroll = Ti.UI.createScrollView({
		height : 'auto',
		top : 48 * dp,
		width : Ti.Platform.displayCaps.platformWidth,
		backgroundColor : 'transparent'
	});

	var Divider = Ti.UI.createView({
		height : 1 * dp,
		top : ( 180 + 6 )* dp,
		width : Ti.Platform.displayCaps.platformWidth - (28 * dp),
		left: 14 * dp,
		right:14* dp,
		backgroundColor : '#EFEFEF'
	});
	var OuterView = Ti.UI.createView({
		height : 'auto',
		layout : 'vertical',
		top : 10 * dp,
		width : Ti.Platform.displayCaps.platformWidth,
		backgroundColor : 'tranparent'
	});
	scroll.add(OuterView);

	createLayout(context, Events, OuterView);

	return scroll;
}

function headerbar(context, winTitle) {
	var view = Ti.UI.createView({
		height : 48 * dp,
		top : 0,
		backgroundColor : '#7eb162'
	});

	var btn_back = Ti.UI.createButton({
		backgroundImage : '/images/btn_back.png',
		height : 40 * dp,
		width : 40 * dp,
		left : 5 * dp,
		zIndex : 5
	});
	view.add(btn_back);

	btn_back.addEventListener('click', function(e) {
		context.window.close();
	});

	var dividerLeft = Ti.UI.createView({
		height : 48 * dp,
		width : 1 * dp,
		backgroundColor : '#EFEFEF',
		left : 50 * dp,
		zIndex : 5
	});
	view.add(dividerLeft);

	var lbl_title = Ti.UI.createLabel({
		text : winTitle,
		font : {
			fontSize : 18 * dp,
			fontFamily : 'Montserrat',
			fontWeight : 'Bold'
		},
		color : '#fff'
	});
	view.add(lbl_title);

	var divider = Ti.UI.createView({
		height : 1 * dp,
		width : Ti.Platform.displayCaps.platformWidth,
		backgroundColor : '#EFEFEF',
		bottom : 0,
		zIndex : 5
	});
	//view.add(divider);

	return view;
}

function Album(argument) {
	return this.init.apply(this, arguments);
}

Album.prototype.init = function(argument, winTitle) {
	var that = this;
	this.eData = argument;

	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		zIndex : 20,
		exitOnClose : false,
		navBarHidden : true,
		orientationModes : [Ti.UI.PORTRAIT]
	});
	this.window.add(headerbar(this, winTitle));

	this.window.addEventListener('open', function(e) {
		//this.add(createScroll(that, Json.results));
		this.add(createScroll(that, that.eData));
	});

	this.window.addEventListener('androidback', function(e) {
		that.window.close();
	});

	return this.window;
};

module.exports = Album;
