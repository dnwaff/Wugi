Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var globals = require('globals').Globals;
Ti.include(Titanium.Filesystem.resourcesDirectory + "geolocation.js");
//Titanium.Geolocation.purpose = "Recieve User Location";
//Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
//Titanium.Geolocation.distanceFilter = 10;

function shareApp(){
	var intent = Ti.Android.createIntent({
        action: Ti.Android.ACTION_SEND,
        type:'text/plain'
	});
	var subject = "What U Gettin Into? Check out WUGI";
	var message = 'What U Getting Into? Check out WUGI ! It allows me to discover the best events and venues in the city. Find it @ www.wugi.me';
	
	intent.putExtra(Ti.Android.EXTRA_SUBJECT, subject);
	intent.putExtra(Ti.Android.EXTRA_TEXT, message);
	intent.addCategory(Ti.Android.CATEGORY_DEFAULT);

	Ti.Android.currentActivity.startActivity(intent);
}
function ApplicationWindow(events, venues) {
	
	globals.getData(events, venues);
	var that = this;
	//this.parentWin = args;

	this.win2open = null;

	var FlyoutMenu = require('/controls/MenuView');

	this.self = Ti.UI.createWindow({
		navBarHidden : true,
		backgroundColor : '#fff',
		orientationModes : [Ti.UI.PORTRAIT],
		exitOnClose : true
	});

	this.self.addEventListener('android:back', function(e) {
		if (globals.navWindows.length == 0) {
			that.self.close();
		} else if (globals.navWindows.length > 0) {
			var length = globals.navWindows.length;
			for (var i = 0; i < length; i++) {
				globals.navWindows.pop();
			};
			//that.flyoutMenu.fireEvent('menu:selected', globals.navWindows[globals.navWindows.length - 1]);
		}
	});

	this.flyoutMenu = new FlyoutMenu(0);
	Ti.App.flyoutMenu = this.flyoutMenu;

	this.flyoutMenu.addEventListener('show', function(e) {
		var animation = Titanium.UI.createAnimation();
		animation.left = 0;
		animation.duration = 500;
		that.flyoutMenu.animate(animation);
		globals.menuVisible = true;
	});

	this.flyoutMenu.addEventListener('hide', function(e) {
		var animation = Titanium.UI.createAnimation();
		animation.left = 0;
		animation.duration = 500;
		that.win2open.animate(animation);
		globals.menuVisible = false;
	});

	this.self.add(this.flyoutMenu);

	var last_window;
	this.flyoutMenu.addEventListener('menu:selected', function(e) {

		// var toast = Ti.UI.createNotification({
		// message : e.menuItem.name,
		// duration : Ti.UI.NOTIFICATION_DURATION_LONG
		// });
		// toast.show();
		if(e.menuItem.subMenu){
			Ti.App.fireEvent('subShow', {name:e.menuItem.name});
		}else if (e.menuItem.name == '_main_menu') {
			// DO NOTHING
		}else if (e.menuItem.name == '_share') {
			shareApp();
		} else {
			if (that.win2open) {
				//that.flyoutMenu.fireEvent('hide', {});
			}
			var last_opened_window = null;
			if (that.win2open) {
				last_opened_window = that.win2open;
				that.win2open = null;
			}

			var win_path = undefined;
			win_path = e.menuItem.src;
			var dataToPass = {
				menuItem : e.menuItem,
				searchVal: e.searchVal ? e.searchVal : ''
			};
			var NewWindow = require(win_path);
			that.win2open = new NewWindow(dataToPass, true);
			that.win2open.zIndex = 5;
			that.self.add(that.win2open);

			if (last_opened_window) {
				setTimeout(function(e) {
					that.self.remove(last_opened_window);
				}, 1000);
			}

			// Add window source to Stack
			globals.navWindows.push({
				src : e.menuItem.src
			});

			last_window = e.menuItem.src;
		}
	});

	// MENU SELECTION FIRED FOR THE FIRST TIME MANUALLY
	// TO OPEN THE FIRST VIEW IN THE MENU LIST.
	// FOR EXAMPLE HOME IS OUR FIRST VIEW IN MENU
	this.flyoutMenu.fireEvent('menu:selected', {
		menuItem : globals.menu[1]
	});

	return this.self;
};
module.exports = ApplicationWindow;
