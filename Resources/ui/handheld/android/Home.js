Ti.include(Titanium.Filesystem.resourcesDirectory + "helpers/apiHelper.js");
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var globals = require('globals').Globals;
var styles = require('globals').Styles;

function createScrollableImages(context, Events) {
	var Views = [];

	var scrollableView = Ti.UI.createScrollableView({
		//showPagingControl : true,
		pagingControlColor : '#ccc',
		height : 215 * dp,
		// height : Ti.UI.SIZE,
		left : 14 * dp,
		right : 14 * dp,
		top : 0,
		zIndex : 4
	});

	for (var i = 0; i < Events.length; i++) {
		if(Events[i].feature == 2 || Events[i].feature == 3){
			
			var picture = Events[i].imageFeatureURL;

			var view = Ti.UI.createView({
				backgroundColor : 'transparent',
				height : Ti.UI.SIZE,
				info: Events[i]
			});
	
			// Create an ImageView.
			var anImageView = Ti.UI.createImageView({
				image : picture,
				//width : Ti.Platform.displayCaps.platformWidth,
				top:3 * dp,
				width : Ti.Platform.displayCaps.platformWidth - (2 * 14 * dp),
				height : styles.product_slider.height,
				borderRadius:5 * dp,
				hires : true
			});
			var lbl_title = Ti.UI.createLabel({
				text : Events[i].dayOfWeek+' | ' + Events[i].venue.name,
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				color : '#7eb162',
				//left : 0,
				font : styles.slider_title.font,
				top : styles.product_slider.height + (7*dp),
				height : Ti.UI.SIZE,
				wordWrap : true,
				info : Events[i]
			});

			view.add(anImageView);
			view.add(lbl_title);
			
			if(Events[i].feature == 3){
				var playButton = Ti.UI.createImageView({
					//height : 155 * dp,
					hires : true,
					preventDefaultImage : true,
					image : '/images/Play@2x.png',
					left : 15 * dp,
					top : 15 * dp,
					//width : (Ti.Platform.displayCaps.platformWidth - (42 * dp)) / 2,
					width : 30*dp,
					height: 30*dp,
					zIndex: 6
				});
				view.add(playButton);
			}
			
			view.addEventListener('touchmove',function(){
				//echo('tm')
				Ti.App.fireEvent('pauseSlider');
			});

			view.addEventListener('click', function(e) {
				if(this.info.feature == 3){
						
						var activeMovie = Titanium.Media.createVideoPlayer({
								url: this.info.videoURL,
								backgroundColor:'#000',
								movieControlStyle:Titanium.Media.VIDEO_CONTROL_DEFAULT,
								scalingMode:Titanium.Media.VIDEO_SCALING_MODE_FIT,
								fullscreen:true,
								autoplay:true,
								zIndex: 4
						});

						activeMovie.addEventListener('click',function(){
							if(this.playbackState == Titanium.Media.VIDEO_PLAYBACK_STATE_PLAYING ){
								this.pause();
							}else{
								this.play();
							}
							
						});
						activeMovie.addEventListener('complete',function(){
							
						});	
						var closeButton = Ti.UI.createButton({
							backgroundImage : '/images/close_btn.png',
					        top : "0dp",
					        height : "40dp",
					        width : "40dp",
					        right : "10dp"
					    });
					
					    closeButton.addEventListener('click', function() {
					        activeMovie.hide();
					        activeMovie.release();
					        activeMovie = null;
					    });
					    
					    activeMovie.add(closeButton);
					
				}else{
					var detailWin = require('/ui/handheld/android/EventDetail');
					detailWin = new detailWin(this.info);
					detailWin.open();
				}
				
			});
			
			Views.push(view);
		}
		
	};

	scrollableView.views = Views;
	function startSlideshow(Views) {
		var t = 0;
    	slideshow = setInterval(function(e) {
		    if(t >= Views.length) {
		        t = 0;
		    }
		    scrollableView.scrollToView(t);
		    t++;
		 
		}, 3000);
	}
	startSlideshow(Views);
	Ti.App.addEventListener('pauseSlider',function(){
		//echo('touch');
		clearInterval(slideshow);
		//setTimeout(startSlideshow(Views), 4000);
	});
	
	return scrollableView;
	//context.window.add(scrollableView);
}

