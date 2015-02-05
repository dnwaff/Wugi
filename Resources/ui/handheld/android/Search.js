Ti.include(Titanium.Filesystem.resourcesDirectory + "helpers/apiHelper.js");
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var globals = require('globals').Globals;
var styles = require('globals').Styles;

function createEventView(context, event, position, type) {
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
	 * Open Details window
	 */
	view.addEventListener('click', function(e) {
		var detailWin = type == 'venues' ? require('/ui/handheld/android/VenueDetail') : require('/ui/handheld/android/EventDetail');
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
		borderRadius:5 * dp,
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
	if(type == 'venues'){
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
	}else{
		var lbl_day = Ti.UI.createLabel({
			text : event.dayOfWeek,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			//color : styles.feed_table_row_title.color,
			color : styles.feed_table_row_title.color,
			//left : 0,
			font : styles.feed_table_row_title.font,
			//top : 5 * dp,
			height : Ti.UI.SIZE,
			wordWrap : true,
			info : event
		});
		info_view.add(lbl_day);
		var lbl_title = Ti.UI.createLabel({
			text : event.venue.name,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : '#7eb162',
			//left : 0,
			font : styles.feed_table_row_title.font,
			//top : 5 * dp,
			height : Ti.UI.SIZE,
			wordWrap : true,
			info : event
		});
		info_view.add(lbl_title);
	}
		
	
	/*var lbl_day = Ti.UI.createLabel({
		text : event.dayOfWeek,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		//color : styles.feed_table_row_title.color,
		color : styles.feed_table_row_title.color,
		//left : 0,
		font : styles.feed_table_row_title.font,
		//top : 5 * dp,
		height : Ti.UI.SIZE,
		wordWrap : true,
		info : event
	});
	info_view.add(lbl_day);*/
	
	view.add(inner_view);
	return view;
}

function createLayout(context, Events, OuterView, type) {
	var row;
	var _left = 7 * dp;
	for (var i = 0; i < Events.length; i++) {
		var view1 = createEventView(context, Events[i], {
			left : _left
		}, type);
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
		backgroundColor : 'transparent',
		layout: 'vertical'
	});
	
	var VenuesOuterView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		top : 10 * dp,
		width : Ti.Platform.displayCaps.platformWidth,
		backgroundColor : 'tranparent'
	});
	scroll.add(VenuesOuterView);

	var EventsOuterView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		top : 10 * dp,
		width : Ti.Platform.displayCaps.platformWidth,
		backgroundColor : 'tranparent'
	});
	scroll.add(EventsOuterView);
	scroll.VenuesOuterView = VenuesOuterView;
	scroll.EventsOuterView = EventsOuterView;
	//createLayout(context, Events, OuterView);

	return scroll;
}

function Events(argument) {
	return this.init.apply(this, arguments);
}

