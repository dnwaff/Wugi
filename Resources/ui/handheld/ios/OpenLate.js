Ti.include(Titanium.Filesystem.resourcesDirectory + "helpers/apiHelper.js");
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var styles = require('globals').Styles;
var globals = require('globals').Globals;

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

	APIGetRequestImage(event.imageURL, image, indicator, function(e) {
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

function createTable(context, Events) {
	var table = Ti.UI.createTableView({
		showVerticalScrollIndicator : false,
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
		separatorColor: 'transparent',
		height : 'auto',
		backgroundColor : 'transparent',
		scrollable: false
	});

	var rows = [];
	var totalRows = Math.ceil(Events.length / 2);
	rows = createRows(context, Events);

	table.setData(rows);

	return table;
}

function createScroll(context, Events) {
	var scroll = Ti.UI.createScrollView({
		height : 'auto',
		top : 0,
		width : Ti.Platform.displayCaps.platformWidth,
		backgroundColor : 'transparent'
	});

	scroll.add(createTable(context, Events));

	return scroll;
}
function Events(argument) {
	return this.init.apply(this, arguments);
}

Events.prototype.init = function(argument, Info) {
	var that = this;
	this.navGroup = argument;
	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		barColor : styles.win.barColor,
		navTintColor : styles.navTintColor
	});
	this.window.setTitleControl(globals.setCustomTitle(Info.title));

	var indicator = Ti.UI.createActivityIndicator({
		style : Ti.UI.iPhone.ActivityIndicatorStyle.DARK
	});
	this.window.add(indicator);
	indicator.show();

	this.window.addEventListener('open', function(e) {
		if (Titanium.Network.online) {
			// CREATE API CALL TO GET DATA FROM SERVICE
			//Parse.com REST Queries syntax
			var query ='order=name&where={"active":1,"openLate":true}';
			//var query = 'where={"feature":1}';
			Parse.queryObjects('Venue', query, function(e, response, status) {
				if (status == '200') {
					//alert(response);
					//echo(response)
					var Json = eval('(' + response + ')');
					if (Json.results.length > 0) {	
						//that.window.add(createTable(that, Json.results));		
						that.window.add(createScroll(that, Json.results));
					} else {
						alert('No events found');
						
					}
					indicator.hide();	
				}else{
					indicator.hide();
					//Ti.App.fireEvent('indicatorhide');
					alert('Network Error. Please try again');
				}
				echo(response);
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
