Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var globals = require('globals').Globals;
var styles = require('globals').Styles;

function WebView(argument) {
	return this.init.apply(this, arguments);
}

WebView.prototype.init = function(argument, url, windowTitle, isFlyout) {
	var that = this;
	this.webViewData = argument;
	this.url = url;
	//this.winTitle = (argument != null) ? argument.menuItem.title : 'WebView';
	this.winTitle = windowTitle;
	this.indicator = Ti.UI.createActivityIndicator({
		style : Titanium.UI.ActivityIndicatorStyle.PLAIN,
		zIndex:10
	});
	this.wv = Ti.UI.createWebView({
					url:that.url,
					height:'auto',
					width:'auto',
					top: 48 * dp,
					softKeyboardOnFocus: Ti.Platform.osname == 'android' ? Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS : '',
				});
		this.wv.addEventListener('load',function(){
			that.indicator.hide();
		});
	if (isFlyout) {
		this.WebViewWin = require('/ui/handheld/android/ParentView');
		this.WebViewWin = new this.WebViewWin();

		var lbl_title = Ti.UI.createLabel({
			color : '#ffffff',
			text : this.winTitle,
			font : {
				fontSize : 18 * dp,
				fontFamily : 'Montserrat',
				fontWeight : 'Bold'
			}
			
		});
		this.WebViewWin.add(that.indicator);
		that.indicator.show();
	
		//this.WebViewWin.headerView.add(lbl_title);
		
	} else {
		this.WebViewWin = Ti.UI.createWindow({
			backgroundColor : styles.win.backgroundColor,
			zIndex : 20,
			exitOnClose : false,
			navBarHidden : true,
			orientationModes : [Ti.UI.PORTRAIT]
		});
		this.headerView = globals.setHeaderBar(this.WebViewWin, this.winTitle);
		//this.headerView.add(rightNavButton(this));

		this.WebViewWin.add(this.headerView);
		this.WebViewWin.add(that.indicator);
		that.indicator.show();
	}
    this.WebViewWin.addEventListener('close', function(){
    	that.wv.pause();
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
		
		
		this.WebViewWin.add(that.wv);
		
	} else {
		that.indicator.hide();
		alert('No internet connection found');
		this.WebViewWin.close();
	}

	return this.WebViewWin;

};

module.exports = WebView;
