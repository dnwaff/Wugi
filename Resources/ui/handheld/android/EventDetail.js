var globals = require('globals').Globals;
var styles = require('globals').Styles;
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
Ti.include(Titanium.Filesystem.resourcesDirectory + "calendar.js");
function createLayout(context) {
	
	var rowImage = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 'none',
		//layout : 'vertical',
		backgroundColor : 'transparent'
	});
	if(context.eData.videoURL){
		var indicator = Ti.UI.createActivityIndicator({
			style : Titanium.UI.ActivityIndicatorStyle.PLAIN,
			zIndex:10
		});
		
		rowImage.add(indicator);
		
		var promo = Titanium.Media.createVideoPlayer({
			url: context.eData.videoURL,
			backgroundColor:'#111',
			movieControlStyle:Titanium.Media.VIDEO_CONTROL_NONE,
			scalingMode:Titanium.Media.VIDEO_SCALING_MODE_FILL,
			top: 0,
			left: 0,
			width:Ti.Platform.displayCaps.platformWidth,
			height: 350*dp,
			autoplay:false,
			zIndex: 4
		});
		var promoThumb = Ti.UI.createImageView({
			//height : 155 * dp,
			hires : true,
			preventDefaultImage : true,
			image : context.eData.videoStillURL,
			left : 0,
			top : 0,
			//width : (Ti.Platform.displayCaps.platformWidth - (42 * dp)) / 2,
			width : Ti.Platform.displayCaps.platformWidth,
			height: 350*dp,
			zIndex: 5
		});
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
		playButton.addEventListener('click',function(){
			indicator.show();
			this.hide();
			promo.play();
		});
		promoThumb.addEventListener('click',function(){
			indicator.show();
			playButton.hide();
			promo.play();
		});
		promo.addEventListener('click',function(){
			if(this.playbackState == Titanium.Media.VIDEO_PLAYBACK_STATE_PLAYING ){
				this.pause();
				playButton.show();
			}else{
				playButton.hide();
				this.play();
			}
			
		});
		promo.addEventListener('complete',function(){
			promoThumb.show();
			playButton.show();
		});
		rowImage.add(promoThumb);
		rowImage.add(playButton);
		promo.addEventListener('playbackstate',function()
		{
			indicator.hide();
			promoThumb.hide();
		});
		
		//activeMovie.play();
		
		
	}else{
		var promo = Ti.UI.createImageView({
			//height : 155 * dp,
			hires : true,
			preventDefaultImage : true,
			image : context.eData.imageThumbURL,
			left : 0,
			top : 0,
			//width : (Ti.Platform.displayCaps.platformWidth - (42 * dp)) / 2,
			width : Ti.Platform.displayCaps.platformWidth
		});
	}
	rowImage.add(promo);
	var rowTitle = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 'none',
		layout : 'vertical',
		backgroundColor : 'transparent'
	});

	var lbl_name = Ti.UI.createLabel({
		text : context.eData.name,
		color : styles.detail_title.color,
		font : styles.detail_title.font,
		top : 0,
		left : 14 * dp,
		wordWrap : true,
		height : Ti.UI.SIZE
	});
	rowTitle.add(lbl_name);

	var rowVenue = Ti.UI.createTableViewRow({
		height : 'auto',
		selectionStyle : 'none',
		backgroundColor : 'transparent',
		layout:'vertical'
	});

	var lbl_venue = Ti.UI.createLabel({
		text : context.eData.venue.name,
		color : '#7eb162',
		left : 14 * dp,
		right : 14 * dp,
		wordWrap : true,
		font : styles.detail_title_2.font
	});
	lbl_venue.addEventListener('click',function(){
		var detailWin = require('/ui/handheld/android/VenueDetail');
		detailWin = new detailWin(context.eData.venue);
		detailWin.open();
	});
	var lbl_date = Ti.UI.createLabel({
		text : context.eData.dayOfWeek +' ' + formatDate(context.eData.startDate.iso),
		color : '#000',
		left : 14 * dp,
		right : 14 * dp,
		wordWrap : true,
		font : styles.detail_title_3.font
	});
	lbl_date.addEventListener('click',function(){
		var dialog = Ti.UI.createAlertDialog({
		    cancel: 0,
		    buttonNames: ['No', 'Yes'],
		    message: 'Add this event to your calendar?',
		    title: ''
		  });
		dialog.addEventListener('click', function(e){
		    if (e.index === e.source.cancel){
		      Ti.API.info('The cancel button was clicked');
		    }
		    if (e.index === 1){
		      addToCalendar(context.eData.startDate.iso, context.eData.endDate.iso, context.eData.name, context.eData.desc);
		      var dialog = Ti.UI.createAlertDialog({
			    message: 'This event has been added to your calendar',
			    ok: 'OK',
			    title: ''
			  }).show();
		    }
		    Ti.API.info('e.cancel: ' + e.cancel);
		    Ti.API.info('e.source.cancel: ' + e.source.cancel);
		    Ti.API.info('e.index: ' + e.index);
		 });
		 dialog.show();
	});
	
	var lbl_address = Ti.UI.createLabel({
		text : context.eData.venue.address[0],
		color : styles.detail_body.color,
		left : 14 * dp,
		right : 14 * dp,
		wordWrap : true,
		font : styles.detail_body.font
	});
	lbl_address.addEventListener('click',function(){
		var mapWin = require('/ui/handheld/android/Map');
		mapWin = new mapWin(context.eData.venue);
		mapWin.open();
	});
	var rowVenueCity = Ti.UI.createTableViewRow({
		height : 'auto',
		width:Ti.Platform.displayCaps.platformWidth,
		selectionStyle : 'none',
		backgroundColor : 'transparent',
		//layout:'horizontal'
	});
	var lbl_citystate = Ti.UI.createLabel({
		text : context.eData.venue.address[1],
		color : styles.detail_body.color,
		left : 14 * dp,
		//right : 14 * dp,
		wordWrap : true,
		font : styles.detail_body.font
	});
	lbl_citystate.addEventListener('click',function(){
		var mapWin = require('/ui/handheld/android/Map');
		mapWin = new mapWin(context.eData.venue);
		mapWin.open();
	});

	var lbl_distance = Ti.UI.createLabel({
		text : '',
		color : styles.detail_body.color,
		//left : 14 * dp,
		right : 14 * dp,
		wordWrap : true,
		font : styles.detail_body.font
	});
	var rowRSVP = Ti.UI.createTableViewRow({
		height : 'auto',
		selectionStyle : 'none',
		backgroundColor : 'transparent',
		layout:'vertical'
	});
	var lbl_rsvp = Ti.UI.createLabel({
		text : "RSVP/Tickets",
		color : '#7eb162',
		left : 14 * dp,
		right : 14 * dp,
		top: 8 * dp,
		wordWrap : true,
		url:context.eData.wugiURL,
		font : styles.detail_title_3.font
	});
	lbl_rsvp.addEventListener('click',function(){
		if(this.url){
			var webWin = require('/ui/handheld/android/WebView');
			webWin = new webWin(context.eData, this.url, "RSVP/Tickets");
			webWin.open();
		}
	});
	getDistance(context.eData.venue.geolocation.latitude, context.eData.venue.geolocation.longitude, lbl_distance, Ti.App.Properties.getString('units'));
	rowVenue.add(lbl_venue);
	rowVenue.add(lbl_date);
	rowVenue.add(lbl_address);
	rowVenueCity.add(lbl_citystate);
	rowVenueCity.add(lbl_distance);
	rowRSVP.add(lbl_rsvp);
	
	var rowDetail = Ti.UI.createTableViewRow({
		height : 'auto',
		selectionStyle : 'none',
		backgroundColor : 'transparent',
		layout:'vertical'
	});
	var lbl_desc_title = Ti.UI.createLabel({
		text : "Description",
		color : '#7eb162',
		left : 14 * dp,
		right : 14 * dp,
		top: 8 * dp,
		wordWrap : true,
		font : styles.detail_title_3.font
	});
	var divider_desc = Ti.UI.createView({
			height : 1 * dp,
			top : 0,
			left:14* dp,
			right:14 * dp,
			width : Ti.UI.FILL ,
			backgroundColor : '#000'
	});

	var lbl_desc = Ti.UI.createLabel({
		text : context.eData.desc,
		color : styles.detail_body.color,
		left : 14 * dp,
		right : 14 * dp,
		wordWrap : true,
		font : styles.detail_body.font
	});
	
	var lbl_theme_title = Ti.UI.createLabel({
		text : "Theme",
		color : '#7eb162',
		left : 14 * dp,
		right : 14 * dp,
		top: 8 * dp,
		wordWrap : true,
		font : styles.detail_title_3.font
	});
	var divider_theme = Ti.UI.createView({
			height : 1 * dp,
			top : 0,
			left:14* dp,
			right:14 * dp,
			width : Ti.UI.FILL ,
			backgroundColor : '#000'
	});
	var lbl_theme = Ti.UI.createLabel({
		text : context.eData.theme,
		color : styles.detail_body.color,
		left : 14 * dp,
		right : 14 * dp,
		wordWrap : true,
		font : styles.detail_body.font
	});
	var lbl_dresscode_title = Ti.UI.createLabel({
		text : "Dress Code",
		color : '#7eb162',
		left : 14 * dp,
		right : 14 * dp,
		top: 8 * dp,
		wordWrap : true,
		font : styles.detail_title_3.font
	});
	var divider_dresscode = Ti.UI.createView({
			height : 1 * dp,
			top : 0,
			left:14* dp,
			right:14 * dp,
			width : Ti.UI.FILL ,
			backgroundColor : '#000'
	});
	var dresscode = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout: 'vertical',
		left : 14 * dp,
		right : 14 * dp
	});
	for (var i = 0; i < context.eData.dressCode.length; i++) {
		var lbl_dresscode = Ti.UI.createLabel({
			text : i == 0 ? context.eData.dressCode[i] : '\u2022' +context.eData.dressCode[i], 
			left:0,
			color : styles.detail_body.color,
			wordWrap : true,
			font : styles.detail_body.font
		});
		dresscode.add(lbl_dresscode);
	}
	
	var lbl_age_title = Ti.UI.createLabel({
		text : "Age",
		color : '#7eb162',
		left : 14 * dp,
		right : 14 * dp,
		top: 8 * dp,
		wordWrap : true,
		font : styles.detail_title_3.font
	});
	var divider_age = Ti.UI.createView({
			height : 1 * dp,
			top : 0,
			left:14* dp,
			right:14 * dp,
			width : Ti.UI.FILL ,
			backgroundColor : '#000'
	});
	var lbl_age = Ti.UI.createLabel({
		text : context.eData.age,
		color : styles.detail_body.color,
		left : 14 * dp,
		right : 14 * dp,
		wordWrap : true,
		font : styles.detail_body.font
	});
	var rowMargin = Ti.UI.createTableViewRow({
		height : 30 * dp,
		backgroundColor : 'transparent'
	});
	rowDetail.add(lbl_desc_title);
	rowDetail.add(divider_desc);
	rowDetail.add(lbl_desc);
	rowDetail.add(lbl_theme_title);
	rowDetail.add(divider_theme);
	rowDetail.add(lbl_theme);
	rowDetail.add(lbl_dresscode_title);
	rowDetail.add(divider_dresscode);
	rowDetail.add(dresscode);
	rowDetail.add(lbl_age_title);
	rowDetail.add(divider_age);
	rowDetail.add(lbl_age);
	context.tableRows.push(rowImage);
	context.tableRows.push(rowTitle);
	context.tableRows.push(rowVenue);
	context.tableRows.push(rowVenueCity);
	if(context.eData.wugiURL){
		context.tableRows.push(rowRSVP);
	}
	context.tableRows.push(rowDetail);
	context.tableRows.push(rowMargin);

}

