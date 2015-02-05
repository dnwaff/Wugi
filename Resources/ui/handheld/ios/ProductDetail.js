var styles = require('globals').Styles;
var globals = require('globals').Globals;

function createScrollableImages(context) {
	var Views = [];

	var scrollableView = Ti.UI.createScrollableView({
		showPagingControl : true,
		// overlayEnabled : true,
		pagingControlColor : styles.win.backgroundColor, 
		// height : 180,
		height : Ti.UI.SIZE,
		left : 14,
		right : 14,
		top : 10, 
		bottom : 10,
	});

	for (var i = 0; i < context.userInfo.pictures.length; i++) {
		var picture = context.userInfo.pictures[i];

		var view = Ti.UI.createView({
			backgroundColor : 'transparent',
			height : Ti.UI.SIZE
		});

		// Create an ImageView.
		var anImageView = Ti.UI.createImageView({
			image : picture,
			// width : Ti.Platform.displayCaps.platformWidth,
			// height : 180,
			// height : Ti.UI.SIZE,
			height : styles.product_slider.height,
			preventDefaultImage : true,
			hires : true
		});
		view.add(anImageView);

		Views.push(view);
	};

	scrollableView.views = Views;

	return scrollableView;
}

function createLayout(context) {
	var rowImage = Ti.UI.createTableViewRow({
		height : 'auto',
		selectionStyle : 'none',
		backgroundColor : 'transparent'
	});
	rowImage.add(createScrollableImages(context));

	var rowTitle = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 'none',
		backgroundColor : 'transparent',
		layout : 'vertical',
	});
	/*
	 * Title
	 */
	var lbl_name = Ti.UI.createLabel({
		text : context.userInfo.title,
		color : styles.detail_title.color,
		font : styles.detail_title.font,
		top : 0,
		left : 14,
		wordWrap : true,
		height : Ti.UI.SIZE,
	});
	rowTitle.add(lbl_name);

	var tagView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'horizontal',
		left : 14
	});
	rowTitle.add(tagView);

	Ti.API.info(context.userInfo.tags.length);
	for (var i = 0; i < context.userInfo.tags.length; i++) {
		var lbl_tag = Ti.UI.createLabel({
			color : styles.detail_tags.color,
			font : styles.detail_tags.font,
			left : 0,
		});
		if ((i + 1) == context.userInfo.tags.length) {
			lbl_tag.text = context.userInfo.tags[i];
		} else {
			lbl_tag.text = context.userInfo.tags[i] + ', ';
		}

		tagView.add(lbl_tag);
	};

	var rowDetail = Ti.UI.createTableViewRow({
		height : 'auto',
		selectionStyle : 'none',
		backgroundColor : 'transparent'
	});

	var lbl_detail = Ti.UI.createLabel({
		text : context.userInfo.body,
		color : styles.detail_body.color,
		left : 14,
		right : 14,
		top : 10,
		wordWrap : true,
		font : styles.detail_body.font
	});
	rowDetail.add(lbl_detail);

	context.tableRows.push(rowImage);
	context.tableRows.push(rowTitle);
	context.tableRows.push(rowDetail);

}

function create_Table(context) {
	var table = Ti.UI.createTableView({
		showVerticalScrollIndicator : false,
		height : 'auto',
		backgroundColor : 'transparent',
		separatorStyle : 'none'
	});

	return table;
}

function NewsDetail(argument) {
	return this.init.apply(this, arguments);
}

NewsDetail.prototype.init = function(argument, userInfo) {
	var that = this;
	this.navGroup = argument;
	this.userInfo = userInfo;

	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		barColor : styles.win.barColor,
		navTintColor : styles.navTintColor
	});
	this.window.setTitleControl(globals.setCustomTitle('Product Detail'));

	this.window.addEventListener('open', function(e) {
		that.tableRows = [];
		var table = create_Table(that);
		createLayout(that);
		table.setData(that.tableRows);
		that.window.add(table);
	});

	return this.window;
};

module.exports = NewsDetail;
