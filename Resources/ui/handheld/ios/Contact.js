var styles = require('globals').Styles;
var globals = require('globals').Globals;

function createLayout(context) {
	var data = [];
	var rowName = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 'none'
	});

	var text_f_name = Ti.UI.createTextField({
		color : styles.textfield.color,
		borderColor : styles.textfield.borderColor,
		height : styles.textfield.height,
		top : 14,
		hintText : 'name*',
		left : 14,
		right : 14,
		width : Ti.Platform.displayCaps.platformWidth - 28,
		font : styles.textfield.font,
		paddingLeft : 10
	});
	rowName.add(text_f_name);
	data.push(rowName);

	// EMAIL
	var rowEmail = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 'none'
	});

	var text_f_Email = Ti.UI.createTextField({
		color : styles.textfield.color,
		borderColor : styles.textfield.borderColor,
		height : styles.textfield.height,
		top : 14,
		hintText : 'email*',
		left : 14,
		right : 14,
		font : styles.textfield.font,
		width : Ti.Platform.displayCaps.platformWidth - 28,
		paddingLeft : 10
	});
	rowEmail.add(text_f_Email);
	data.push(rowEmail);

	// Subject
	var rowSubject = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 'none'
	});

	var text_f_Subject = Ti.UI.createTextField({
		color : styles.textfield.color,
		borderColor : styles.textfield.borderColor,
		height : styles.textfield.height,
		top : 14,
		hintText : 'subject*',
		left : 14,
		right : 14,
		font : styles.textfield.font,
		width : Ti.Platform.displayCaps.platformWidth - 28,
		paddingLeft : 10
	});
	rowSubject.add(text_f_Subject);
	data.push(rowSubject);

	// Message
	var rowMessage = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 'none'
	});

	var text_a_Message = Ti.UI.createTextArea({
		color : styles.textarea.color,
		borderColor : styles.textarea.borderColor,
		backgroundColor : 'transparent',
		height : styles.textarea.height,
		top : 14,
		hintText : 'message',
		left : 14,
		right : 14,
		font : styles.textfield.font,
		width : Ti.Platform.displayCaps.platformWidth - 28,
		paddingLeft : 10
	});
	rowMessage.add(text_a_Message);
	data.push(rowMessage);

	// Send Message
	var rowSendMessage = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 'none'
	});

	var btn_send_Message = Ti.UI.createView({
		backgroundColor : styles.button.backgroundColor,
		height : styles.button.height,
		top : 34,
		left : 14,
		right : 14,
		width : Ti.Platform.displayCaps.platformWidth - 28
	});

	btn_send_Message.addEventListener('touchstart', function(e) {
		btn_send_Message.backgroundColor = styles.button.backgroundSelectedColor;
	});

	btn_send_Message.addEventListener('touchcancel', function(e) {
		btn_send_Message.backgroundColor = styles.button.backgroundColor;
	});

	btn_send_Message.addEventListener('touchend', function(e) {
		btn_send_Message.backgroundColor = styles.button.backgroundColor;
	});

	var lbl_send_message = Ti.UI.createLabel({
		text : 'SEND MESSAGE',
		color : styles.button.color,
		font : styles.button.font,
		touchEnabled : false
	});
	btn_send_Message.add(lbl_send_message);

	rowSendMessage.add(btn_send_Message);
	data.push(rowSendMessage);

	return data;

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

function Contact(argument) {
	return this.init.apply(this, arguments);
}

Contact.prototype.init = function(argument, Info) {
	var that = this;
	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		barColor : styles.win.barColor,
		navTintColor : styles.navTintColor
	});
	this.window.setTitleControl(globals.setCustomTitle(Info.title));
	//
	create_Table(this);

	return this.window;
};

module.exports = Contact;