function createEventView(context, event, position) {
	/*
	 * Event View
	 */
	var view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		bottom : 7 * dp,
		top : 0,
		left : position.left,
		//backgroundSelectedColor : styles.home_button.selectedBackgroundColor,
		//width : (Ti.Platform.displayCaps.platformWidth - (42 * dp)) / 2,
		width : (Ti.Platform.displayCaps.platformWidth - (14 * dp)) / 2,
		info : event
	});
	/*
	 * Event inner View
	 * We need this View in order to 
	 * add a padding for the Events View.
	 * This padding is visible when the Hover Effect 
	 * occur. 
	 */
	var inner_view = Ti.UI.createView({
		top: 0,
		right: 7 * dp,
		bottom : 7 * dp,
		left : 7 * dp,
		layout : 'vertical',
		height : Ti.UI.SIZE,
		info : event,
	});
	
	/*
	 * Hover effect
	 */
	/*view.addEventListener('touchstart', function(e) {
		view.backgroundColor = styles.home_button.selectedBackgroundColor;
	});

	view.addEventListener('touchcancel', function(e) {
		view.backgroundColor = 'transparent';
	});

	view.addEventListener('touchend', function(e) {
		view.backgroundColor = 'transparent';
	});
	*/
	/*
	 * Open Details window
	 */
	view.addEventListener('click', function(e) {
		var detailWin = require('/ui/handheld/android/EventDetail');
		detailWin = new detailWin(e.source.info);
		detailWin.open();
	});
	/*
	 * Image
	 */
	var image = Ti.UI.createImageView({
		height : 155 * dp,
		hires : true,
		preventDefaultImage : true,
		image : event.imageThumbURL,
		borderRadius: 5 * dp,
		left : 0,
		top : 0,
		width : (Ti.Platform.displayCaps.platformWidth - (42 * dp)) / 2,
		info : event
	});
	//view.add(image);
	inner_view.add(image);

	/*image.addEventListener('touchstart', function(e) {
		view.backgroundColor = styles.home_button.selectedBackgroundColor;
	});

	image.addEventListener('touchcancel', function(e) {
		view.backgroundColor = 'transparent';
	});

	image.addEventListener('touchend', function(e) {
		view.backgroundColor = 'transparent';
	});*/

	var info_view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		// top : 165 * dp,
		info : event
	});
	//view.add(info_view);
	inner_view.add(info_view);
	var lbl_day = Ti.UI.createLabel({
		text : event.dayOfWeek,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		//color : styles.feed_table_row_title.color,
		color : styles.feed_table_row_title.color,
		//left : 0,
		font : styles.feed_table_row_title.font,
		//top : 5 * dp,
		height : Ti.UI.SIZE,
		wordWrap : true,
		info : event
	});
	info_view.add(lbl_day);
	var lbl_title = Ti.UI.createLabel({
		text : event.venue.name,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color : '#7eb162',
		//left : 0,
		font : styles.feed_table_row_title.font,
		//top : 5 * dp,
		height : Ti.UI.SIZE,
		wordWrap : true,
		info : event
	});
	info_view.add(lbl_title);
	
	

	/*var tagView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'horizontal',
		left : 0,
		top : 0,
		info : event
	});
	info_view.add(tagView);

	for (var i = 0; i < event.tags.length; i++) {
		var lbl_tag = Ti.UI.createLabel({
			color : styles.feed_table_row_tags.color,
			font : styles.feed_table_row_tags.font,
			left : 0,
			info : event
		});
		if ((i + 1) == event.tags.length) {
			lbl_tag.text = event.tags[i];
		} else {
			lbl_tag.text = event.tags[i] + ', ';
		}

		tagView.add(lbl_tag);
	};

	var lbl_detail = Ti.UI.createLabel({
		text : (event.body.length > 37) ? event.body.substring(0, 37) + '...' : event.body,
		color : styles.feed_table_row_teaser.color,
		left : 0,
		right : 14 * dp,
		height : 35 * dp,
		top : 10 * dp,
		font : styles.feed_table_row_teaser.font,
		info : event
	});
	info_view.add(lbl_detail);*/
	
	view.add(inner_view);
	return view;
}

