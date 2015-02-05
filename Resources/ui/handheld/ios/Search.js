Ti.include(Titanium.Filesystem.resourcesDirectory + "helpers/apiHelper.js");
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var styles = require('globals').Styles;
var globals = require('globals').Globals;

function createVenueView(context, event, position) {
	/*
	 * Event View 
	 */
	var view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		bottom : 7,
		top : 7,
		left : position.left,
		width : 139 + 7 + 7,
	});

	/*
	 * Event inner View
	 * We need this View in order to 
	 * add a padding for the Events View.
	 * This padding is visible when the Hover Effect 
	 * occur. 
	 */
	var inner_view = Ti.UI.createView({
		top: 7,
		right: 7,
		bottom : 7,
		left : 7,
		layout : 'vertical',
		height : Ti.UI.SIZE,
		backgroundColor : styles.products_table_tile.backgroundColor,
		info : event
	});
	
	/*
	 * Open Details window
	 */
	inner_view.addEventListener('touchend', function(e) {
		var detailWin = require('/ui/handheld/ios/VenueDetail');
		detailWin = new detailWin(context.navGroup, e.source.info);
		context.navGroup.openWindow(detailWin);
	});
	/*
	 * Image
	 */
	var image = Ti.UI.createImageView({
		top: 0,
		// height : 155,
		// height : 139,
		// width : 139,
		width : styles.products_table_row.imageWidth,
		height : styles.products_table_row.imageHeight,
		hires : true,
		preventDefaultImage : true,
		//touchEnabled : false,
		info : event,
	});
	inner_view.add(image);

	var indicator = Ti.UI.createActivityIndicator({
		style : Ti.UI.iPhone.ActivityIndicatorStyle.DARK
	});
	image.add(indicator);
	indicator.show();

	APIGetRequestImage(event.imageThumbURL, image, indicator, function(e) {
		var status = this.status;
		if (status == 200) {
			var image = e.source.imgView;
			image.setImage(this.responseData);
			e.source.ind.hide();
		}
	});
	
	var info_view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		info : event
	});
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

function createEventView(context, event, position) {
	/*
	 * Event View 
	 */
	var view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		bottom : 7,
		top : 7,
		left : position.left,
		width : 139 + 7 + 7,
	});

	/*
	 * Event inner View
	 * We need this View in order to 
	 * add a padding for the Events View.
	 * This padding is visible when the Hover Effect 
	 * occur. 
	 */
	var inner_view = Ti.UI.createView({
		top: 7,
		right: 7,
		bottom : 7,
		left : 7,
		layout : 'vertical',
		height : Ti.UI.SIZE,
		backgroundColor : styles.products_table_tile.backgroundColor,
		info : event
	});
	
	/*
	 * Open Details window
	 */
	inner_view.addEventListener('touchend', function(e) {
		var detailWin = require('/ui/handheld/ios/EventDetail');
		detailWin = new detailWin(context.navGroup, e.source.info, this.flyer);
		context.navGroup.openWindow(detailWin);
	});
	/*
	 * Image
	 */
	var image = Ti.UI.createImageView({
		top: 0,
		// height : 155,
		// height : 139,
		// width : 139,
		width : styles.products_table_row.imageWidth,
		height : styles.products_table_row.imageHeight,
		hires : true,
		preventDefaultImage : true,
		borderRadius:5 * dp,
		//touchEnabled : false,
		info : event,
	});
	inner_view.add(image);

	var indicator = Ti.UI.createActivityIndicator({
		style : Ti.UI.iPhone.ActivityIndicatorStyle.DARK
	});
	image.add(indicator);
	indicator.show();

	APIGetRequestImage(event.imageThumbURL, image, indicator, function(e) {
		var status = this.status;
		if (status == 200) {
			var image = e.source.imgView;
			image.setImage(this.responseData);
			e.source.ind.hide();
			inner_view.flyer = this.responseData;
		}
	});
	
	var info_view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		info : event
	});
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
	
	var lbl_day = Ti.UI.createLabel({
		text : event.dayOfWeek,
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
	info_view.add(lbl_day);

	view.add(inner_view);
	return view;
}
function createVenueRows(context, Events) {
	var tableRows = [];
	var row;
	var _left = 7;
	for (var i = 0; i < Events.length; i++) {
		var view1 = createVenueView(context, Events[i], {
			left : _left
		});
		if (i == 0) {
			row = Titanium.UI.createTableViewRow({
				selectionStyle : 'none',
				height : Ti.UI.SIZE
			});
		}
		row.add(view1);
		if (((i - 1) % 2 == 0) || (i == Events.length - 1)) {
			_left = 7;
			tableRows.push(row);
			row = Titanium.UI.createTableViewRow({
				selectionStyle : 'none',
				height : Ti.UI.SIZE
			});
		} else {
			_left = (Ti.Platform.displayCaps.platformWidth / 2);

		}

	};

	return tableRows;

}

function createRows(context, Events) {
	var tableRows = [];
	var row;
	var _left = 7;
	for (var i = 0; i < Events.length; i++) {
		var view1 = createEventView(context, Events[i], {
			left : _left
		});
		if (i == 0) {
			row = Titanium.UI.createTableViewRow({
				selectionStyle : 'none',
				height : Ti.UI.SIZE
			});
		}
		row.add(view1);
		if (((i - 1) % 2 == 0) || (i == Events.length - 1)) {
			_left = 7;
			tableRows.push(row);
			row = Titanium.UI.createTableViewRow({
				selectionStyle : 'none',
				height : Ti.UI.SIZE
			});
		} else {
			_left = (Ti.Platform.displayCaps.platformWidth / 2);

		}

	};

	return tableRows;

}

function createVenueTable(context, Events) {
	var OuterView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		//layout : 'vertical',
		//top : 10 * dp,
		width : Ti.Platform.displayCaps.platformWidth,
		backgroundColor : 'tranparent'
	});
	
	var aLabel = Ti.UI.createLabel({
		text : 'Venues',
		color : '#000',
		font : {fontSize:20*dp},
		top : 0,
		textAlign : 'center'
	});
	OuterView.add(aLabel);
	
	
	var table = Ti.UI.createTableView({
		showVerticalScrollIndicator : false,
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
		separatorColor: 'transparent',
		height : Ti.UI.SIZE,
		backgroundColor : 'transparent',
		scrollable: false,
		top:20 * dp
	});

	var rows = [];
	var totalRows = Math.ceil(Events.length / 2);
	rows = createVenueRows(context, Events);

	table.setData(rows);
	OuterView.add(table);

	return OuterView;
}

