Ti.include(Titanium.Filesystem.resourcesDirectory + "helpers/apiHelper.js");
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var globals = require('globals').Globals;
var styles = require('globals').Styles;

function createEventView(context, event, position) {
	/*
	 * Venue View
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
	 * Venue inner View
	 * We need this View in order to 
	 * add a padding for the Venues View.
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
		var detailWin = require('/ui/handheld/android/VenueDetail');
		detailWin = new detailWin(e.source.info);
		detailWin.open();
	});
	/*
	 * Image
	 */
	var image = Ti.UI.createImageView({
		height : 155 * dp,
		hires : true,
		preventDefaultImage : true,
		image : event.imageThumbURL,
		left : 0,
		top : 0,
		width : (Ti.Platform.displayCaps.platformWidth - (42 * dp)) / 2,
		info : event
	});
	//view.add(image);
	inner_view.add(image);

	var info_view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		// top : 165 * dp,
		info : event
	});
	//view.add(info_view);
	inner_view.add(info_view);
	/*
	 * Title
	 */
	var lbl_title = Ti.UI.createLabel({
		text : event.name,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color : styles.feed_table_row_title.color,
		//left : 0,
		font : styles.feed_table_row_title.font,
		//top : 5 * dp,
		height : Ti.UI.SIZE,
		wordWrap : true,
		info : event
	});
	info_view.add(lbl_title);
	
	var lbl_type = Ti.UI.createLabel({
		text : event.type,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		//color : styles.feed_table_row_title.color,
		color : '#7eb162',
		//left : 0,
		font : styles.feed_table_row_title.font,
		//top : 5 * dp,
		height : Ti.UI.SIZE,
		wordWrap : true,
		info : event
	});
	info_view.add(lbl_type);
	
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

function Venues(argument) {
	return this.init.apply(this, arguments);
}

Venues.prototype.init = function(argument, isFlyout) {
	var that = this;

	this.VenuesWin = require('/ui/handheld/android/ParentView');
	this.VenuesWin = new this.VenuesWin();

	this.indicator = Ti.UI.createActivityIndicator({
		style : Titanium.UI.ActivityIndicatorStyle.PLAIN
	});
	this.VenuesWin.add(that.indicator);
	this.indicator.show();
	Ti.App.addEventListener('indicatorhide', function (event) {
		that.indicator.hide();
		//echo('hide');
	});
	/*if (Titanium.Network.online) {
		// CREATE API CALL TO GET DATA FROM SERVICE
		var url = "http://highenergymedia.com/demo/wugi/events.json";
		APIGetRequest(url, function(e) {
			var status = this.status;
			if (status == '200') {
				//echo(status);
				Ti.App.fireEvent('indicatorhide');
				var Json = eval('(' + this.responseText + ')');
				if (Json.results.length > 0) {
					that.VenuesWin.add(createScroll(that, Json.results));
				} else {
					alert('No events found');
				}
				
			}
		}, function(err) {
			Ti.App.fireEvent('indicatorhide');
			alert('Unknow error from api');
			
		});
	} else {
		Ti.App.fireEvent('indicatorhide');
		alert('No internet connection found');
	}*/
	if (Titanium.Network.online) {
		// CREATE API CALL TO GET DATA FROM SERVICE
		//Parse.com REST Queries syntax
		var query ='order=name&where={"active":1,"openLate":true}';
		//var query = 'where={"feature":1}';
		Parse.queryObjects('Venue', query, function(e, response, status) {
			if (status == '200') {
				//echo(status);
				
				var Json = eval('(' + response + ')');
				if (Json.results.length > 0) {			
					that.VenuesWin.add(createScroll(that, Json.results));
				} else {
					alert('No venues found');
				}
				Ti.App.fireEvent('indicatorhide');	
			}else{
				Ti.App.fireEvent('indicatorhide');
				alert('Unknow error from api');
			}
			//echo(response);
			//var eventData = eval('(' + response + ')');
		});
	} else {
		Ti.App.fireEvent('indicatorhide');
		alert('No internet connection found');
	}

	var lbl_title = Ti.UI.createLabel({
		text : argument.menuItem.title,
		font : {
			fontSize : 18 * dp,
			fontFamily : 'Montserrat',
			fontWeight : 'Bold'
		},
		color : '#000'
	});
	this.VenuesWin.headerView.add(lbl_title);
	//this.VenuesWin.headerView.add(rightNavButton(this));
	// CREATE MENU VIEW
	//this.menuView = createRightMenu(this);
	//this.VenuesWin.add(this.menuView);
	this.isMenuShown = false;
	//CREATE TABLE
	//create_Table(this);

	return this.VenuesWin;

};

module.exports = Venues;
