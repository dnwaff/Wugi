var styles = require('globals').Styles;
var globals = require('globals').Globals;

function Setting(argument) {
	return this.init.apply(this, arguments);
}

Setting.prototype.init = function(argument, Info) {
	var that = this;
	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		barColor : styles.win.barColor,
		layout : 'vertical',
		navTintColor : styles.navTintColor
	});
	this.window.setTitleControl(globals.setCustomTitle(Info.title));
	

	// Add label
	var label = Ti.UI.createLabel({
		text : 'dp / dpi: ' + Ti.Platform.displayCaps.dpi / 160 + ' / ' + Ti.Platform.displayCaps.dpi,
		textAlign : 'left',
		left : (18 * dp),
		color : '#ffffff',
		font : styles.flyout_menu_item.font
	});

	this.window.add(label);
	
	return this.window;
};

module.exports = Setting;