Events.prototype.init = function(argument, isFlyout) {
	var that = this;
    this.data = argument;
	this.EventsWin = require('/ui/handheld/android/ParentView');
	this.EventsWin = new this.EventsWin();
	this.noVenues = false;
	this.noEvents = false;
	this.indicator = Ti.UI.createActivityIndicator({
		style : Titanium.UI.ActivityIndicatorStyle.PLAIN
	});
	this.EventsWin.add(that.indicator);
	this.indicator.show();
	this.scrollView = createScroll(that);
	that.EventsWin.scrollView = this.scrollView;
	that.EventsWin.add(this.scrollView);
	Ti.App.addEventListener('indicatorhide', function (event) {
		that.indicator.hide();
	});
	Ti.App.addEventListener('geoPosition', function(e){
		var jsonArr =[];	
		for (var i = 0; i < e.json.length; i++) {
			var lat = e.latitude,
				lng = e.longitude,
				glat = e.json[i].venue.geolocation.latitude,
				glong = e.json[i].venue.geolocation.longitude;
			//Titanium.API.info('geo - location updated: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
			var dist = Math.sqrt(Math.pow((111.3 * (lat - glat)),2) + Math.pow((71.5 * (lng - glong)),2)) * 1000;
			var miles = Math.ceil((dist * 0.000621371) * 10) / 10;
			var km = Math.ceil((dist * 0.001) * 10) / 10;
			var distance = Ti.App.Properties.getString('units')== 'km' ? km : miles;
			var radius = Ti.App.Properties.getString('units')== 'km' ? Ti.App.Properties.getString('kmRadius') : Ti.App.Properties.getString('mRadius');
			if(radius >= distance){
				jsonArr.push(e.json[i]);
			}
		}	
		if(jsonArr.length){
			that.EventsWin.add(createScroll(that, jsonArr));
		}else{
			alert('No events within '+ radius +' '+Ti.App.Properties.getString('units'));
		}
		
	});
	if (Titanium.Network.online) {
			var query2 ='order=name&where={"active":1}';
			//var query = 'where={"feature":1}';
			Parse.queryObjects('Venue', query2, function(e, response, status) {
				if (status == '200') {
					//alert(response);
					//echo(response)
					var Json = eval('(' + response + ')');
					if (Json.results.length > 0) {							
						var jsonArr =[];	
						for (var i = 0; i < Json.results.length; i++) {
							var searchStr = that.data.searchVal;
								searchStr = searchStr.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							var replaced = searchStr.replace(/ /g, '|');
							var string1 = Json.results[i].name;
							var regex = new RegExp( replaced, 'gi' );
							var matchPos1 = string1.search(regex);
							//echo(matchPos1);
							if(matchPos1 != -1){
								jsonArr.push(Json.results[i]);
							}
						}
						if(jsonArr.length > 0){
							createLayout(that, jsonArr, that.scrollView.VenuesOuterView, 'venues');
						}else{
							that.noVenues = true;
						}
					} else {
						that.noVenues = true;
						
					}
					that.indicator.hide();	
				}else{
					that.indicator.hide();
					//Ti.App.fireEvent('indicatorhide');
					alert('Network Error. Please try again');
				}
				//echo(response);
				//var eventData = eval('(' + response + ')');
			});
			// CREATE API CALL TO GET DATA FROM SERVICE
			//Parse.com REST Queries syntax
			var td = new Date();
			var c_date = td.getDate();
			if(c_date < 10){
				c_date = "0" + c_date;
			}
			var c_month = td.getMonth() + 1;
			if(c_month < 10){
				c_month = "0" + c_month;
			}
			var c_year = td.getFullYear();
			var nDate = c_year + '-' + c_month + '-' + c_date+'T08:00:00.000Z';
			//var column = '"'+that.data.menuItem.category+'":"'+ that.data.menuItem.title + '",';
			//echo(column);
			var query ='order=startDate&include=venue&where={"active":1, "endDate":{"$gt":{"__type":"Date","iso":"'+nDate+'"}}}';
			//var query = 'where={"feature":1}';
			Parse.queryObjects('Event', query, function(e, response, status) {
				if (status == '200') {
					//alert(response);
					//echo(response)
					var Json = eval('(' + response + ')');
					if (Json.results.length > 0) {						
						var jsonArr =[];	
						for (var i = 0; i < Json.results.length; i++) {
							var searchStr = that.data.searchVal;
								searchStr = searchStr.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
							var replaced = searchStr.replace(/ /g, '|');
							//echo(replaced);
							var string1 = Json.results[i].venue.name;
							var regex = new RegExp( replaced, 'gi' );
							var matchPos1 = string1.search(regex);
							//echo(matchPos1);
							var string2 = Json.results[i].name;
							var matchPos2 = string2.search(regex);
							//echo(matchPos2);
							if(matchPos1 != -1 || matchPos2 != -1){
								jsonArr.push(Json.results[i]);
							}
						}
						if(jsonArr.length > 0){
							createLayout(that, jsonArr, that.scrollView.EventsOuterView, 'events');
						}else{
							that.noEvents = true;
						}							
						
					} else {
						that.noEvents = true;
						
					}
					that.indicator.hide();	
				}else{
					that.indicator.hide();
					//Ti.App.fireEvent('indicatorhide');
					alert('Network Error. Please try again');
				}
				//echo(response);
				//var eventData = eval('(' + response + ')');
			});
			
		} else {
			that.indicator.hide();
			//Ti.App.fireEvent('indicatorhide');
			alert('No internet connection found');
		}

	var searchInput = that.data.searchVal;
	if(searchInput.length > 11){
		searchInput = searchInput.substring(0,11) + '...';
	}
	var lbl_title = Ti.UI.createLabel({
		text : 'Results for ' + searchInput,
		font : {
			fontSize : 18 * dp,
			fontFamily : 'Montserrat',
			fontWeight : 'Bold'
		},
		color : '#000'
	});
	this.EventsWin.headerView.add(lbl_title);
	//this.EventsWin.headerView.add(rightNavButton(this));
	// CREATE MENU VIEW
	//this.menuView = createRightMenu(this);
	//this.EventsWin.add(this.menuView);
	this.isMenuShown = false;
	//CREATE TABLE
	//create_Table(this);

	return this.EventsWin;

};

module.exports = Events;