function createTable(context, Events) {
	var OuterView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		//layout : 'vertical',
		//top : 10 * dp,
		width : Ti.Platform.displayCaps.platformWidth,
		backgroundColor : 'tranparent'
	});
	
	var aLabel = Ti.UI.createLabel({
		text : 'Events',
		color : '#000',
		font : {fontSize:20*dp},
		top : 0,
		textAlign : 'center'
	});
	OuterView.add(aLabel);
	
	var table = Ti.UI.createTableView({
		showVerticalScrollIndicator : false,
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
		separatorColor: 'transparent',
		height : Ti.UI.SIZE,
		backgroundColor : 'transparent',
		scrollable: false,
		top: 20 * dp
	});

	var rows = [];
	var totalRows = Math.ceil(Events.length / 2);
	rows = createRows(context, Events);

	table.setData(rows);
	OuterView.add(table);

	return OuterView;
}

function createScroll(context, Events) {
	var scroll = Ti.UI.createScrollView({
		height : 'auto',
		top : 0,
		width : Ti.Platform.displayCaps.platformWidth,
		backgroundColor : 'transparent',
		layout: 'vertical'
	});

	//scroll.add(createTable(context, Events));

	return scroll;
}
function Events(argument) {
	return this.init.apply(this, arguments);
}

Events.prototype.init = function(argument, Info) {
	var that = this;
	this.navGroup = argument;
	this.data = Info;
	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		barColor : styles.win.barColor,
		navTintColor : styles.navTintColor
	});
	this.searchVenues = false;
	this.searchEvents = false;
	var searchInput = that.data.searchVal;
	if(searchInput.length > 11){
		searchInput = searchInput.substring(0,11) + '...';
	}
	this.window.setTitleControl(globals.setCustomTitle('Results for ' + searchInput));
	//this.window.setTitleControl(globals.setCustomTitle('Search Results'));
	var indicator = Ti.UI.createActivityIndicator({
		style : Ti.UI.iPhone.ActivityIndicatorStyle.DARK
	});
	this.window.add(indicator);
	indicator.show();
	this.scrollView = createScroll(that);
	that.window.scrollView = this.scrollView;
	that.window.add(this.scrollView);
	this.window.addEventListener('open', function(e) {
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
				that.window.add(createScroll(that, jsonArr));
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
							//that.window.add(createScroll(that, jsonArr));
							that.window.scrollView.add(createVenueTable(that, jsonArr));
						}else{
							that.searchVenues = true;
						}
					} else {
						that.searchVenues = true;
						
					}
					indicator.hide();	
				}else{
					indicator.hide();
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
							//that.window.add(createScroll(that, jsonArr));
							that.window.scrollView.add(createTable(that, jsonArr));
						}else{
							that.searchEvents = true;
						}							
						
					} else {
						that.searchEvents = true;
						
					}
					indicator.hide();	
				}else{
					indicator.hide();
					//Ti.App.fireEvent('indicatorhide');
					alert('Network Error. Please try again');
				}
				//echo(response);
				//var eventData = eval('(' + response + ')');
			});
			
		} else {
			indicator.hide();
			//Ti.App.fireEvent('indicatorhide');
			alert('No internet connection found');
		}
	});
	
	

	return this.window;
};

module.exports = Events;
