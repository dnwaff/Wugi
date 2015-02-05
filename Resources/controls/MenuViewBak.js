Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var globals = require('globals').Globals;
var styles = require('globals').Styles;

function createRow(context, data, index) {
	var headerHeight = 48 * dp;
	var tableRow = Ti.UI.createTableViewRow({
		backgroundColor : data.rowBackgroundColor,
		// height : 45 * dp,
		// height : styles.flyout_menu_item.rowHeight,
		height : (data.isHeader == null) ? styles.flyout_menu_item.rowHeight : headerHeight
		// backgroundSelectedColor : '#8c5e7a', // this is a generic View property, we will use the row specific property instead below
		//selectedBackgroundColor : styles.flyout_menu_item.selectedBackgroundColor,
	});

	var icon_menu = Ti.UI.createImageView({
		image : data.iconAndroid,
		height : 32 * dp,
		width : 32 * dp,
		hires : true,
		left : 10 * dp
	});
	tableRow.add(icon_menu);

	var divider = Ti.UI.createView({
		// height : 45 * dp,
		height : styles.flyout_menu_item.rowHeight,
		width : 1 * dp,
		// backgroundColor : '#343434',
		backgroundColor : styles.flyout_menu_item.verticalDividerColor,
		left : (20 * dp) + icon_menu.width,
		zIndex : 5
	});
	//tableRow.add(divider);

	var label = Ti.UI.createLabel({
		text : data.title,
		textAlign : 'left',
		left : (18 * dp) + divider.left,
		color : data.color,
		// font : {
			// fontSize : 13 * dp,
			// fontFamily : 'Montserrat',
			// fontWeight : 'Regular'
		// }
		font : styles.flyout_menu_item.font
	});
	tableRow.add(label);

	if (data.name != '_main_menu') {
		var img_right_disclosure = Ti.UI.createImageView({
			image : (data.hasChildren == true) ? '/images/ic_arrow@2x.png' : '',
			height : 32 * dp,
			width : 32 * dp,
			right : 10 * dp
		});
		tableRow.add(img_right_disclosure);
	}

	var separator = Ti.UI.createView({
		height : 1 * dp,
		width : 290 * dp,
		// backgroundColor : '#343434',
		backgroundColor : styles.flyout_menu_item.rowSeparatorColor,
		bottom : 0,
		zIndex : 5,
		left : 0
	});
	tableRow.add(separator);

	return tableRow;
};
function createTable(context) {
	var table = Titanium.UI.createTableView({
		//backgroundColor : '#202020',
		backgroundColor : styles.flyout_menu.backgroundColor,
		top : 0,
		left : 0,
		width : Ti.Platform.displayCaps.platformWidth - (60 * dp)
	});

	table.addEventListener('click', function(obj) {
		if (context.selectedIndex != obj.index) {
			context.tableView.fireEvent('hide', {});
			context.selectedIndex = obj.index;
			context.tableView.fireEvent('menu:selected', {
				menuItem : globals.menu[obj.index]
			});

		} else {
			context.tableView.fireEvent('hide', {});
		}
	});

	table.addEventListener('swipe', function(e) {
		if (e.direction == 'left') {
	      context.tableView.fireEvent('hide', {});
	   }
	});
	
	return table;
}

function createLayout(context) {
	for (var i = 0; i < globals.menu.length; i++) {
		var obj = {
			title : globals.menu[i].title,
		};
		var row = createRow(context, globals.menu[i], i);
		context.data.push(row);
	};
	context.tableView.setData(context.data);
}

function Menu(data) {
	return this.init.apply(this, arguments);
}

Menu.prototype.init = function(args) {
	var that = this;
	this.data = [];
	this.animating = false;
	this.selectedIndex = 0;
	this.tableView = createTable(this);
	createLayout(this);

	return this.tableView;
};

module.exports = Menu;
