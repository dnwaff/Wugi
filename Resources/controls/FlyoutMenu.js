var globals = require('globals').Globals;
var styles = require('globals').Styles;
var _ = require('controls/underscore')._;
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");

function createMenuRows(item, context) {
	var tableRow = Ti.UI.createTableViewRow({
		// height : 45,
		// height : styles.flyout_menu_item.rowHeight,
		height : (item.isHeader == null) ? styles.flyout_menu_item.rowHeight : 42,
		backgroundColor : item.rowBackgroundColor,
		// selectedBackgroundColor : '#8c5e7a',
		selectedBackgroundColor : styles.flyout_menu_item.selectedBackgroundColor,
		touchEnabled : false,
		rowHeader:(item.isHeader == null) ? false : true
	});
	if(item.isHeader){
		var search = Titanium.UI.createSearchBar({
			icon: '/images/ic_search.png',
		    barColor:'#ccc', 
		    //showCancel:true,
		    hintText: 'Search Events and Venues',
		    height:46*dp,	   
		});
		search.addEventListener('focus',function (e){
			search.showCancel = true;
        });
        search.addEventListener('blur',function (e){
			search.showCancel = false;
         	//alert('blur');
        });      
		search.addEventListener('cancel',function (e){
			search.blur();
			search.showCancel = false;
        });
        search.addEventListener('return',function (e){
        	search.blur();
			search.showCancel = false;
			context.selectedIndex = 99;
			if(e.source.value.length < 2){
				alert('Please enter a longer search term.');
			}else{
				context.view.fireEvent('menu:selected', {
					    menuObj:globals.hiddenMenu[0],
					    searchVal: e.source.value
				});
			}
         	//alert(e.source.value);
         	search.value = '';
        });
        Ti.App.addEventListener('searchBlur', function(){
        	search.blur();
        });
		
		tableRow.add(search);
	}else{
		var icon_menu = Ti.UI.createImageView({
			image : item.icon,
			height : 32,
			width : 32,
			hires : true,
			left : 10
		});
		tableRow.add(icon_menu);
	
		var divider = Ti.UI.createView({
			height : styles.flyout_menu_item.rowHeight,
			width : 1,
			backgroundColor : styles.flyout_menu_item.verticalDividerColor,
			left : 20 + icon_menu.width,
			zIndex : 5
		});
		
		/*if (item.name != '_main_menu') {
			tableRow.add(divider);
		}*/
		
		var label = Ti.UI.createLabel(_.defaults({
			text : item.title,
			textAlign : 'left',
			left : 18 + divider.left,
			color : item.color,
			font : styles.flyout_menu_item.font
		}, styles.menuRows));
		tableRow.add(label);
	
		if (item.name != '_main_menu') {
			var img_right_disclosure = Ti.UI.createImageView({
				image : (item.subMenu) ? '/images/ic_arrow@2x.png' : '',
				height : 32,
				width : 32,
				right : 5
			});
			tableRow.add(img_right_disclosure);
		}
	
		var separator = Ti.UI.createView({
			height : 1,
			width : 260,
			backgroundColor : styles.flyout_menu_item.verticalDividerColor,
			bottom : 0,
			left: 20 + icon_menu.width,
			zIndex : 5
		});
		tableRow.add(separator);	
	}
	

	return tableRow;
}

