var styles = require('globals').Styles;
var globals = require('globals').Globals;

function createProductView(context, product, position) {
	/*
	 * Product View 
	 */
	var view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		bottom : 7,
		top : 7,
		left : position.left,
		width : 139 + 7 + 7,
	});

	/*
	 * Product inner View
	 * We need this View in order to 
	 * add a padding for the Products View.
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
		info : product
	});
	
	/*
	 * Hover effect
	 */
	inner_view.addEventListener('touchstart', function(e) {
		inner_view.backgroundColor = styles.products_table_tile.backgroundSelectedColor;
		view.backgroundColor = styles.products_table_tile.backgroundSelectedColor;
	});

	inner_view.addEventListener('touchcancel', function(e) {
		inner_view.backgroundColor = styles.products_table_tile.backgroundColor;
		view.backgroundColor = 'transparent';
	});

	inner_view.addEventListener('touchend', function(e) {
		inner_view.backgroundColor = styles.products_table_tile.backgroundColor;
		view.backgroundColor = 'transparent';
	});
	/*
	 * Open Details window
	 */
	inner_view.addEventListener('click', function(e) {
		var detailWin = require('/ui/handheld/ios/ProductDetail');
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
		touchEnabled : false,
		info : product,
	});
	inner_view.add(image);

	var indicator = Ti.UI.createActivityIndicator({
		style : Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN
	});
	image.add(indicator);
	indicator.show();

	APIGetRequestImage(product.thumb, image, indicator, function(e) {
		var status = this.status;
		if (status == 200) {
			var image = e.source.imgView;
			image.setImage(this.responseData);
			e.source.ind.hide();
		}
	});

	/* TODO: Check the need of this code since according to the 
	 *       API documentation all the events are forwarding to
	 *       the parent element if touchEnabled - false
	 * 		 http://www.screencast.com/t/bQRp72S8uFs
	 */
	/*
	image.addEventListener('touchstart', function(e) {
		inner_view.backgroundColor = styles.home_button.backgroundSelectedColor;
	});

	image.addEventListener('touchcancel', function(e) {
		inner_view.backgroundColor = 'transparent';
	});

	image.addEventListener('touchend', function(e) {
		inner_view.backgroundColor = 'transparent';
	});
	*/
	
	var info_view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		info : product
	});
	inner_view.add(info_view);
	/*
	 * Title
	 */
	var lbl_title = Ti.UI.createLabel({
		text : product.title,
		color : styles.feed_table_row_title.color,
		left : 0,
		font : styles.feed_table_row_title.font,
		// top : 0,
		top : 10,
		height : Ti.UI.SIZE,
		wordWrap : true,
		info : product
	});
	info_view.add(lbl_title);

	var tagView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'horizontal',
		left : 0,
		top : 0,
		info : product
	});
	info_view.add(tagView);

	for (var i = 0; i < product.tags.length; i++) {
		var lbl_tag = Ti.UI.createLabel({
			color : styles.feed_table_row_tags.color,
			font : styles.feed_table_row_tags.font,
			left : 0,
			info : product
		});
		if ((i + 1) == product.tags.length) {
			lbl_tag.text = product.tags[i];
		} else {
			lbl_tag.text = product.tags[i] + ', ';
		}

		tagView.add(lbl_tag);
	};

	var lbl_detail = Ti.UI.createLabel({
		text : (product.body.length > 37) ? product.body.substring(0, 37) + '...' : product.body,
		color : styles.feed_table_row_teaser.color,
		left : 0,
		right : 14,
		height : 35,
		top: 10,
		font : styles.feed_table_row_teaser.font,
		info : product
	});
	info_view.add(lbl_detail);

	view.add(inner_view);
	return view;
}

function createRows(context, Products) {
	var tableRows = [];
	var row;
	var _left = 7;
	for (var i = 0; i < Products.length; i++) {
		var view1 = createProductView(context, Products[i], {
			left : _left
		});
		if (i == 0) {
			row = Titanium.UI.createTableViewRow({
				selectionStyle : 'none',
				height : Ti.UI.SIZE
			});
		}
		row.add(view1);
		if (((i - 1) % 2 == 0) || (i == Products.length - 1)) {
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

function createTable(context, Products) {
	var table = Ti.UI.createTableView({
		showVerticalScrollIndicator : false,
		height : 'auto',
		backgroundColor : 'transparent',
		separatorColor : '#343434'
	});

	var rows = [];
	var totalRows = Math.ceil(Products.length / 2);
	rows = createRows(context, Products);

	table.setData(rows);

	return table;
}

function Products(argument) {
	return this.init.apply(this, arguments);
}

Products.prototype.init = function(argument, Info) {
	var that = this;
	this.navGroup = argument;
	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		barColor : styles.win.barColor,
		navTintColor : styles.navTintColor
	});
	this.window.setTitleControl(globals.setCustomTitle(Info.title));

	var indicator = Ti.UI.createActivityIndicator({
		style : Ti.UI.iPhone.ActivityIndicatorStyle.BIG
	});
	this.window.add(indicator);
	indicator.show();

	this.window.addEventListener('open', function(e) {
		if (Titanium.Network.online) {
			var url = globals.products.url;
			APIGetRequest(url, function(e) {
				var status = this.status;
				if (status == 200) {
					var Json = eval('(' + this.responseText + ')');
					//Ti.API.info(Json);
					if (Json.result.length > 0) {
						that.window.add(createTable(that, Json.result));
					} else {
						alert('No products found');
					}
					indicator.hide();
				}
			}, function(err) {
				indicator.hide();
				alert('Unknow error from api');
			});
		} else {
			indicator.hide();
			alert('No internet connection found');
		}
	});

	return this.window;
};

module.exports = Products;
