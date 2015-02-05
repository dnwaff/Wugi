Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var globals = require('globals').Globals;
var _ = require('/controls/underscore')._;
var styles = require('globals').Styles;

function headerbar(context,showLogo) {
	var view = Ti.UI.createView({
		height : 48 * dp,
		top : 0,
		// backgroundColor : '#232323'
		backgroundColor : '#f8f8f8'
	});
	if(showLogo){
		var headerLogo = Ti.UI.createImageView({
			image:'/images/Logo@2x.png',
			height: 40 * dp,
		});
		view.add(headerLogo);
	}
	

	// Create a Button.
	var btn_View = Ti.UI.createView({
		height : 48 * dp,
		width : 49 * dp,
		backgroundColor : 'transparent',
		left : 0
	});

	var aButton = Ti.UI.createButton({
		title : '',
		backgroundImage : '/images/Menu@2x.png',
		height : 16 * dp,
		width : 24 * dp
	});
	btn_View.add(aButton);

	// Listen for click events.
	btn_View.addEventListener('click', function() {
		if (globals.menuVisible) {
			Ti.App.fireEvent('searchBlur');
			globals.menuVisible = false;
			var animation = Titanium.UI.createAnimation();
			animation.left = 0;
			animation.duration = 100;
			context.parentView.animate(animation);
			context.parentView.coverView.hide();
		} else {
			globals.menuVisible = true;
			var animation = Titanium.UI.createAnimation();
			animation.left = Ti.Platform.displayCaps.platformWidth - 70 * dp;
			animation.duration = 100;
			context.parentView.animate(animation);
			context.parentView.coverView.show();
			//Ti.App.fireEvent('openMenu');
		}
	});

	// Add to the parent view.
	view.add(btn_View);
	
	var divider = Ti.UI.createView({
		height : 1 * dp,
		width : Ti.Platform.displayCaps.platformWidth,
		// backgroundColor : '#343434',
		backgroundColor : styles.win.separatorColor,
		bottom : 0,
		zIndex : 5
	});
	view.add(divider);

	return view;
}

function ParentView() {
	return this.init.apply(this, arguments);
}

ParentView.prototype.init = function(argument,showLogo) {
	var that = this;

	this.parentView = Ti.UI.createView({
		backgroundColor : styles.win.backgroundColor,
		barColor : styles.win.backgroundColor,
		width : Ti.Platform.displayCaps.platformWidth
	});
	Ti.App.addEventListener('hideMenu', function(){
			globals.menuVisible = false;
			var animation = Titanium.UI.createAnimation();
			animation.left = 0;
			animation.duration = 100;
			that.parentView.animate(animation);
	});
	//CoverView used to disable window when menu is open
	var coverView = Ti.UI.createView({
		backgroundColor : 'transparent',
		top:48*dp,
		width : Ti.Platform.displayCaps.platformWidth,
		height : Ti.Platform.displayCaps.platformHeight,
		zIndex: 99,
		visible:false
	});
	coverView.addEventListener('touchstart',function(){
		Ti.App.fireEvent('searchBlur');
		globals.menuVisible = false;
		var animation = Titanium.UI.createAnimation();
		animation.left = 0;
		animation.duration = 100;
		that.parentView.animate(animation);
		this.hide();
		
	});
	
	this.parentView.coverView = coverView;
	this.parentView.add(coverView);
	
	var headerView = headerbar(this,showLogo);
	this.parentView.headerView = headerView;
	this.parentView.add(headerView);
	
	
	
	
	return this.parentView;
};

module.exports = ParentView;
