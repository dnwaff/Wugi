Ti.include(Titanium.Filesystem.resourcesDirectory + "helpers/apiHelper.js");
Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var globals = require('globals').Globals;
var styles = require('globals').Styles;

function removeFirstChild(obj) {
	if(obj.children.length){
		obj.remove(obj.children[0]);
	}
}

function createScrollableCalendar(context, Events) {
	//var Views = [];
	var view = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : 48 * dp,
		layout: 'vertical',
		backgroundColor:'#f8f8f8'
	});
	var scrollableView = Ti.UI.createScrollView({
		//showPagingControl : true,
		//pagingControlColor : '#ccc',
		height : 67 * dp,
		// height : Ti.UI.SIZE,
		left : 14 * dp,
		right : 14 * dp,
		top : 0,
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
		top : 0 * dp,
		width : Ti.Platform.displayCaps.platformWidth ,
		backgroundColor : '#EFEFEF'
	});
	
	for (var i = 0; i < 7; i++) {
		var d = new Date();
		d.setDate(d.getDate() + i); 
		thisDate = d.getDate();
		var dayName = dayOfWeek[d.getDay()];
		dayName = dayName.substring(0,3);
		dayName = dayName.toUpperCase();
		
		var view2 = Ti.UI.createView({
				backgroundImage : i == 0 ? '/images/GreenCircle@2x.png':'/images/Transparent.png',
				height : 35 * dp,
				width: 35 * dp,
				bottom:2 * dp,
				info: d
			});
		
		var lbl_day = Ti.UI.createLabel({
			  color: i == 0 ? '#7eb162' :'#000',
			  font: { fontSize:15 * dp },
			  //shadowColor: '#aaa',
			  //shadowOffset: {x:5, y:5},
			  //shadowRadius: 3,
			  text: dayName,
			  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			  top: 3 * dp,
			  width: Ti.UI.SIZE, 
			  height: Ti.UI.SIZE
			});
		var view3 = Ti.UI.createView({
				height : 67 * dp,
				width: 40 * dp,
				left: 8 * dp,
				dateHolder: view2,
				info: d
			});
			view3.add(lbl_day);
		var label1 = Ti.UI.createLabel({
			  color: i == 0 ? '#FFF' :'#000',
			  font: { fontSize:16 * dp },
			  //shadowColor: '#aaa',
			  //shadowOffset: {x:5, y:5},
			  //shadowRadius: 3,
			  text: thisDate,
			  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			  top: 5*dp,
			  width: Ti.UI.SIZE, 
			  height: Ti.UI.SIZE
			});
		view2.index = i;
		view2.label = label1;
		view2.add(label1);
		view3.addEventListener('click', function(e) {
				//context.UpcomingWin.scrollHolder.remove(scroll);
				
				for (n = 0; n < scrollableView.children.length ; n++) {
			        scrollableView.children[n].dateHolder.backgroundImage = '/images/Transparent.png';
			        if(n == 0){
			        	scrollableView.children[n].dateHolder.label.color = '#7eb162';
			        }else{
			        	scrollableView.children[n].dateHolder.label.color = '#000';
			        }
			        
			    }

				if(this.dateHolder.index == 0){
					this.dateHolder.backgroundImage = '/images/GreenCircle@2x.png';
				}else{
					this.dateHolder.backgroundImage = '/images/BlackCircle@2x.png';
				}
				this.dateHolder.label.color = '#FFF';
				Ti.App.fireEvent('moveScroll', {slideIndex:this.dateHolder.index});
			});
		view3.add(view2);
		scrollableView.add(view3);
	}
	
	view.add(scrollableView);
	Ti.App.addEventListener('setCalendarDate',function(e){
		var thisDate = scrollableView.children[e.activeDate].dateHolder;
		for (n = 0; n < scrollableView.children.length ; n++) {
	        scrollableView.children[n].dateHolder.backgroundImage = '/images/Transparent.png';
	        if(n == 0){
	        	scrollableView.children[n].dateHolder.label.color = '#7eb162';
	        }else{
	        	scrollableView.children[n].dateHolder.label.color = '#000';
	        }
	        
	    }
		if(thisDate.index == 0){
			thisDate.backgroundImage = '/images/GreenCircle@2x.png';
		}else{
			thisDate.backgroundImage = '/images/BlackCircle@2x.png';
		}
		thisDate.label.color = '#FFF';
	});
	view.add(Divider);
	return view;
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
		borderRadius:5 * dp,
		left : 0,
		top : 0,
		width : (Ti.Platform.displayCaps.platformWidth - (42 * dp)) / 2,
		info : event
	});
	//view.add(image);
	inner_view.add(image);

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
	
	
	
	view.add(inner_view);
	return view;
}