function createSubTable(context, menuObj, newZindex){
	var zOffset = !newZindex ? 0 : newZindex;
	var submenu = menuObj.subMenu;
	var data = [];
	var subtable = Titanium.UI.createTableView({
		//backgroundColor : styles.flyout_menu.backgroundColor,
		top : (version == "7") ? 18 : 0,
		left : 275,
		width : 275,
		zIndex:2 + (zOffset),
		layout:'vertical',
		showVerticalScrollIndicator : false,
		scrollable : true,
		separatorStyle : 'none'
	});

	subtable.addEventListener('click', function(obj) {
		if(submenu[obj.index].name == '_back'){
				var animation = Titanium.UI.createAnimation();
				animation.left = 275;
				animation.duration = 250;
				this.animate(animation);
		}else if(submenu[obj.index].subMenu){
			context.selectedIndex = obj.index;
			context.view.fireEvent('menu:selected', {
				    menuObj:submenu[obj.index]
					//name : submenu[obj.index].name,
					//subMenu:submenu[obj.index].subMenu ? submenu[obj.index].subMenu :''
			});
		}else{
			
			context.view.fireEvent('hide', {});
			context.selectedIndex = obj.index;
			context.view.fireEvent('menu:selected', {
				menuObj:submenu[obj.index]
				//name : submenu[obj.index].name,
				//subMenu:submenu[obj.index].subMenu ? submenu[obj.index].subMenu :''
			});
			Ti.App.fireEvent('subHide');
		}
	});
	var goBackRow = Ti.UI.createView({
		backgroundColor : styles.flyout_menu.backgroundColor,
		height : styles.flyout_menu_item.rowHeight,
		parentTable:subtable
	});
	/*var icon_menu = Ti.UI.createImageView({
		image : data.iconAndroid,
		height : 32 * dp,
		width : 32 * dp,
		hires : true,
		left : 10 * dp
	});*/
	//goBackRow.add(icon_menu);
	var label = Ti.UI.createLabel({
		text : 'Back',
		textAlign : 'left',
		left : (18 * dp),
		font : styles.flyout_menu_item.font
	});
	goBackRow.add(label);

	var separator = Ti.UI.createView({
		height : 1 * dp,
		width : 290 * dp,
		backgroundColor : styles.flyout_menu_item.rowSeparatorColor,
		bottom : 0,
		zIndex : 5,
		left : 0
	});
	goBackRow.add(separator);
	//data.push(goBackRow);
	//subtable.add(goBackRow)
	
	Ti.App.addEventListener('subShow', function(e) {
		var menuName = e.name;
		var animation = Titanium.UI.createAnimation();
		animation.left = 0;
		animation.duration = 250;
		context.subTables[menuName].animate(animation);
	});
	Ti.App.addEventListener('subHide', function(e) {
		subtable.left = 275;
	});
	goBackRow.addEventListener('click', function(e) {
		var animation = Titanium.UI.createAnimation();
		animation.left = 275;
		animation.duration = 500;
		this.parentTable.animate(animation);
	});
	for (var i = 0; i < submenu.length; i++) {
		if(submenu[i].subMenu){
			var newZ = subtable.zIndex + (1);
			createSubTable(context, submenu[i], newZ);
		}
		var obj = {
			title : submenu[i].title,
		};
		var row = createMenuRows(submenu[i], context);
		data.push(row);
	};
	
	subtable.setData(data);

	context.subTables[menuObj.name] = subtable;
	context.view.add(subtable);
	
}

function FlyoutMenu(win) {
	return this.init.apply(this, arguments);
}

FlyoutMenu.prototype.init = function(args) {
	var that = this;
	this.selectedMenuItem = args;
	this.subTables = {};
	this.view = Ti.UI.createView({
		top : 0,
		left : 0,
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		backgroundColor : styles.flyout_menu.backgroundColor,
		zIndex : -1
	});

	var menuData = globals.menu;

	var rows = [];

	var tableView = Ti.UI.createTableView({
		left : 0,
		width : 275,
		top : (version == "7") ? 18 : 0,
		showVerticalScrollIndicator : false,
		scrollable : false,
		backgroundColor : styles.flyout_menu.backgroundColor,
		separatorStyle : 'none'
	});

	// HERE WE CREATE MENU ROWS IN THE TABLE
	_.each(menuData, function(item) {
		if(item.subMenu){
			createSubTable(that, item);
		}
		var tableRow = createMenuRows(item, that);
		tableRow.addEventListener('click', function(e) {
			if(!this.rowHeader){
				Ti.App.fireEvent('searchBlur');
			}
			this.fireEvent('menu:selected', {
				menuObj: item
				//name : item.name,
				//subMenu:item.subMenu ? item.subMenu :''
			});

		});
		rows.push(tableRow);
	});

	tableView.addEventListener('swipe', function(e) {
		if (e.direction == 'left') {
			this.fireEvent('menu:hide', {});
		}
	});
	
	// SET DATA IN THE TABLE
	tableView.setData(rows);
	// ADD VIEW IN THE PARENT VIEW
	this.view.add(tableView);
	// MAKE MENU TABLE A PROPERTY OF PARENT VIEW
	this.view.table = tableView;

	return this.view;
};

module.exports = FlyoutMenu;
