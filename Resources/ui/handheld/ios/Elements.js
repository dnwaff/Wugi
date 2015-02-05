var styles = require('globals').Styles;
var globals = require('globals').Globals;

function createLayout(context) {
	var rowText = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 0
	});

	var text_f_name = Ti.UI.createTextField({
		color : styles.textfield.color,
		borderColor : styles.textfield.borderColor,
		height : styles.textfield.height,
		top : 10,
		hintText : 'Enter text ...',
		left : 14,
		right : 14,
		width : Ti.Platform.displayCaps.platformWidth - 28,
		font : styles.textfield.font,
		paddingLeft : 10
	});
	rowText.add(text_f_name);

	// == ADD SLIDER == //
	var rowSlider = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 0
	});

	var customSlider = Titanium.UI.createSlider({
		min : 0,
		max : 100,
		value : 0,
		left : 14,
		top : 14 + 10,
		right : 14,
		width : Ti.Platform.displayCaps.platformWidth - 28,
		height : 20,
		leftTrackImage : '/images/slider_right.png',
		rightTrackImage : '/images/slider_default.png',
		thumbImage : '/images/thumb_image.png',
		args : {
			min : 0,
			max : 100
		}
	});

	customSlider.addEventListener('change', function(e) {
		Ti.API.info(Math.round(e.source.value));

	});
	rowSlider.add(customSlider);

	// CUSTOM PROGRESS BAR
	var pBar = Ti.UI.createView({
		backgroundImage : '/images/slider_default.png',
		height : 20,
		top : 58 + 10,
		left : 14,
		right : 14,
		width : Ti.Platform.displayCaps.platformWidth - 28
	});
	rowSlider.add(pBar);

	context.progress_view = Ti.UI.createView({
		top : 58 + 10,
		left : 14,
		right : 14,
		height : 20,
		backgroundImage : '/images/slider_right.png',
		width : 160,
		zIndex : 4
	});
	rowSlider.add(context.progress_view);

	var pBarWidth = Ti.Platform.displayCaps.platformWidth - 28;
	var lbl_progress = Ti.UI.createLabel({
		text : Math.round((context.progress_view.width / pBarWidth) * 100) + ' %',
		right : 5,
		color : styles.lableProgress.color,
		font : styles.lableProgress.font
	});
	context.progress_view.add(lbl_progress);

	// == ADD SWITCH  ROW-1 == //
	var rowSwitch = Ti.UI.createTableViewRow({
		selectionStyle : 0,
		height : 65
	});

	var basicSwitch1 = Ti.UI.createSwitch({
		value : true, // mandatory property for iOS,
		top : 14 + 10
	});

	basicSwitch1.addEventListener('change', function(e) {
		Ti.API.info('Switch value: ' + basicSwitch1.value);
	});
	rowSwitch.add(basicSwitch1);

	var switch_black = Ti.UI.createButton({
		height : 40,
		width : 81,
		backgroundImage : '/images/black_uncheck.png',
		left : 14,
		top : 14 + 10,
		title : '',
		state : 'off'
	});
	switch_black.addEventListener('singletap', function(e) {
		if (e.source.state == 'off') {
			e.source.state = 'on';
			switch_black.backgroundImage = '/images/black_check.png';
		} else {
			e.source.state = 'off';
			switch_black.backgroundImage = '/images/black_uncheck.png';
		}

	});
	rowSwitch.add(switch_black);

	var switch_green_red = Ti.UI.createButton({
		height : 40,
		width : 81,
		backgroundImage : '/images/green_check.png',
		right : 14,
		top : 14 + 10,
		title : '',
		state : 'on'
	});
	switch_green_red.addEventListener('singletap', function(e) {
		if (e.source.state == 'off') {
			e.source.state = 'on';
			e.source.backgroundImage = '/images/green_check.png';
		} else {
			e.source.state = 'off';
			e.source.backgroundImage = '/images/red_uncheck.png';
		}

	});
	rowSwitch.add(switch_green_red);

	// == ADD BUTTONS BAR == //
	var rowButtonBar = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 0
	});

	var bb1 = Titanium.UI.createButtonBar({
		labels : ['Active', 'Label', 'Label'],
		backgroundColor : styles.button_bar.backgroundColor,
		font : styles.button_bar.font,
		top : 14 + 10,
		style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height : 40,
		width : 292
	});
	rowButtonBar.add(bb1);

	// == ADD TABBED BAR == //
	var rowTabbedBar = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 0
	});

	var tb1 = Titanium.UI.iOS.createTabbedBar({
		labels : ['Active', 'Label', 'Label'],
		backgroundColor : styles.tabbed_bar.backgroundColor,
		font : styles.tabbed_bar.font,
		style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
		top : 14 + 10,
		height : 40,
		width : 292,
		index : 0
	});
	rowTabbedBar.add(tb1);

	// == ADD SMALL BUTTONS == //
	var rowButtonMedium = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 0
	});

	var btn_small_1 = Ti.UI.createButton({
		height : 41,
		width : 141,
		font : styles.button.font,
		color : styles.button.color,
		backgroundImage : '/images/button_blue.png',
		left : 14,
		top : 14 + 10,
		title : 'Button'
	});
	rowButtonMedium.add(btn_small_1);

	var btn_small_2 = Ti.UI.createButton({
		height : 41,
		width : 141,
		font : styles.button.font,
		color : styles.button.color,
		backgroundImage : '/images/button_purple.png',
		right : 14,
		top : 14 + 10,
		title : 'Button'
	});
	rowButtonMedium.add(btn_small_2);

	// == ADD LARGE BUTTON == //
	var rowButtonLarge = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 0
	});

	var btn_large = Ti.UI.createButton({
		height : styles.button.height,
		width : 292,
		color : styles.button.color,
		font : styles.button.font,
		backgroundImage : '/images/button_large_blue.png',
		left : 14,
		right : 14,
		top : 14 + 10,
		title : 'SEND MESSAGE'
	});

	btn_large.addEventListener('click', function() {
		//alert('clicked!');
	});
	rowButtonLarge.add(btn_large);

	var tableItems = [];
	tableItems.push(rowText);
	tableItems.push(rowSlider);
	tableItems.push(rowSwitch);
	tableItems.push(rowButtonBar);
	tableItems.push(rowTabbedBar);
	tableItems.push(rowButtonMedium);
	tableItems.push(rowButtonLarge);

	return tableItems;

}

function create_Table(context) {
	var table = Ti.UI.createTableView({
		showVerticalScrollIndicator : false,
		height : 'auto',
		backgroundColor : 'transparent',
		separatorStyle : 'none'
	});
	table.setData(createLayout(context));
	context.window.add(table);
}

function Elements(argument) {
	return this.init.apply(this, arguments);
}

Elements.prototype.init = function(argument, Info) {
	var that = this;
	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		barColor : styles.win.barColor,
		navTintColor : styles.navTintColor
	});
	this.window.setTitleControl(globals.setCustomTitle(Info.title));

	this.window.addEventListener('open', function(e) {
		create_Table(that);
	});

	return this.window;
};

module.exports = Elements;