function createLayout(context, Events, OuterView, dateSelected) {
	var row;
	var _left = 7 * dp;
	var date = dateSelected;
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var dayName = dayOfWeek[date.getDay()];
	var year = date.getFullYear();
	var today = new Date();
	var UpcomingEvents = [];
	
	var lbl_fullDate = Ti.UI.createLabel({
		text : dayName + ' ' +  formatDate(dateSelected),
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		color : '#ccc',
		font : {
				fontSize : 18 * dp
			},
		height : Ti.UI.SIZE,
		top: 10 * dp, 
		wordWrap : true
	});
	
	//OuterView.add(lbl_fullDate);
	
	for (var i = 0; i < Events.length; i++) {
		var eventDate = new Date(Events[i].startDate.iso);
		if(month == (eventDate.getMonth() + 1) && day == eventDate.getDate() && year == eventDate.getFullYear()){
			UpcomingEvents.push(Events[i]);
		}
	}
	
	if(!UpcomingEvents.length){
		//echo('No events listed for this date.')
		var lbl_none = Ti.UI.createLabel({
			text : "No events listed for this date.",
			font : {
				fontSize : 18 * dp,
				fontFamily : 'Montserrat',
				fontWeight : 'Bold'
			},
			color : '#000',
			top: 10 * dp
		});
		OuterView.add(lbl_none);
	}else{
		for (var i = 0; i < UpcomingEvents.length; i++) {
				var view1 = createEventView(context, UpcomingEvents[i], {
					left : _left
				});
				if (i == 0) {
					row = Titanium.UI.createView({
						backgroundSelectedColor : 'transparent',
						height : Ti.UI.SIZE
					});
				}
				row.add(view1);
				if (((i - 1) % 2 == 0) || (i == UpcomingEvents.length - 1)) {
					_left = 7 * dp;
					OuterView.add(row);
		
					row = Titanium.UI.createView({
						backgroundSelectedColor : 'transparent',
						height : Ti.UI.SIZE
					});
				} else {
					_left = (Ti.Platform.displayCaps.platformWidth / 2);
				}		
			
		}
		
	}
	
	
}

function createScroll(context, Events) {

	/*scroll.addEventListener('swipe',function(e){
		echo(e.direction);
		if (e.direction == 'left') {
		    Ti.App.fireEvent('showNext');
		    echo('next');
		} else if (e.direction == 'right') {
		     Ti.App.fireEvent('showPrevious');
		     echo('prev');
		}
	});*/
	//scroll.add(OuterView);
	var Lists = [];

	var scrollableList = Ti.UI.createScrollableView({
		//showPagingControl : true,
		pagingControlColor : '#ccc',
		//height : 180 * dp,
		height : 'auto',
		left : 0,
		right : 0,
		top : 0,
		zIndex : 4
	});
	for (var i = 0; i < 7; i++) {
		
		var scroll = Ti.UI.createScrollView({
			height : 'auto',
			top : 0,
			left:0,
			width : Ti.Platform.displayCaps.platformWidth,
			backgroundColor : 'transparent'
		});
	
		var OuterView = Ti.UI.createView({
			height : 'auto',
			layout : 'vertical',
			top : 25 * dp,
			width : Ti.Platform.displayCaps.platformWidth,
			backgroundColor : 'transparent'
		});
		var eventDate = new Date();
		eventDate.setDate(eventDate.getDate() + i );
		var list = createLayout(context, Events, OuterView, eventDate);
		scroll.add(OuterView);
		Lists.push(scroll);
	}
	scrollableList.views = Lists;
	scrollableList.addEventListener('scrollend',function(e){
		if(this.clickIndex != e.currentPage){
			Ti.App.fireEvent('setCalendarDate', {activeDate:e.currentPage});
			this.clickIndex = e.currentPage;
		}
	});
	Ti.App.addEventListener('moveScroll',function(e){
		scrollableList.scrollToView(e.slideIndex);
		scrollableList.clickIndex = e.slideIndex;
	});
	return scrollableList;
}

function Upcoming(argument) {
	return this.init.apply(this, arguments);
}

Upcoming.prototype.init = function(argument, isFlyout) {
	var that = this;
	var scrollHolder = Ti.UI.createView({
		height : Ti.UI.SIZE,
		top : 98 * dp,
		width : Ti.Platform.displayCaps.platformWidth,
		backgroundColor : 'transparent'
	});
	this.UpcomingWin = require('/ui/handheld/android/ParentView');
	this.UpcomingWin = new this.UpcomingWin();

	this.indicator = Ti.UI.createActivityIndicator({
		style : Titanium.UI.ActivityIndicatorStyle.PLAIN
	});
	this.UpcomingWin.add(that.indicator);
	this.indicator.show();
	this.UpcomingWin.scrollHolder = scrollHolder;
	this.UpcomingWin.add(scrollHolder);
	Ti.App.addEventListener('indicatorhide', function (event) {
		that.indicator.hide();
		//echo('hide');
	});
	
	if (Titanium.Network.online) {
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
		var query ='order=startDate&include=venue&where={"active":1, "endDate":{"$gte":{"__type":"Date","iso":"'+nDate+'"}}}';
		//var query = 'where={"feature":1}';
		Parse.queryObjects('Event', query, function(e, response, status) {
			if (status == '200') {
				//echo(status);
				
				var Json = eval('(' + response + ')');
				if (Json.results.length > 0) {	
					that.UpcomingWin.add(createScrollableCalendar(that, Json.results));		
					that.UpcomingWin.scrollHolder.add(createScroll(that, Json.results));
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
	this.UpcomingWin.headerView.add(lbl_title);
	//this.UpcomingWin.headerView.add(rightNavButton(this));
	// CREATE MENU VIEW
	//this.menuView = createRightMenu(this);
	//this.UpcomingWin.add(this.menuView);
	this.isMenuShown = false;
	//CREATE TABLE
	//create_Table(this);

	return this.UpcomingWin;

};

module.exports = Upcoming;
