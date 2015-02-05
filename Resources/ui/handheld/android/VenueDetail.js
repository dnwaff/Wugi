var globals = require('globals').Globals;
var styles = require('globals').Styles;
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
Ti.include(Titanium.Filesystem.resourcesDirectory + "picturegallery.js");
function showGalleryCovers(context, data, row){
	var view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : 8 * dp,
		layout: 'vertical'
	});
	var lbl_recent =  Ti.UI.createLabel({
		text : "Recent Photos",
		color : '#7eb162',
		left : 14 * dp,
		top: 8 * dp,
		wordWrap : true,
		font : styles.detail_title_3.font
	});
	var scrollableView = Ti.UI.createScrollView({
		//showPagingControl : true,
		//pagingControlColor : '#ccc',
		height : Ti.UI.SIZE,
		left : 14 * dp,
		right : 14 * dp,
		top : 8*dp,
		horizontalWrap : false,
		zIndex : 4,
	    contentHeight: Ti.UI.SIZE, // add this
	    contentWidth: Ti.UI.SIZE, // change this
	    layout: 'horizontal',
	    showHorizontalScrollIndicator: false,
	    showVerticalScrollIndicator: true, // should be a visual indication if can scroll
	    scrollType: 'horizontal',
	    width: Ti.UI.FILL // assuming you need it full width - if not specify a width
	});
	var Divider = Ti.UI.createView({
		height : 1 * dp,
		top : 1 * dp,
		left:14* dp,
		right:14 * dp,
		width : Ti.Platform.displayCaps.platformWidth ,
		backgroundColor : '#000'
	});
	/***Remove Duplicates***/
	var arr = {};
	for ( var i=0; i < data.length; i++ )
	    arr[data[i]['gallery']['objectId']] = data[i];	
	albums = new Array();
	for ( key in arr )
	    albums.push(arr[key]);
	/***End Remove Duplicates ***/
	for (var i = 0; i < albums.length; i++) {
		var photos = data.filter(function(el){
			return el.gallery.objectId == albums[i].gallery.objectId;
		});
		
		var view2 = Ti.UI.createView({
			height : Ti.UI.SIZE,
			layout:'vertical',
			right: 10 * dp,
			width : (Ti.Platform.displayCaps.platformWidth - (30 * dp)) / 3,
			index: i,
			info : photos,
			date: formatDate(albums[i].gallery.eventDate.iso)
		});
		var thumbView = Ti.UI.createImageView({
			height : 100 * dp,
			hires : true,
			preventDefaultImage : true,
			image : albums[i].gallery.cover,
			width: Ti.UI.FILL
		});
		var gal_name = Ti.UI.createLabel({
			text : albums[i].gallery.title,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : styles.feed_table_row_title.color,
			//left : 0,
			font : styles.feed_table_row_small_title.font,
			//top : 5 * dp,
			height : Ti.UI.SIZE,
			wordWrap : true
		});
		
		var gal_date = Ti.UI.createLabel({
			text : formatDate(albums[i].gallery.eventDate.iso),
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			//color : styles.feed_table_row_title.color,
			color : '#7eb162',
			//left : 0,
			font : styles.feed_table_row_small_title.font,
			//top : 5 * dp,
			height : Ti.UI.SIZE,
			wordWrap : true
		});
		view2.add(thumbView);
		view2.add(gal_name);
		view2.add(gal_date);
		
		view2.addEventListener('click', function(e) {
				var pictureGallery = PictureGallery.createWindow({
				  galDate:this.date,
				  images: this.info,
				  title:albums[this.index].gallery.title,
				  navBarHidden:true,
				  thumbGallery: {
				    numberOfColumnPortrait: 2,
				    numberOfColumnLandscape: 3,
				    thumbSize: 160,
				    thumbBorderColor: '#FFF',
				    thumbBorderWidth: 0,
				    thumbBackgroundColor: '#FFF',
				    thumbPadding: 3
				  },
				  scrollableGallery: {
				    labelColor: '#7eb162',
				    labelFont: {fontSize : 18 * dp, fontWeight : 'bold'},
				    barColor: '#000',
				    displayArrows: false,
				    displayCaption: true
				  }
				});
				pictureGallery.open();
				
			});
		scrollableView.add(view2);
	}
	view.add(lbl_recent);
	view.add(Divider);
	view.add(scrollableView);
	
	row.add(view);
}
function createGalleryThumbs(context, row){
	//var Views = [];
	
	if (Titanium.Network.online) {
		// CREATE API CALL TO GET DATA FROM SERVICE
		//Get all photos for this Venue
		var query ='include=gallery&where={"active":1,"venueid":"'+ context.eData.objectId +'"}';

		Parse.queryObjects('Photos', query, function(e, response, status) {
			if (status == '200') {
				//echo(status);
				//echo(response);
				var Json = eval('(' + response + ')');
				if (Json.results.length > 0) {			
					showGalleryCovers(context, Json.results, row);
				}
				//Ti.App.fireEvent('indicatorhide');	
			}else{
				//Ti.App.fireEvent('indicatorhide');
				alert('Network Error. Please try again');
			}
		});
	} else {
		//Ti.App.fireEvent('indicatorhide');
		alert('No internet connection found');
	}
}