function createLayout(context, Events, OuterView) {
	var row;
	var _left = 7 * dp;
	for (var i = 0; i < Events.length; i++) {
		var view1 = createEventView(context, Events[i], {
			left : _left
		});
		if (i == 0) {
			row = Titanium.UI.createView({
				backgroundSelectedColor : 'transparent',
				height : Ti.UI.SIZE
			});
		}
		row.add(view1);
		if (((i - 1) % 2 == 0) || (i == Events.length - 1)) {
			_left = 7 * dp;
			OuterView.add(row);

			var divider = Ti.UI.createView({
				height : 1 * dp,
				width : Ti.Platform.displayCaps.platformWidth,
				backgroundColor : '#efefef'
			});
			//OuterView.add(divider);

			row = Titanium.UI.createView({
				backgroundSelectedColor : 'transparent',
				height : Ti.UI.SIZE
			});
		} else {
			//_left = (Ti.Platform.displayCaps.platformWidth / 2) + (7 * dp);
			_left = (Ti.Platform.displayCaps.platformWidth / 2);
		}
	}
}

function createScroll(context, Events) {
	var Slider = createScrollableImages(context, Events);
	var scroll = Ti.UI.createScrollView({
		height : 'auto',
		top : 48 * dp,
		width : Ti.Platform.displayCaps.platformWidth,
		backgroundColor : 'transparent'
	});

	var Divider = Ti.UI.createView({
		height : 1 * dp,
		top : ( 215 + 4 )* dp,
		width : Ti.Platform.displayCaps.platformWidth - (28 * dp),
		left: 14 * dp,
		right:14* dp,
		backgroundColor : '#EFEFEF'
	});
	var OuterView = Ti.UI.createView({
		height : 'auto',
		layout : 'vertical',
		top : ( 215 + 12 )* dp,
		width : Ti.Platform.displayCaps.platformWidth,
		backgroundColor : 'tranparent'
	});
	scroll.add(Slider);
	scroll.add(Divider);
	scroll.add(OuterView);

	createLayout(context, Events, OuterView);

	return scroll;
}

function Home(argument) {
	return this.init.apply(this, arguments);
}

