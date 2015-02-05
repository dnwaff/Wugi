var globals = require('globals').Globals;
var styles = require('globals').Styles;
var _ = require('controls/underscore')._;
Ti.include(Titanium.Filesystem.resourcesDirectory + "geolocation.js");

function leftMenuButton(context) {
	var btn_menu = Ti.UI.createButton({
		title : '',
		image : '/images/Menu.png',
	});

	btn_menu.addEventListener('click', function(e) {
		if (globals.menuVisible) {
			globals.menuVisible = false;
			context.navGroup.animate(Ti.UI.createAnimation(globals.animations.right));
			context.coverView.hide();
			Ti.App.fireEvent('searchBlur');
		} else {
			globals.menuVisible = true;
			context.navGroup.animate(Ti.UI.createAnimation(globals.animations.left));
			context.coverView.show();
		}
	});

	return btn_menu;

}


function ApplicationWindow() {
	return this.init.apply(this, arguments);
}

ApplicationWindow.prototype.init = function(events, venues) {
	globals.getData(events, venues);
	var that = this;
	// CREATE A WINDOW WHICH WILL HAVE THE MENU BUTTON
	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		zIndex:15
	});
	

	// CODE TO BE EXECUTED WHEN THIS WINDOW IS OPENED AT THE START
	this.window.addEventListener('open', function(e) {
		
		that.navGroup = Ti.UI.iOS.createNavigationWindow({
			left : 0
		});
		
		//CoverView used to disable window when menu is open
		that.coverView = Ti.UI.createView({
			backgroundColor : 'transparent',
			top:0,
			width : Ti.Platform.displayCaps.platformWidth,
			height : Ti.Platform.displayCaps.platformHeight,
			zIndex: 99,
			visible:false
		});
		that.coverView.addEventListener('touchstart',function(){		
			globals.menuVisible = false;
			that.navGroup.animate(Ti.UI.createAnimation(globals.animations.right));
			Ti.App.fireEvent('searchBlur');
			this.hide();			
		});

		var windows = {};
		var currentWindow = '_featured';
		var index = 0;
		_.each(globals.menu, function(item) {
			windows[item.name] = index++;
		});

		var currentWindowIndex = windows[currentWindow];
		var newWindow = new (require(globals.menu[currentWindowIndex].src))(that.navGroup, {
			title : globals.menu[currentWindowIndex].title,
			name : globals.menu[currentWindowIndex].name
		});
		var currentWindowObject = newWindow;
		newWindow.leftNavButton = leftMenuButton(that);
		that.coverView.visible = false;
		newWindow.add(that.coverView);
		that.navGroup.window = newWindow;
		that.navGroup.width = WIDTH;
		that.navGroup.open();

		that.window.add(that.navGroup);

		var FlyoutMenu = require('/controls/FlyoutMenu');
		var flyoutMenu = new FlyoutMenu(currentWindowIndex);
		that.window.add(flyoutMenu);

		globals.flyoutMenu = flyoutMenu;
		flyoutMenu.addEventListener('menu:selected', function(e) {
			if(e.menuObj.subMenu){
				Ti.App.fireEvent('subShow', {name:e.menuObj.name});
			}else if (e.menuObj.name == '_main_menu') {
				// DO NOTHING
			} else if (e.menuObj.name == '_share') {
				globals.openShare(that);
			} else if (e.menuObj.name == currentWindow && e.menuObj.name != '_search') {
				// HIDE THE MENU AFRER SELECTION
				globals.menuVisible = false;
				that.coverView.visible = false;
				var animation = Ti.UI.createAnimation(globals.animations.right);
				animation.addEventListener('complete', function(e) {
					that.navGroup.left = 0;
				});
				that.navGroup.animate(animation);
				
			} else {
				Ti.API.info('Current opened window is: ' + currentWindow);
				Ti.API.info('Selected window name: ' + e.menuObj.name);
				currentWindow = e.menuObj.name;
				var windowsIndex = windows[e.menuObj.name];
				Ti.API.info('Selected window Index: ' + windowsIndex);

				newWindow = new (require(e.menuObj.src))(that.navGroup, {
					title : e.menuObj.title,
					name : e.menuObj.name,
					menuItem: e.menuObj,
					searchVal: e.searchVal ? e.searchVal : ''
				});
				newWindow.leftNavButton = leftMenuButton(that);
				that.coverView.visible = false;
				newWindow.add(that.coverView);
				that.navGroup.left = 0;
				that.navGroup.openWindow(newWindow, {
					animated : true
				});
				that.navGroup.window = newWindow;
				 currentWindowObject = newWindow;
				// HIDE THE MENU AFRER SELECTION
				globals.menuVisible = false;
				var animation = Ti.UI.createAnimation(globals.animations.right);
				animation.addEventListener('complete', function(e) {
					that.navGroup.left = 0;
				});
				that.navGroup.animate(animation);

			}
		});

		flyoutMenu.addEventListener('menu:hide', function(e) {
			globals.menuVisible = false;
			var animation = Ti.UI.createAnimation(globals.animations.right);
			animation.addEventListener('complete', function(e) {
				that.navGroup.left = 0;
			});
			that.navGroup.animate(animation);
		});

		flyoutMenu.addEventListener('right:menu:selected', function(e) {
			Ti.API.info('Current opened window is: ' + currentWindow);
			Ti.API.info('Selected window name: ' + e.name);
			that.navGroup.close(currentWindowObject);
			Ti.API.info('Previously opened window closed');
			currentWindow = e.name;
			var windowsIndex = windows[e.name];
			Ti.API.info('Selected window Index: ' + windowsIndex);
			newWindow = new (require(globals.menu[windowsIndex].src))(that.navGroup, {
				title : globals.menu[windowsIndex].title,
				name : globals.menu[windowsIndex].name
			});
			newWindow.leftNavButton = leftMenuButton(that);
			currentWindowObject = newWindow;
			that.navGroup.open(newWindow, {
				animated : false
			});
			globals.menuVisible = false;
		});
	});

	return this.window;
};

module.exports = ApplicationWindow;
