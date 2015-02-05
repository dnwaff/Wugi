var styles = require('globals').Styles;
var globals = require('globals').Globals;
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");

function createLayout(context, OuterView) {
	var rowText = Ti.UI.createView({
		height : Ti.UI.SIZE
	});

	var text_f_name = Ti.UI.createTextField({
		color : styles.textfield.color,
		borderColor : styles.textfield.borderColor,
		borderWidth : 1 * dp,
		backgroundColor : 'transparent',
		height : styles.textfield.height,
		top : 10 * dp,
		hintText : 'Enter text ...',
		left : 14 * dp,
		right : 14 * dp,
		width : Ti.Platform.displayCaps.platformWidth - 28 * dp,
		font : styles.textfield.font,
		paddingLeft : 10 * dp
	});
	rowText.add(text_f_name);

	// == ADD SLIDER == //
	var rowSlider = Ti.UI.createView({
		height : Ti.UI.SIZE
	});

	var customSlider = Titanium.UI.createSlider({
		min : 0,
		max : 100,
		value : 0,
		left : 14 * dp,
		top : (14 + 10) * dp,
		right : 14 * dp,
		width : Ti.Platform.displayCaps.platformWidth - 28 * dp,
		height : 27.5 * dp,
		leftTrackImage : '/images/slider_right.png',
		rightTrackImage : '/images/slider_default.png'
	});

	customSlider.addEventListener('change', function(e) {
		Ti.API.info(Math.round(e.value));
	});
	rowSlider.add(customSlider);

	// CUSTOM PROGRESS BAR
	var pBar = Ti.UI.createView({
		backgroundImage : '/images/slider_default.png',
		height : 20 * dp,
		top : (55 + 10) * dp,
		left : 14 * dp,
		right : 14 * dp,
		width : Ti.Platform.displayCaps.platformWidth - 28 * dp
	});
	rowSlider.add(pBar);

	var progress_view = Ti.UI.createView({
		top : (55 + 10) * dp,
		left : 14 * dp,
		right : 14 * dp,
		height : 20 * dp,
		backgroundImage : '/images/slider_right.png',
		width : 100 * dp,
		zIndex : 4
	});
	rowSlider.add(progress_view);

	var pBarWidth = Ti.Platform.displayCaps.platformWidth - 28 * dp;
	var lbl_progress = Ti.UI.createLabel({
		text : Math.round((progress_view.width / pBarWidth) * 100) + ' %',
		right : 5,
		color : styles.lableProgress.color,
		font : styles.lableProgress.font
	});
	progress_view.add(lbl_progress);

	// == ADD SWITCH  ROW-1 == //
	var rowSwitch = Ti.UI.createView({
		height : Ti.UI.SIZE
	});

	var basicSwitch1 = Ti.UI.createSwitch({
		value : true,
		top : (14 + 10) * dp,
		height : 45 * dp,
		width : 70 * dp
	});

	basicSwitch1.addEventListener('change', function(e) {
		Ti.API.info('Switch value: ' + basicSwitch1.value);
	});
	rowSwitch.add(basicSwitch1);

	var switch_black = Ti.UI.createButton({
		height : 40 * dp,
		width : 81 * dp,
		backgroundImage : '/images/black_uncheck@2x.png',
		left : 14 * dp,
		top : (14 + 10) * dp,
		title : '',
		state : 'off'
	});
	switch_black.addEventListener('singletap', function(e) {
		if (e.source.state == 'off') {
			e.source.state = 'on';
			switch_black.backgroundImage = '/images/black_check@2x.png';
		} else {
			e.source.state = 'off';
			switch_black.backgroundImage = '/images/black_uncheck@2x.png';
		}

	});
	rowSwitch.add(switch_black);

	var switch_green_red = Ti.UI.createButton({
		height : 40 * dp,
		width : 81 * dp,
		backgroundImage : '/images/green_check@2x.png',
		right : 14 * dp,
		top : (14 + 10) * dp,
		title : '',
		state : 'on'
	});
	switch_green_red.addEventListener('singletap', function(e) {
		if (e.source.state == 'off') {
			e.source.state = 'on';
			e.source.backgroundImage = '/images/green_check@2x.png';
		} else {
			e.source.state = 'off';
			e.source.backgroundImage = '/images/red_uncheck@2x.png';
		}

	});
	rowSwitch.add(switch_green_red);

	// == ADD SMALL BUTTONS == //
	var rowButtonMedium = Ti.UI.createView({
		height : Ti.UI.SIZE
	});

	var btn_small_1 = Ti.UI.createButton({
		height : 41 * dp,
		width : 141 * dp,
		font : styles.button.font,
		color : styles.button.color,
		//backgroundImage : '/images/button_blue@2x.png',
		backgroundColor : styles.button.backgroundColor,
		backgroundSelectedColor : styles.button.selectedBackgroundColor,
		left : 14 * dp,
		borderRadius : 5 * dp,
		top : (14 + 10) * dp,
		title : 'Button'
	});
	rowButtonMedium.add(btn_small_1);

	var btn_small_2 = Ti.UI.createButton({
		height : 41 * dp,
		width : 141 * dp,
		font : styles.button.font,
		color : styles.button.color,
		backgroundColor : styles.button.selectedBackgroundColor,
		backgroundSelectedColor : styles.button.backgroundColor,
		//backgroundImage : '/images/button_purple@2x.png',
		right : 14 * dp,
		borderRadius : 5 * dp,
		top : (14 + 10) * dp,
		title : 'Button'
	});
	rowButtonMedium.add(btn_small_2);

	// == ADD LARGE BUTTON == //
	var rowButtonLarge = Ti.UI.createView({
		height : Ti.UI.SIZE
	});

	var btn_large = Ti.UI.createButton({
		height : styles.button.height,
		width : Ti.Platform.displayCaps.platformWidth - 28 * dp,
		color : styles.button.color,
		font : styles.button.font,
		//backgroundImage : '/images/button_large_blue.png',
		backgroundColor : styles.button.backgroundColor,
		backgroundSelectedColor : styles.button.selectedBackgroundColor,
		left : 14 * dp,
		right : 14 * dp,
		top : (14 + 10) * dp,
		title : 'SEND MESSAGE'
	});

	var progressIndicator = Ti.UI.Android.createProgressIndicator({
		message : 'Sending...',
		location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
		type : Ti.UI.Android.PROGRESS_INDICATOR_DETERMINANT,
		cancelable : false,
		min : 0,
		max : 10
	});

	btn_large.addEventListener('click', function() {
		try {
			progressIndicator.show();
			var value = 0;
			setInterval(function() {
				if (value > 10) {
					return;
				}
				progressIndicator.value = value;
				value++;
			}, 200);
			// do some work that takes 3 seconds
			// ie. replace the following setTimeout block with your code
			setTimeout(function() {
				progressIndicator.hide();
			}, 3000);
		} catch(ex) {
			var toast = Titanium.UI.createNotification({
				duration : 2000,
				message : "Unexpected exception occured"
			});
			toast.show();
		}
	});
	rowButtonLarge.add(btn_large);

	OuterView.add(rowText);
	OuterView.add(rowSlider);
	OuterView.add(rowSwitch);
	OuterView.add(rowButtonMedium);
	OuterView.add(rowButtonLarge);
}

