var globals = require('globals').Globals;
var styles = require('globals').Styles;
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");

// ANIMATION FOR RIGHT MENU
var slide_in_top = Titanium.UI.createAnimation({
	top : (Ti.Platform.Android) ? 48 * dp : 0
});
var slide_out_top = Titanium.UI.createAnimation({
	top : (Ti.Platform.Android) ? -320 * dp : -320
});

function createRightMenu(context) {
	var OuterContainer = Ti.UI.createView({
		// backgroundColor : styles.right_menu.backgroundColor,
		width : Ti.UI.SIZE,
		top : -320 * dp,
		right : 0,
		zIndex : 14
	});

	var table = Ti.UI.createTableView({
		backgroundColor : 'transparent',
		top : 0,
		width : 175 * dp,
		right : 0,
		zIndex : 16,
		separatorStyle : 'none'
	});

	var data = [];

	for (var i = 0; i < globals.rightMenuItems.length; i++) {
		var row = Ti.UI.createTableViewRow({
			backgroundColor : styles.right_menu.backgroundColor,
			backgroundSelectedColor : styles.right_menu.selectedBackgroundColor,
			selectedBackgroundColor: styles.right_menu.selectedBackgroundColor,
			// height : 45 * dp,
			height : styles.right_menu.rowHeight,
			// width : 175 * dp
			width : styles.right_menu.width
		});

		row.addEventListener('click', function(e) {
			if (e.index == 3) {
				if (Ti.Platform.Android) {
					var SettingWin = require('/ui/handheld/android/Setting');
					SettingWin = new SettingWin(null, false);
					SettingWin.open();
				} else {
					var SettingWin = require('/ui/handheld/ios/Setting');
					SettingWin = new SettingWin(null, {
						title : 'Setting'
					});
					context.navGroup.openWindow(SettingWin);
				}
			}
			context.isMenuShown = false;
			context.menuView.animate(slide_out_top);
		});

		var lbl_title = Ti.UI.createLabel({
			text : globals.rightMenuItems[i].title,
			color : globals.rightMenuItems[i].color,
			left : 14 * dp,
			font : styles.right_menu.font,
			touchEnabled : false
		});
		row.add(lbl_title);

		var seprator = Ti.UI.createView({
			// top : 44 * dp,
			height : 1 * dp,
			// width : 175 * dp,
			width : styles.right_menu.width,
			// backgroundColor : '#343434',
			backgroundColor : styles.right_menu.rowSeparatorColor,
			bottom : 0,
			zIndex : 5
		});
		row.add(seprator);
		data.push(row);
	};
	// table.height = data.length * (45 * dp);
	table.height = data.length * styles.right_menu.rowHeight;
	// OuterContainer.height = data.length * (45 * dp);
	OuterContainer.height = data.length * styles.right_menu.rowHeight;
	table.setData(data);
	OuterContainer.add(table);

	return OuterContainer;

}

function rightNavButton(context) {
	var btn_right_menu = Ti.UI.createButton({
		width : 24 * dp,
		height : 16 * dp,
		image : '/images/icon_menu_right.png'
	});
	if (Titanium.Platform.Android) {
		btn_right_menu.backgroundImage = '/images/icon_menu_right@2x.png';
		btn_right_menu.image = '';
		btn_right_menu.right = 13 * dp;
	}

	btn_right_menu.addEventListener('click', function(e) {
		if (!context.isMenuShown) {
			context.menuView.animate(slide_in_top);
			context.isMenuShown = true;
		} else {
			context.isMenuShown = false;
			context.menuView.animate(slide_out_top);
		}
	});

	return btn_right_menu;
}