function create_Table(context) {
	var table = Ti.UI.createTableView({
		showVerticalScrollIndicator : false,
		height : 'auto',
		backgroundColor : 'transparent',
		separatorStyle : 'none',
		layout: 'vertical',
		//top : (238 + 10) * dp
		top: 48 * dp
	});

	return table;
}

function headerbar(context) {
	var view = Ti.UI.createView({
		height : 48 * dp,
		top : 0,
		backgroundColor : '#f8f8f8'
	});
	var headerLogo = Ti.UI.createImageView({
		image:'/images/Logo@2x.png',
		height: 40 * dp,
	});
	view.add(headerLogo);

	var btn_back = Ti.UI.createButton({
		backgroundImage : '/images/btn_back.png',
		height : 40 * dp,
		width : 40 * dp,
		left : 5 * dp,
		zIndex : 5
	});
	view.add(btn_back);

	btn_back.addEventListener('click', function(e) {
		context.window.close();
	});

	var lbl_title = Ti.UI.createLabel({
		text : context.eData.name,
		font : {
			fontSize : 18 * dp,
			fontFamily : 'Montserrat',
			fontWeight : 'Bold'
		},
		color : '#7eb162'
	});
	//view.add(lbl_title);

	var btn_share = Ti.UI.createButton({
		backgroundImage : '/images/android_share.png',
		height : 40 * dp,
		width : 40 * dp,
		right : 5 * dp,
		zIndex : 5
	});
	
	var intent = Ti.Android.createIntent({
        action: Ti.Android.ACTION_SEND,
        type:'text/plain'
	});
	var subject = 'What U Gettin Into?: ' + context.eData.name + ' @' + context.eData.venue.name;
	var message = 'What U Gettin Into?: ' + context.eData.name + ' @' + context.eData.venue.name + ' ' + context.eData.dayOfWeek + ' ' + formatDate(context.eData.startDate.iso) + ' ' +context.eData.venue.address[0] +' '+ context.eData.venue.address[1];
	
	
	intent.putExtra(Ti.Android.EXTRA_SUBJECT, subject);
	intent.putExtra(Ti.Android.EXTRA_TEXT, message);
	intent.addCategory(Ti.Android.CATEGORY_DEFAULT);

	btn_share.addEventListener('click', function(e) {	
    	Ti.Android.currentActivity.startActivity(intent);
	});
	view.add(btn_share);
	var divider = Ti.UI.createView({
			height: 1 * dp,
			width: Ti.Platform.displayCaps.platformWidth,
			backgroundColor: '#efefef',
			bottom: 0,
			zIndex: 5
		});
		view.add(divider);

	return view;
}

function EventDetail(argument) {
	return this.init.apply(this, arguments);
}

EventDetail.prototype.init = function(argument) {
	var that = this;
	this.eData = argument;

	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		zIndex : 20,
		exitOnClose : false,
		navBarHidden : true,
		orientationModes : [Ti.UI.PORTRAIT]
	});
	this.window.add(headerbar(this));

	this.window.addEventListener('open', function(e) {
		that.tableRows = [];
		var table = create_Table(that);
		createLayout(that);
		table.setData(that.tableRows);
		that.window.add(table);
	});

	this.window.addEventListener('androidback', function(e) {
		that.window.close();
	});

	return this.window;
};

module.exports = EventDetail;