function createLayout(context) {
	
	var rowImage = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		selectionStyle : 'none',
		layout : 'vertical',
		backgroundColor : 'transparent'
	});
	var flyer = Ti.UI.createImageView({
		//height : 155 * dp,
		hires : true,
		preventDefaultImage : true,
		image : context.eData.imageURL,
		left : 40 * dp,
		right : 40 * dp,
		top : 0,
		//width : (Ti.Platform.displayCaps.platformWidth - (42 * dp)) / 2,
		width : Ti.Platform.displayCaps.platformWidth - (80 *dp)
	});
	rowImage.add(flyer);
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

	var lbl_address = Ti.UI.createLabel({
		text : context.eData.address[0],
		color : styles.detail_body.color,
		left : 14 * dp,
		right : 14 * dp,
		wordWrap : true,
		font : styles.detail_body.font
	});
	lbl_address.addEventListener('click',function(){
		var mapWin = require('/ui/handheld/android/Map');
		mapWin = new mapWin(context.eData);
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
		text : context.eData.address[1],
		color : styles.detail_body.color,
		left : 14 * dp,
		//right : 14 * dp,
		wordWrap : true,
		font : styles.detail_body.font
	});
	lbl_citystate.addEventListener('click',function(){
		var mapWin = require('/ui/handheld/android/Map');
		mapWin = new mapWin(context.eData);
		mapWin.open();
	});
	var lbl_phone = Ti.UI.createLabel({
		text : context.eData.phoneNumber,
		color : styles.detail_body.color,
		left : 14 * dp,
		right : 14 * dp,
		wordWrap : true,
		font : styles.detail_body.font
	});
	lbl_phone.addEventListener('click',function(){
		var the_number = this.text;
		Ti.Platform.openURL('tel:'+the_number); // Correct Line
	});
	var rowContact = Ti.UI.createTableViewRow({
		height : 'auto',
		selectionStyle : 'none',
		backgroundColor : 'transparent',
		layout:'vertical'
	});
	var lbl_website = Ti.UI.createLabel({
		text : 'Visit Website',
		left : 14 * dp,
		right : 14 * dp,
		wordWrap : true,
		url:context.eData.siteURL,
		font : styles.detail_body.font,
		color : '#7eb162'
	});
	lbl_website.addEventListener('click',function(){
		if(this.url){
			var webWin = require('/ui/handheld/android/WebView');
			webWin = new webWin(context.eData, this.url, "Venue Website");
			webWin.open();
		}
	});
	var lbl_distance = Ti.UI.createLabel({
		text : '',
		color : styles.detail_body.color,
		//left : 14 * dp,
		right : 14 * dp,
		wordWrap : true,
		font : styles.detail_body.font
	});
	getDistance(context.eData.geolocation.latitude, context.eData.geolocation.longitude, lbl_distance, Ti.App.Properties.getString('units'));
	rowVenue.add(lbl_address);
	rowVenueCity.add(lbl_citystate);
	rowVenueCity.add(lbl_distance);
	rowContact.add(lbl_phone);
	rowContact.add(lbl_website);
	if(context.eData.recentPhotos){
		var rowGalleryThumbs = Ti.UI.createTableViewRow({
			//height : 200 * dp,
			height: 'auto',
			selectionStyle : 'none',
			layout : 'vertical',
			backgroundColor : 'transparent'
		});
		
		createGalleryThumbs(context, rowGalleryThumbs);
	}
	var rowDetail = Ti.UI.createTableViewRow({
		height : 'auto',
		selectionStyle : 'none',
		backgroundColor : 'transparent',
		layout:'vertical'
	});
	var lbl_type_title = Ti.UI.createLabel({
		text : "Type",
		color : '#7eb162',
		left : 14 * dp,
		right : 14 * dp,
		top: 8 * dp,
		wordWrap : true,
		font : styles.detail_title_3.font
	});
	var divider_type = Ti.UI.createView({
			height : 1 * dp,
			top : 0,
			left:14* dp,
			right:14 * dp,
			width : Ti.UI.FILL ,
			backgroundColor : '#000'
	});

	var lbl_type = Ti.UI.createLabel({
		text : context.eData.type,
		color : styles.detail_body.color,
		left : 14 * dp,
		right : 14 * dp,
		wordWrap : true,
		font : styles.detail_body.font
	});
	
	var lbl_neighborhood_title = Ti.UI.createLabel({
		text : "Neighborhood",
		color : '#7eb162',
		left : 14 * dp,
		right : 14 * dp,
		top: 8 * dp,
		wordWrap : true,
		font : styles.detail_title_3.font
	});
	var divider_neighborhood = Ti.UI.createView({
			height : 1 * dp,
			top : 0,
			left:14* dp,
			right:14 * dp,
			width : Ti.UI.FILL ,
			backgroundColor : '#000'
	});
	var lbl_neighborhood = Ti.UI.createLabel({
		text : context.eData.neighborhood,
		color : styles.detail_body.color,
		left : 14 * dp,
		right : 14 * dp,
		wordWrap : true,
		font : styles.detail_body.font
	});
	var lbl_parking_title = Ti.UI.createLabel({
		text : "Parking",
		color : '#7eb162',
		left : 14 * dp,
		right : 14 * dp,
		top: 8 * dp,
		wordWrap : true,
		font : styles.detail_title_3.font
	});
	var divider_parking = Ti.UI.createView({
			height : 1 * dp,
			top : 0,
			left:14* dp,
			right:14 * dp,
			width : Ti.UI.FILL ,
			backgroundColor : '#000'
	});

	var parking = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout: 'vertical',
		left : 14 * dp,
		right : 14 * dp
	});
	for (var i = 0; i < context.eData.parking.length; i++) {
		var lbl_parking = Ti.UI.createLabel({
			text : '\u2022' +context.eData.parking[i], 
			left:0,
			color : styles.detail_body.color,
			wordWrap : true,
			font : styles.detail_body.font
		});
		parking.add(lbl_parking);
	}
	if(context.eData.features || context.eData.servesFood){	
		var lbl_features_title = Ti.UI.createLabel({
			text : "Features",
			color : '#7eb162',
			left : 14 * dp,
			right : 14 * dp,
			top: 8 * dp,
			wordWrap : true,
			font : styles.detail_title_3.font
		});
		var divider_features = Ti.UI.createView({
				height : 1 * dp,
				top : 0,
				left:14* dp,
				right:14 * dp,
				width : Ti.UI.FILL ,
				backgroundColor : '#000'
		});
		var features = Ti.UI.createView({
			height : Ti.UI.SIZE,
			layout: 'vertical',
			left : 14 * dp,
			right : 14 * dp
		});
		if(context.eData.features){
			for (var i = 0; i < context.eData.features.length; i++) {
				var lbl_features = Ti.UI.createLabel({
					text : '\u2022' +context.eData.features[i], 
					left:0,
					color : styles.detail_body.color,
					wordWrap : true,
					font : styles.detail_body.font
				});
				features.add(lbl_features);
			}
		}
		if(context.eData.servesFood){
			var lbl_food = Ti.UI.createLabel({
					text : '\u2022' +'Serves Food', 
					left:0,
					color : styles.detail_body.color,
					wordWrap : true,
					font : styles.detail_body.font
				});
				features.add(lbl_food);
		}
	}
	var rowMargin = Ti.UI.createTableViewRow({
		height : 30 * dp,
		backgroundColor : 'transparent'
	});
	rowDetail.add(lbl_type_title);
	rowDetail.add(divider_type);
	rowDetail.add(lbl_type);
	rowDetail.add(lbl_neighborhood_title);
	rowDetail.add(divider_neighborhood);
	rowDetail.add(lbl_neighborhood);
	rowDetail.add(lbl_parking_title);
	rowDetail.add(divider_parking);
	rowDetail.add(parking);
	if(context.eData.features || context.eData.servesFood){	
		rowDetail.add(lbl_features_title);
		rowDetail.add(divider_features);
		rowDetail.add(features);
	}
	context.tableRows.push(rowImage);
	context.tableRows.push(rowTitle);
	context.tableRows.push(rowVenue);
	context.tableRows.push(rowVenueCity);
	context.tableRows.push(rowContact);
	if(context.eData.recentPhotos){
		context.tableRows.push(rowGalleryThumbs);
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
	var subject = 'What U Gettin Into? Check out this venue: ' + context.eData.name;
	var message = 'What U Gettin Into? Check out this venue I just discovered using WUGI:' + context.eData.name +' ' + context.eData.address[0] + ' '+ context.eData.address[1] +' '+ context.eData.phoneNumber
	
	
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

function VenueDetail(argument) {
	return this.init.apply(this, arguments);
}

VenueDetail.prototype.init = function(argument, offset) {
	var that = this;
	this.eData = argument;
	this.offset = offset;
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
		if(that.offset){
			table.scrollToTop(7);
		}	
	});

	this.window.addEventListener('androidback', function(e) {
		that.window.close();
	});

	return this.window;
};

module.exports = VenueDetail;
