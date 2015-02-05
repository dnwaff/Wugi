var styles = require('globals').Styles;
var globals = require('globals').Globals;
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");

function createLayout(context, OuterView) {
	var viewName = Ti.UI.createView({
		height : Ti.UI.SIZE
	});

	var text_f_name = Ti.UI.createTextField({
		color : styles.textfield.color,
		borderColor : styles.textfield.borderColor,
		borderWidth : 1 * dp,
		backgroundColor : 'transparent',
		height : styles.textfield.height,
		top : 14 * dp,
		hintText : 'name*',
		left : 14 * dp,
		right : 14 * dp,
		width : Ti.Platform.displayCaps.platformWidth - 28 * dp,
		font : styles.textfield.font,
		paddingLeft : 10 * dp
	});
	viewName.add(text_f_name);

	// EMAIL
	var viewEmail = Ti.UI.createView({
		height : Ti.UI.SIZE,
		selectionStyle : 'none'
	});

	var text_f_Email = Ti.UI.createTextField({
		color : styles.textfield.color,
		borderColor : styles.textfield.borderColor,
		borderWidth : 1 * dp,
		backgroundColor : 'transparent',
		height : styles.textfield.height,
		top : 14 * dp,
		hintText : 'email*',
		left : 14 * dp,
		right : 14 * dp,
		font : styles.textfield.font,
		width : Ti.Platform.displayCaps.platformWidth - 28 * dp,
		paddingLeft : 10 * dp
	});
	viewEmail.add(text_f_Email);

	// Subject
	var viewSubject = Ti.UI.createView({
		height : Ti.UI.SIZE,
		selectionStyle : 'none'
	});

	var text_f_Subject = Ti.UI.createTextField({
		color : styles.textfield.color,
		borderColor : styles.textfield.borderColor,
		borderWidth : 1 * dp,
		backgroundColor : 'transparent',
		height : styles.textfield.height,
		top : 14 * dp,
		hintText : 'subject*',
		left : 14 * dp,
		right : 14 * dp,
		font : styles.textfield.font,
		width : Ti.Platform.displayCaps.platformWidth - 28 * dp,
		paddingLeft : 10 * dp
	});
	viewSubject.add(text_f_Subject);

	// Message
	var viewMessage = Ti.UI.createView({
		height : Ti.UI.SIZE,
		selectionStyle : 'none'
	});

	var text_a_Message = Ti.UI.createTextArea({
		color : '#000',
		borderColor : styles.textarea.borderColor,
		borderWidth : 1 * dp,
		backgroundColor : 'transparent',
		height : styles.textarea.height,
		top : 14 * dp,
		hintText : 'message',
		left : 14 * dp,
		right : 14 * dp,
		font : styles.textfield.font,
		width : Ti.Platform.displayCaps.platformWidth - 28 * dp,
		paddingLeft : 10 * dp,
		zIndex : 7
	});
	viewMessage.add(text_a_Message);

	// Send Message
	var viewSendMessage = Ti.UI.createView({
		height : Ti.UI.SIZE
	});

	var btn_send_Message = Ti.UI.createView({
		backgroundColor : '#7eb162',
		height : styles.button.height,
		top : 34 * dp,
		left : 14 * dp,
		right : 14 * dp,
		width : Ti.Platform.displayCaps.platformWidth - 28 * dp,
		backgroundSelectedColor : styles.button.backgroundColor
	});

	var lbl_send_message = Ti.UI.createLabel({
		text : 'SEND MESSAGE',
		color : styles.button.color,
		font : styles.button.font,
		touchEnabled : false
	});
	btn_send_Message.add(lbl_send_message);

	viewSendMessage.add(btn_send_Message);

	OuterView.add(viewName);
	OuterView.add(viewEmail);
	OuterView.add(viewSubject);
	OuterView.add(viewMessage);
	OuterView.add(viewSendMessage);

}

function createContactLayout(context) {
	var OuterView = Ti.UI.createView({
		layout : 'vertical',
		top : 0,
		height : Ti.UI.SIZE,
		backgroundColor : styles.win.backgroundColor
	});
	createLayout(context, OuterView);

	// ==== SCROLL ==== //
	var scroll = Ti.UI.createScrollView({
		height : Ti.UI.SIZE,
		top : 48 * dp
	});
	scroll.add(OuterView);

	context.ContactWin.add(scroll);
}

function Contact(argument) {
	return this.init.apply(this, arguments);
}

Contact.prototype.init = function(argument, isFlyout) {
	var that = this;
	//this.winTitle = (argument != null) ? argument.menuItem.title : 'Contact';
	this.winTitle = (argument != null) ? argument.menuItem.title : '';
	if (isFlyout) {
		this.ContactWin = require('/ui/handheld/android/ParentView');
		this.ContactWin = new this.ContactWin();

		var lbl_title = Ti.UI.createLabel({
			text : this.winTitle,
			font : {
				fontSize : 18 * dp,
				fontFamily : 'Montserrat',
				fontWeight : 'Bold'
			},
			color : '#fff'
		});
		//this.ContactWin.headerView.add(lbl_title);
	} else {
		this.ContactWin = Ti.UI.createWindow({
			backgroundColor : styles.win.backgroundColor,
			zIndex : 20,
			exitOnClose : false,
			navBarHidden : true,
			orientationModes : [Ti.UI.PORTRAIT],
			//windowSoftInputMode : Titanium.UI.Android.SOFT_INPUT_ADJUST_UNSPECIFIED
		});
		this.ContactWin.add(globals.setHeaderBar(this.ContactWin, this.winTitle));
	}
	// CREATE FORM VIEW
	createContactLayout(this);

	return this.ContactWin;
};

module.exports = Contact;
