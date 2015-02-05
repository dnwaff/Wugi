Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var globals = require('globals').Globals;
var styles = require('globals').Styles;
var Passbook = require("ti.passbook");
Ti.include(Titanium.Filesystem.resourcesDirectory + "passbook.js");
function rightButton(context, url) {
	var btn_right_menu = Ti.UI.createButton({
		width : 24 * dp,
		height : 16 * dp,
		title:'Browser'
	});

	btn_right_menu.addEventListener('click', function(e) {
		//Titanium.Platform.openURL(url);
		//Titanium.Platform.openURL('https://www.eventbrite.com/passes/312208415394673149001/12049911/?s=AH7gE4TR-WUxJJ0mJs2-1Xd0fhxIwi3S-w&src=order');
		var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "passes", "Lollipop.pkpass");
			try {
				Passbook.addPass({
					passData: file.blob
				});
			} catch(err) {
				Log(err);
			}
	});

	return btn_right_menu;
}

function WebView(argument) {
	return this.init.apply(this, arguments);
}

WebView.prototype.init = function(argument, data, url, windowTitle, isFlyout) {
	var that = this;
	this.navGroup = argument;
	this.webViewData = data;
	this.url = url;
	//this.winTitle = (argument != null) ? argument.menuItem.title : 'WebView';
	this.winTitle = windowTitle;
	this.indicator = Ti.UI.createActivityIndicator({
		style : Titanium.Platform.Android ? Titanium.UI.ActivityIndicatorStyle.PLAIN : Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
		zIndex:10
	});
	this.wv = Ti.UI.createWebView({
					url:that.url,
					height:'auto',
					width:'auto',
					top: 0
				});
	this.wv.addEventListener('load',function(){
		that.indicator.hide();
	});
	
	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		barColor : styles.win.barColor,
		navTintColor : styles.navTintColor,
		rightNavButton : rightButton(this, that.url),
		orientationModes : [Ti.UI.PORTRAIT]
	});
	//this.window.setTitleControl(globals.setCustomTitle('Event Details'));

	this.window.addEventListener('open', function(e) {
		this.add(that.indicator);
		that.indicator.show();
	});	
	
    this.window.addEventListener('close', function(){
    	//that.wv.pause();
    	that.wv.url = "about:blank";
    	that.wv.reload();
    	this.remove(that.wv);
    	//echo(that.wv.url);
    });
    /*Ti.App.addEventListener('windowClose', function (event) {
		that.wv.url = "about:blank";
    	that.WebViewWin.remove(that.wv);
    	echo(that.wv.url);
	});
	this.WebViewWin.addEventListener('android:back', function(e) {
		that.wv.url = "about:blank";
    	that.WebViewWin.remove(that.wv);
    	echo(that.wv.url);
    	this.close();
	});*/

	if (Titanium.Network.online) {
		
		
		this.window.add(that.wv);
		
	} else {
		that.indicator.hide();
		alert('No internet connection found');
		this.window.close();
	}

	return this.window;

};

module.exports = WebView;
