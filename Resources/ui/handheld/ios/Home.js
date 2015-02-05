Ti.include(Titanium.Filesystem.resourcesDirectory + "helpers/apiHelper.js");
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var styles = require('globals').Styles;
var globals = require('globals').Globals;

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
			
			var picture = Events[i].imageThumbURL;
			var featurePicture = Events[i].imageFeatureURL;

			var view = Ti.UI.createView({
				backgroundColor : 'transparent',
				height : Ti.UI.SIZE,
				flyer: picture,
				info: Events[i]
			});
	
			// Create an ImageView.
			var anImageView = Ti.UI.createImageView({
				image : featurePicture,
				//width : Ti.Platform.displayCaps.platformWidth,
				top: 3 * dp,
				width : Ti.Platform.displayCaps.platformWidth - (2 * 14 * dp),
				height : styles.product_slider.height,
				hires : true,
				preventDefaultImage : true,
				borderRadius:5 * dp
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
						var winVideo = Titanium.UI.createWindow({
						    title:'Video Player',
						    backButtonTitle: 'Videos',
						    barColor: '#000',
						    backgroundColor:'#000'
						    //orientationModes:[Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]
						});
						var activeMovie = Titanium.Media.createVideoPlayer({
								url: this.info.videoURL,
								backgroundColor:'#000',
								mediaControlStyle:Titanium.Media.VIDEO_CONTROL_DEFAULT,
								scalingMode:Titanium.Media.VIDEO_SCALING_MODE_FIT,
								fullscreen:true,
								autoplay:true,
								zIndex: 6
						});
						winVideo.add(activeMovie);

						/*activeMovie.addEventListener('click',function(){
							if(this.playbackState == Titanium.Media.VIDEO_PLAYBACK_STATE_PLAYING ){
								this.pause();
							}else{
								this.play();
							}
							
						});*/
						activeMovie.addEventListener('complete', function(e){
						    if (e.reason == 0) {
						        //winVideo.close();
						    };
						});
						activeMovie.addEventListener('fullscreen', function(e){
						    if (e.entering == 0) {
						        winVideo.close();
						    };
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
					        winVideo.close();
					    });
					    
					    //activeMovie.add(closeButton);
					    winVideo.open();
					
				}else{
					var detailWin = require('/ui/handheld/ios/EventDetail');
					detailWin = new detailWin(context.navGroup, this.info, this.flyer);
					context.navGroup.openWindow(detailWin);
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
		bottom : 7,
		top : 7,
		left : position.left,
		width : 139 + 7 + 7,
	});

	/*
	 * Event inner View
	 * We need this View in order to 
	 * add a padding for the Events View.
	 * This padding is visible when the Hover Effect 
	 * occur. 
	 */
	var inner_view = Ti.UI.createView({
		top: 7,
		right: 7,
		bottom : 7,
		left : 7,
		layout : 'vertical',
		height : Ti.UI.SIZE,
		backgroundColor : styles.products_table_tile.backgroundColor,
		info : event
	});
	
	/*
	 * Hover effect
	 */
	/*inner_view.addEventListener('touchstart', function(e) {
		inner_view.backgroundColor = styles.products_table_tile.backgroundSelectedColor;
		view.backgroundColor = styles.products_table_tile.backgroundSelectedColor;
	});

	inner_view.addEventListener('touchcancel', function(e) {
		inner_view.backgroundColor = styles.products_table_tile.backgroundColor;
		view.backgroundColor = 'transparent';
	});

	inner_view.addEventListener('touchend', function(e) {
		inner_view.backgroundColor = styles.products_table_tile.backgroundColor;
		view.backgroundColor = 'transparent';
	});*/
	/*
	 * Open Details window
	 */
	inner_view.addEventListener('touchend', function(e) {
		var detailWin = require('/ui/handheld/ios/EventDetail');
		detailWin = new detailWin(context.navGroup, e.source.info, this.flyer);
		context.navGroup.openWindow(detailWin);
	});
	/*
	 * Image
	 */
	var image = Ti.UI.createImageView({
		top: 0,
		// height : 155,
		// height : 139,
		// width : 139,
		width : styles.products_table_row.imageWidth,
		height : styles.products_table_row.imageHeight,
		hires : true,
		preventDefaultImage : true,
		//touchEnabled : false,
		info : event,
		borderRadius:5 * dp
		
	});
	inner_view.add(image);

	var indicator = Ti.UI.createActivityIndicator({
		style : Ti.UI.iPhone.ActivityIndicatorStyle.DARK
	});
	image.add(indicator);
	indicator.show();

	APIGetRequestImage(event.imageURL, image, indicator, function(e) {
		var status = this.status;
		if (status == 200) {
			var image = e.source.imgView;
			image.setImage(this.responseData);
			inner_view.flyer = this.responseData;
			//alert(this.responseData);
			e.source.ind.hide();
		}
	});
	
	var info_view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		info : event
	});
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

	view.add(inner_view);
	return view;
}

