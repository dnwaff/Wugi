Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var globals = require('globals').Globals;
var styles = require('globals').Styles;

function createRow(context, data, index) {
	var headerHeight = 48 * dp;
	var tableRow = Ti.UI.createTableViewRow({
		backgroundColor : data.rowBackgroundColor,
		height : (data.isHeader == null) ? styles.flyout_menu_item.rowHeight : headerHeight,
		separatorStyle : 'none'
	});
	if(data.isHeader){
		var search = Titanium.UI.createSearchBar({
		    barColor:'#ccc', 
		    backgroundColor: '#FFF',
		    backgroundImage:'/images/Transparent.png',
        	backgroundRepeat:true,
		    showCancel:false,
		    icon: '/images/ic_search.png',
		    hintText: 'Search Events and Venues',
		    height:38*dp,
		    left:10 * dp,
		    right: 18 * dp
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
				context.menuView.fireEvent('menu:selected', {
					    menuItem:globals.hiddenMenu[0],
					    searchVal: e.source.value
				});
			}
			
         	
         	search.value = '';
        });
        Ti.App.addEventListener('searchBlur', function(){
        	search.blur();
        });
		
		tableRow.add(search);
	}else{
		var icon_menu = Ti.UI.createImageView({
			image : data.iconAndroid,
			height : 32 * dp,
			width : 32 * dp,
			hires : true,
			left : 10 * dp
		});
		tableRow.add(icon_menu);
	
		var divider = Ti.UI.createView({
			height : styles.flyout_menu_item.rowHeight,
			width : 1 * dp,
			backgroundColor : styles.flyout_menu_item.verticalDividerColor,
			left : (20 * dp) + icon_menu.width,
			zIndex : 5
		});
		//tableRow.add(divider);
	
		var label = Ti.UI.createLabel({
			text : data.title,
			textAlign : 'left',
			left : (18 * dp) + divider.left,
			color : data.color,
			// font : {
				// fontSize : 13 * dp,
				// fontFamily : 'Montserrat',
				// fontWeight : 'Regular'
			// }
			font : styles.flyout_menu_item.font
		});
		tableRow.add(label);
	
		if (data.name != '_main_menu') {
			var img_right_disclosure = Ti.UI.createImageView({
				image : (data.subMenu) ? '/images/ic_arrow@2x.png' : '',
				height : 32 * dp,
				width : 32 * dp,
				right : 10 * dp
			});
			tableRow.add(img_right_disclosure);
		}
	
		var separator = Ti.UI.createView({
			height : 1 * dp,
			width : 260 * dp,
			left: 52 * dp,
			backgroundColor : styles.flyout_menu_item.rowSeparatorColor,
			bottom : 0,
			zIndex : 5,
			left : 0
		});
		//tableRow.add(separator);
	}

	return tableRow;
};
function createTable(context) {
	var table = Titanium.UI.createTableView({
		backgroundColor : styles.flyout_menu.backgroundColor,
		top : 0,
		left : 0,
		width : Ti.UI.FILL,
		separatorStyle : 'none'
	});

	table.addEventListener('click', function(obj) {
		if(obj.index > 0){
			Ti.App.fireEvent('searchBlur');
		}
		if(globals.menu[obj.index].subMenu){
			context.selectedIndex = obj.index;
			context.menuView.fireEvent('menu:selected', {
					menuItem : globals.menu[obj.index]
			});
		}else{
			if (context.selectedIndex != obj.index) {
				context.menuView.fireEvent('hide', {});
				context.selectedIndex = obj.index;
				context.menuView.fireEvent('menu:selected', {
					menuItem : globals.menu[obj.index]
				});
	
			} else {
					context.menuView.fireEvent('hide', {});
				
			}
		}
	});

	table.addEventListener('swipe', function(e) {
		if (e.direction == 'left') {
	      context.tableView.fireEvent('hide', {});
	   }
	});
	
	return table;
}
function createSubTable(context, menuObj, newZindex){
	var zOffset = !newZindex ? 0 : newZindex;
	var submenu = menuObj.subMenu;
	var data = [];
	var subtable = Titanium.UI.createTableView({
		backgroundColor : styles.flyout_menu.backgroundColor,
		top : 0,
		left : Ti.Platform.displayCaps.platformWidth - (60 * dp),
		width : Ti.Platform.displayCaps.platformWidth - (60 * dp),
		zIndex:2 + (zOffset),
		layout:'vertical',
		separatorStyle : 'none'
	});

	subtable.addEventListener('click', function(obj) {
		if(submenu[obj.index].name == '_back'){
				var animation = Titanium.UI.createAnimation();
				animation.left = Ti.Platform.displayCaps.platformWidth - (60 * dp);
				animation.duration = 250;
				this.animate(animation);
		}else if(submenu[obj.index].subMenu){
			context.selectedIndex = obj.index;
			context.menuView.fireEvent('menu:selected', {
					menuItem : submenu[obj.index]
			});
		}else{
			
			context.menuView.fireEvent('hide', {});
			context.selectedIndex = obj.index;
			context.menuView.fireEvent('menu:selected', {
				menuItem : submenu[obj.index]
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
		subtable.left = Ti.Platform.displayCaps.platformWidth - (60 * dp);
	});
	goBackRow.addEventListener('click', function(e) {
		var animation = Titanium.UI.createAnimation();
		animation.left = Ti.Platform.displayCaps.platformWidth - (60 * dp);
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
		var row = createRow(context, submenu[i], i);
		data.push(row);
	};
	
	subtable.setData(data);

	context.subTables[menuObj.name] = subtable;
	context.menuView.add(subtable);
	
}
function createLayout(context) {
	for (var i = 0; i < globals.menu.length; i++) {
		if(globals.menu[i].subMenu){
			createSubTable(context, globals.menu[i]);
		}
		var obj = {
			title : globals.menu[i].title,
		};
		var row = createRow(context, globals.menu[i], i);
		context.data.push(row);
	};
	context.tableView.setData(context.data);
}

function Menu(data) {
	return this.init.apply(this, arguments);
}

Menu.prototype.init = function(args) {
	var that = this;
	this.data = [];
	this.subTables = {};
	this.animating = false;
	this.selectedIndex = 0;
	this.tableView = createTable(this);
	this.menuView = Titanium.UI.createView({
	   backgroundColor : styles.flyout_menu.backgroundColor,
	   width : Ti.Platform.displayCaps.platformWidth - (60 * dp),
	   height:Ti.Platform.displayCaps.platformHeight,
	   left:0, 
	   top:0
	});
	createLayout(this);
	
	
	this.menuView.add(this.tableView);
	
	return this.menuView;
};

module.exports = Menu;