function createScroll(context) {
	var OuterView = Ti.UI.createView({
		layout : 'vertical',
		top : 0,
		height : Ti.UI.SIZE,
		backgroundColor : styles.win.backgroundColor
	});
	createLayout(context, OuterView);

	var scroll = Ti.UI.createScrollView({
		height : Ti.UI.SIZE,
		top : 48 * dp
	});
	scroll.add(OuterView);

	context.ElementsWin.add(scroll);
}

function Elements(argument) {
	return this.init.apply(this, arguments);
}


Elements.prototype.init = function(argument, isFlyout) {
	var that = this;
	this.winTitle = (argument != null) ? argument.menuItem.title : 'Elements';

	if (isFlyout) {
		this.ElementsWin = require('/ui/handheld/android/ParentView');
		this.ElementsWin = new this.ElementsWin();
	
		var lbl_title = Ti.UI.createLabel({
			text : this.winTitle,
			font : {
				fontSize : 18 * dp,
				fontFamily : 'Montserrat',
				fontWeight : 'Bold'
			},
			color : '#fff'
		});
		this.ElementsWin.headerView.add(lbl_title);
	} else {
		this.ElementsWin = Ti.UI.createWindow({
			backgroundColor : styles.win.backgroundColor,
			zIndex : 20,
			exitOnClose : false,
			navBarHidden : true,
			orientationModes : [Ti.UI.PORTRAIT]
		});
		this.headerView = globals.setHeaderBar(this.ElementsWin, this.winTitle);
		this.headerView.add(rightNavButton(this));

		this.ElementsWin.add(this.headerView);
	}

	createScroll(this);

	return this.ElementsWin;
}

module.exports = Elements;