function createRows(context, Events) {
	var tableRows = [];
	var row;
	var _left = 7;
	for (var i = 0; i < Events.length; i++) {
		var view1 = createEventView(context, Events[i], {
			left : _left
		});
		if (i == 0) {
			row = Titanium.UI.createTableViewRow({
				selectionStyle : 'none',
				height : Ti.UI.SIZE
			});
		}
		row.add(view1);
		if (((i - 1) % 2 == 0) || (i == Events.length - 1)) {
			_left = 7;
			tableRows.push(row);
			row = Titanium.UI.createTableViewRow({
				selectionStyle : 'none',
				height : Ti.UI.SIZE
			});
		} else {
			_left = (Ti.Platform.displayCaps.platformWidth / 2);

		}

	};

	return tableRows;

}

function createTable(context, Events) {
	var table = Ti.UI.createTableView({
		showVerticalScrollIndicator : false,
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
		separatorColor: 'transparent',
		height : 'auto',
		backgroundColor : 'transparent',
		top:215 * dp,
		scrollable: false
	});

	var rows = [];
	var totalRows = Math.ceil(Events.length / 2);
	rows = createRows(context, Events);

	table.setData(rows);

	return table;
}

function createScroll(context, Events) {
	var Slider = createScrollableImages(context, Events);
	var scroll = Ti.UI.createScrollView({
		height : 'auto',
		top : 0,
		width : Ti.Platform.displayCaps.platformWidth,
		backgroundColor : 'transparent'
	});

	var Divider = Ti.UI.createView({
		height : 1 * dp,
		top : ( 215 + 8 )* dp,
		width : Ti.Platform.displayCaps.platformWidth - (28 * dp),
		left: 14 * dp,
		right:14* dp,
		backgroundColor : '#EFEFEF'
	});

	scroll.add(Slider);
	scroll.add(Divider);
	scroll.add(createTable(context, Events));

	//createLayout(context, Events, OuterView);

	return scroll;
}
function Events(argument) {
	return this.init.apply(this, arguments);
}

Events.prototype.init = function(argument, Info) {
	var that = this;
	this.navGroup = argument;
	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		barColor : styles.win.barColor,
		navTintColor : styles.navTintColor
	});
	this.tos = Ti.UI.createWindow({
		backgroundColor : 'transparent',
		backgroundImage: '/images/overlay.png',
		barColor : styles.win.barColor,
		navTintColor : styles.navTintColor,
		zIndex:99
	});
	
	// Create a WebView
	var tosView = Ti.UI.createView({
		backgroundColor:'#fff',
		borderRadius:8 *dp,
		left:14 * dp,
		right:14 * dp,
		top:24 * dp,
		bottom:1 * dp,
		width : Ti.Platform.displayCaps.platformWidth - (28 * dp)
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
		url : 'http://wugi.us/appfiles/terms.html'
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
		Ti.App.Properties.setString('tos', 'accepted')
		that.tos.close();
	});
	
	
	tosView.add(tosTitle);
	tosView.add(tosdivider);
	tosView.add(tosdivider2);
	tosView.add(agreeBtn);
	
	
	
	// Add to the parent view.
	this.tos.add(tosView);
	
	this.window.setTitleControl(globals.setCustomTitle(Info.title));

	var indicator = Ti.UI.createActivityIndicator({
		style : Ti.UI.iPhone.ActivityIndicatorStyle.DARK
	});
	this.window.add(indicator);
	indicator.show();

	this.window.addEventListener('open', function(e) {
		if (Titanium.Network.online) {
		    if(!Ti.App.Properties.getString('tos')){
				that.tos.open();
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
					//alert(response);
					//echo(response)
					var Json = eval('(' + response + ')');
					if (Json.results.length > 0) {			
						that.window.add(createScroll(that, Json.results));
					} else {
						alert('No events found');
						
					}
					indicator.hide();	
				}else{
					indicator.hide();
					//Ti.App.fireEvent('indicatorhide');
					alert('Network Error. Please try again');
				}
				echo(response);
				//var eventData = eval('(' + response + ')');
			});
		} else {
			indicator.hide();
			//Ti.App.fireEvent('indicatorhide');
			alert('No internet connection found');
		}
	});

	return this.window;
};

module.exports = Events;