Home.prototype.init = function(argument, isFlyout) {
	var that = this;

	this.HomeWin = require('/ui/handheld/android/ParentView');
	this.HomeWin = new this.HomeWin();
	this.indicator = Ti.UI.createActivityIndicator({
		style : Titanium.UI.ActivityIndicatorStyle.PLAIN
	});
	this.HomeWin.add(that.indicator);
	this.indicator.show();
	Ti.App.addEventListener('indicatorhide', function (event) {
		that.indicator.hide();
		//echo('hide');
	});
	this.tos = Ti.UI.createView({
		backgroundColor : 'transparent',
		backgroundImage: '/images/overlay.png',
		width : Ti.Platform.displayCaps.platformWidth,
		height : Ti.Platform.displayCaps.platformHeight,
		zIndex: 99,
	});
	
	
	// Create a WebView
	var tosView = Ti.UI.createView({
		backgroundColor:'#fff',
		borderRadius:8 *dp,
		left:14 * dp,
		right:14 * dp,
		top:24 * dp,
		bottom:24 * dp
	});
	
	// Create a Label.
	var tosTitle = Ti.UI.createLabel({
		text : 'Terms of Use',
		color : '#666',
		font : {fontSize:18 * dp},
		top : 14 * dp,
		textAlign : 'center'
	});
	var tosdivider = Ti.UI.createView({
		height : 1 * dp,
		top : 40* dp,
		left: 14 * dp,
		right:14* dp,
		backgroundColor : '#666'
	});
	
	// Create a WebView
	var tosWebView = Ti.UI.createWebView({
		top:42 * dp,
		bottom:52 * dp,
		left: 14 * dp,
		right: 14 * dp,
		url : 'http://wugi.us/appfiles/terms.html',
		softKeyboardOnFocus: Ti.Platform.osname == 'android' ? Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS : '',
	});
	
	// Add to the parent view.
	tosView.add(tosWebView);
	
	var tosdivider2 = Ti.UI.createView({
		height : 1 * dp,
		bottom : 50* dp,
		left: 14 * dp,
		right:14* dp,
		backgroundColor : '#666'
	});
	
	
	// Create a Button.
	var agreeBtn = Ti.UI.createButton({
		title : 'Accept',
		bottom:15 * dp,
		height:30 * dp,
		color:'#fff',
		backgroundColor: '#0a7ff8',
		left:14*dp,
		right:14*dp
	});
	
	// Listen for click events.
	agreeBtn.addEventListener('click', function() {
		Ti.App.Properties.setString('tos', 'accepted');
		that.HomeWin.remove(that.tos);
	});
	
	
	tosView.add(tosTitle);
	tosView.add(tosdivider);
	tosView.add(tosdivider2);
	tosView.add(agreeBtn);
	// Add to the parent view.
	this.tos.add(tosView);
	
	/*if (Titanium.Network.online) {
		// CREATE API CALL TO GET DATA FROM SERVICE
		var url = "http://highenergymedia.com/demo/wugi/events.json";
		APIGetRequest(url, function(e) {
			var status = this.status;
			if (status == '200') {
				//echo(status);
				Ti.App.fireEvent('indicatorhide');
				var Json = eval('(' + this.responseText + ')');
				if (Json.results.length > 0) {
					that.HomeWin.add(createScroll(that, Json.results));
				} else {
					alert('No events found');
				}
				
			}
		}, function(err) {
			Ti.App.fireEvent('indicatorhide');
			alert('Network Error. Please try again');
			
		});
	} else {
		Ti.App.fireEvent('indicatorhide');
		alert('No internet connection found');
	}*/
	if (Titanium.Network.online) {
		if(!Ti.App.Properties.getString('tos')){
			that.HomeWin.add(that.tos);
		}
		// CREATE API CALL TO GET DATA FROM SERVICE
		//Parse.com REST Queries syntax
		var td = new Date();
		var c_date = td.getDate();
		if(c_date < 10){
				c_date = "0" + c_date;
			}
		var c_month = td.getMonth() + 1;
		if(c_month < 10){
			c_month = "0" + c_month;
		}
		var c_year = td.getFullYear();
		var hour    = td.getHours();
			if(hour < 10){
				hour = "0" + hour;
			}
    		var minute  = td.getMinutes();
			var nDate = c_year + '-' + c_month + '-' + c_date+'T'+hour+':00:00.000Z';
			//echo(nDate)
		var query ='order=startDate&include=venue&where={"active":1,"endDate":{"$gt":{"__type":"Date","iso":"'+nDate+'"}},"$or":[{"feature":1},{"feature":2},{"feature":3}]}';
		//var query = 'where={"feature":1}';
		Parse.queryObjects('Event', query, function(e, response, status) {
			if (status == '200') {
				//echo(status);
				
				var Json = eval('(' + response + ')');
				if (Json.results.length > 0) {			
					that.HomeWin.add(createScroll(that, Json.results));
				} else {
					alert('No events found');
				}
				Ti.App.fireEvent('indicatorhide');	
			}else{
				Ti.App.fireEvent('indicatorhide');
				alert('Network Error. Please try again');
			}
			//echo(response);
			//var eventData = eval('(' + response + ')');
		});
		
	} else {
		Ti.App.fireEvent('indicatorhide');
		alert('No internet connection found');
	}

	var lbl_title = Ti.UI.createLabel({
		text : argument.menuItem.title,
		font : {
			fontSize : 18 * dp,
			fontFamily : 'Montserrat',
			fontWeight : 'Bold'
		},
		color : '#000'
	});
	this.HomeWin.headerView.add(lbl_title);
	//this.HomeWin.headerView.add(rightNavButton(this));
	// CREATE MENU VIEW
	//this.menuView = createRightMenu(this);
	//this.HomeWin.add(this.menuView);
	this.isMenuShown = false;
	//CREATE TABLE
	//create_Table(this);

	return this.HomeWin;

};

module.exports = Home;
