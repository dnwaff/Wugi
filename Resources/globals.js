Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
exports.Globals = {
	menuVisible: false,
	navWindows: [],

	// Flyout Menu's Global Instance'
	flyoutMenu: null,

	// HEIGHT AND WIDTH FOR DIFFERENT DEVICES IN ANDROID
	heightRatio: Titanium.Platform.Android ? Titanium.Platform.displayCaps.platformHeight / 480 : 1,
	widthRatio: Titanium.Platform.Android ? Titanium.Platform.displayCaps.platformWidth / 320 : 1,
	//GET SUBMENU CATEGORIES
	getData: function (events, venues) {
		var self = this;
		self.events.json = events;
		self.venues.json = venues;
		self.addmenu();
	},
	// CUSTOM HEADER BAR FOR NON FLYOUT WINDOWS
	setHeaderBar: function (currentWindow, title) {
		var view = Ti.UI.createView({
			height: 48 * dp,
			top: 0,
			backgroundColor: '#f8f8f8'
		});

		var btn_back = Ti.UI.createButton({
			backgroundImage: '/images/btn_back.png',
			height: 40 * dp,
			width: 40 * dp,
			left: 5 * dp,
			zIndex: 5
		});
		view.add(btn_back);

		btn_back.addEventListener('click', function (e) {
			currentWindow.close();
		});
		
		var lbl_title = Ti.UI.createLabel({
			text: title,
			font: {
				fontSize: 18 * dp,
				fontFamily: 'Arial',
				fontWeight: 'Bold'
			},
			color: '#fff'
		});
		view.add(lbl_title);

		var divider = Ti.UI.createView({
			height: 1 * dp,
			width: Ti.Platform.displayCaps.platformWidth,
			backgroundColor: '#efefef',
			bottom: 0,
			zIndex: 5
		});
		view.add(divider);

		return view;
	},

	setCustomTitle: function (titleValue) {
		var view = Ti.UI.createView({
			backgroundColor: 'transparent',
			width: Ti.UI.SIZE
		});

		var lbl_title = Ti.UI.createLabel({
			text: titleValue,
			color: '#000',
			font: {
				fontSize: 18,
				fontFamily: 'Arial',
				fontWeight: 'Bold'
			}
		});

		view.add(lbl_title);

		return view;
	},

	smsTextShare: function (message) {
		var smsmodule = require("com.omorandi");
		//create the smsDialog object
		var smsDialog = smsmodule.createSMSDialog();

		//check if the feature is available on the device at hand
		if (!smsDialog.isSupported()) {
			//falls here when executed on iOS versions < 4.0 and in the emulator
			var a = Ti.UI.createAlertDialog({
				title: 'Warning',
				message: 'The required feature is not available on this device'
			});
			a.show();
		} else {
			//pre-populate the dialog with the info provided in the following properties
			//smsDialog.recipients = ['+14151234567'];

			if (message) {
				smsDialog.messageBody = message;
			} else {
				smsDialog.messageBody = 'What U Getting Into? Check out WUGI ! It allows me to discover the best events and venues in the city. Find it @ www.wugi.me';
			}

			//set the color of the title-bar
			//smsDialog.barColor = 'red';

			//add an event listener for the 'complete' event, in order to be notified about the result of the operation
			smsDialog.addEventListener('complete', function (e) {
				//Ti.API.info("Result: " + e.resultMessage);
				//var a = Ti.UI.createAlertDialog({title: 'Status', message: 'Result: ' + e.resultMessage});
				//a.show();
				if (e.result == smsDialog.SENT) {
					var a = Ti.UI.createAlertDialog({
						title: 'Message Sent',
						message: 'Result: ' + e.resultMessage
					});
					a.show();
				} else if (e.result == smsDialog.FAILED) {
					var a = Ti.UI.createAlertDialog({
						title: 'Message Failed',
						message: 'Please try again.'
					});
					a.show();
				} else if (e.result == smsDialog.CANCELLED) {
					//don't bother
				}
			});

			//open the SMS dialog window with slide-up animation
			smsDialog.open({
				animated: true
			});
		}
	},

	openShare: function (context, messageObj) {
		var self = this;
		var Social = require('dk.napp.social');
		var emailDialog = Titanium.UI.createEmailDialog();
		emailDialog.html = true;
		if (messageObj) {
			emailDialog.subject = messageObj.subject;
			emailDialog.messageBody = messageObj.body;
		} else {
			emailDialog.subject = "What U Gettin Into? Check out WUGI";
			emailDialog.messageBody = 'What U Getting Into? Check out WUGI ! It allows me to discover the best events and venues in the city.<br><br>Find it @ www.wugi.me';
		}
		var defaultMsg = 'What U Getting Into? Check out WUGI ! It allows me to discover the best events and venues in the city. Find it @ www.wugi.me';
		var shareImage = messageObj ? messageObj.image : '/images/Logo@2x.png';
		if(Social.isActivityViewSupported()){ //min iOS6 required
            Social.activityView({
                text:messageObj ? messageObj.text : defaultMsg,
                image:Ti.App.Properties.getString('sharephoto') == 'yes' ? shareImage : '',
                removeIcons:"print,copy,contact,camera"
                //removeIcons:"print,sms,copy,contact,camera,mail"    
            });
        } else {
            //implement fallback sharing..
            var opts = {
				  cancel: 2,
				  options: ['Email', 'Text', 'Cancel'],
				  selectedIndex: 2
				};
			var dialog = Ti.UI.createOptionDialog(opts);
			
			dialog.addEventListener('click', function (e) {
				if(e.index == 0){
					emailDialog.open();
				}
				if(e.index == 1){
					if (messageObj) {
					self.smsTextShare(messageObj.text);
					} else {
						
						self.smsTextShare(defaultMsg);
					}
				}
				
			});
			dialog.show();
        }
		
		
		
		
		/*var opts = {
		  cancel: 2,
		  options: ['Email', 'Text', 'Cancel'],
		  selectedIndex: 2
		};
		var dialog = Ti.UI.createOptionDialog(opts);
		
		dialog.addEventListener('click', function (e) {
			if(e.index == 0){
				emailDialog.open();
			}
			if(e.index == 1){
				if (messageObj) {
				self.smsTextShare(messageObj.text);
				} else {
					var defaultMsg = 'What U Getting Into? Check out WUGI ! It allows me to discover the best events and venues in the city. Find it @ www.wugi.me';
					self.smsTextShare(defaultMsg);
				}
			}
			
		});
		dialog.show();*/
		
	},

	animations: {
		left: {
			left: 275,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
			duration: 200
		},
		right: {
			left: 0,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
			duration: 200
		}
	},
	getNeighborhood: function (data, param) {
		var param = !param ? '' : param;
		var qType = !param ? 'Events' : 'Venues';
		/***Remove Duplicates***/
		var obj = {};
		for ( var i=0; i < data.length; i++ )
			if(param =='venue'){
				obj[data[i]['neighborhood']] = data[i];
			}else{
				obj[data[i]['venue']['neighborhood']] = data[i];
			}   	
		var nb = new Array();
		for ( key in obj )
		    nb.push(obj[key]);
		/***End Remove Duplicates ***/    
		var arr = [{
			title: 'Back',
			name: '_back',
			src: '',
			color: '#000',
			icon: '/images/btn_back.png',
			iconAndroid: '/images/btn_back.png',
			rowBackgroundColor: '#f8f8f8'
		}];
		var arr2 = [];
		for (var i = 0; i < nb.length; i++) {
			var ntitle = !param ? nb[i].venue.neighborhood : nb[i].neighborhood;
			var nName = ntitle.toLowerCase();
			var n = {
				title: ntitle,
				name: '_' +  param + nName,
				category:'neighborhood',
				src: Titanium.Platform.Android ? '/ui/handheld/android/'+qType : '/ui/handheld/ios/'+qType,
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#efefef'
			};
			arr2.push(n);
		}
	    arr2.sort(function(a,b) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} );
	    arr = arr.concat(arr2);
		return arr;
	},
	getVenueType: function (data, param) {
		var param = !param ? '' : param;
		var qType = !param ? 'Events' : 'Venues';
		/***Remove Duplicates***/
		var obj = {};
		for ( var i=0; i < data.length; i++ )
			if(param =='venue'){
				obj[data[i]['type']] = data[i];
			}else{
				obj[data[i]['venue']['type']] = data[i];
			}	
		var nb = new Array();
		for ( key in obj )
		    nb.push(obj[key]);
		/***End Remove Duplicates ***/    
		var arr = [{
			title: 'Back',
			name: '_back',
			src: '',
			color: '#000',
			icon: '/images/btn_back.png',
			iconAndroid: '/images/btn_back.png',
			rowBackgroundColor: '#f8f8f8'
		}];
		var arr2 = [];
		for (var i = 0; i < nb.length; i++) {
			var ntitle = !param ? nb[i].venue.type :nb[i].type;
			var nName = ntitle.toLowerCase();
			var n = {
				title: ntitle,
				name: '_' + param + nName,
				category:'type',
				src: Titanium.Platform.Android ? '/ui/handheld/android/'+qType : '/ui/handheld/ios/'+qType,
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#efefef'
			};
			arr2.push(n);
		}
	
		arr2.sort(function(a,b) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} );
	    arr = arr.concat(arr2);
		return arr;
	},
	getTheme: function (data) {
		/***Remove Duplicates***/
		var obj = {};
		for ( var i=0; i < data.length; i++ )
		    obj[data[i]['theme']] = data[i];	
		var nb = new Array();
		for ( key in obj )
		    nb.push(obj[key]);
		/***End Remove Duplicates ***/    
		var arr = [{
			title: 'Back',
			name: '_back',
			src: '',
			color: '#000',
			icon: '/images/btn_back.png',
			iconAndroid: '/images/btn_back.png',
			rowBackgroundColor: '#f8f8f8'
		}];
		var arr2 = [];
		for (var i = 0; i < nb.length; i++) {
			var ntitle = nb[i].theme;
			var nName = ntitle.toLowerCase();
			var n = {
				title: ntitle,
				name: '_' + nName,
				category:'theme',
				src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#efefef'
			};
			arr2.push(n);
		}
	
		arr2.sort(function(a,b) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} );
	    arr = arr.concat(arr2);
		return arr;
		
	},
	getAge: function (data) {
		/***Remove Duplicates***/
		var obj = {};
		for ( var i=0; i < data.length; i++ )
		    obj[data[i]['age']] = data[i];	
		var nb = new Array();
		for ( key in obj )
		    nb.push(obj[key]);
		/***End Remove Duplicates ***/    
		var arr = [{
			title: 'Back',
			name: '_back',
			src: '',
			color: '#000',
			icon: '/images/btn_back.png',
			iconAndroid: '/images/btn_back.png',
			rowBackgroundColor: '#f8f8f8'
		}];
		var arr2 = [];
		for (var i = 0; i < nb.length; i++) {
			var ntitle = nb[i].age;
			var nName = ntitle.toLowerCase();
			var n = {
				title: ntitle,
				name: '_' + nName,
				category:'age',
				src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#efefef'
			};
			arr2.push(n);
		}
	
		arr2.sort(function(a,b) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} );
	    arr = arr.concat(arr2);
		return arr;
	},
	addmenu: function () {
		var self = this;
		var arr = [{
			title: 'WUGI MENU',
			name: '_main_menu',
			src: '',
			color: '#000',
			icon: '/images/ic_menu.png',
			iconAndroid: '/images/ic_menu@2x.png',
			rowBackgroundColor: '#cccccc',
			isHeader: true
		}, {
			title: 'Featured',
			name: '_featured',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Home' : '/ui/handheld/ios/Home',
			color: '#000',
			icon: '/images/Icon-Featured.png',
			iconAndroid: '/images/Icon-Featured@2x.png',
			rowBackgroundColor: '#f8f8f8'
		}, {
			title: 'Upcoming',
			name: '_upcoming',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Upcoming' : '/ui/handheld/ios/Upcoming',
			color: '#000',
			icon: '/images/Icon-Upcoming.png',
			iconAndroid: '/images/Icon-Upcoming@2x.png',
			rowBackgroundColor: '#f8f8f8'
		}, {
			title: 'Find Events',
			name: '_events',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
			color: '#000',
			icon: '/images/Icon-Event.png',
			iconAndroid: '/images/Icon-Event@2x.png',
			rowBackgroundColor: '#f8f8f8',
			subMenu: [{
				title: 'Back',
				name: '_back',
				src: '',
				color: '#000',
				icon: '/images/btn_back.png',
				iconAndroid: '/images/btn_back.png',
				rowBackgroundColor: '#f8f8f8'
			}, {
				title: 'Nearby',
				name: '_nearby',
				src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8'
			}, {
				title: 'By Neighborhood',
				name: '_neighborhood',
				src: '',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8',
				subMenu: self.getNeighborhood(self.events.json)
			}, {
				title: 'By Venue Type',
				name: '_venuetype',
				src: '',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8',
				subMenu: self.getVenueType(self.events.json)
			}, {
				title: 'By Theme',
				name: '_theme',
				src: '',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8',
				subMenu: self.getTheme(self.events.json)
			}, {
				title: 'By Age',
				name: '_age',
				src: '',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8',
				subMenu: self.getAge(self.events.json)
			}]
		}, {
			title: 'Find Venues',
			name: '_venues',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
			color: '#000',
			icon: '/images/Icon-Venue.png',
			iconAndroid: '/images/Icon-Venue@2x.png',
			rowBackgroundColor: '#f8f8f8',
			subMenu: [{
				title: 'Back',
				name: '_back',
				src: '',
				color: '#000',
				icon: '/images/btn_back.png',
				iconAndroid: '/images/btn_back.png',
				rowBackgroundColor: '#f8f8f8'
			}, {
				title: 'Nearby',
				name: '_venuesnearby',
				src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8'
			}, {
				title: 'By Neighborhood',
				name: '_venuesneighborhood',
				src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8',
				subMenu: self.getNeighborhood(self.venues.json, 'venue')
			}, {
				title: 'By Venue Type',
				name: '_byvenuetype',
				src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8',
				subMenu: self.getVenueType(self.venues.json, 'venue')
			}]
		}, {
			title: 'Open Late',
			name: '_late',
			src: Titanium.Platform.Android ? '/ui/handheld/android/OpenLate' : '/ui/handheld/ios/OpenLate',
			color: '#000',
			icon: '/images/Icon-LateNight.png',
			iconAndroid: '/images/Icon-LateNight@2x.png',
			rowBackgroundColor: '#f8f8f8'
		}, {
			title: 'Recent Photos',
			name: '_photos',
			src: Titanium.Platform.Android ? '/ui/handheld/android/RecentPhotos' : '/ui/handheld/ios/RecentPhotos',
			color: '#000',
			icon: '/images/Icon-Photo.png',
			iconAndroid: '/images/Icon-Photo@2x.png',
			rowBackgroundColor: '#f8f8f8'
		}, {
			title: 'Settings',
			name: '_settings',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Settings' : '/ui/handheld/ios/Settings',
			color: '#000',
			icon: '/images/Icon-Settings.png',
			iconAndroid: '/images/Icon-Settings@2x.png',
			rowBackgroundColor: '#f8f8f8'
		}, {
			title: 'Spread the Word',
			name: '_share',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Share' : '/ui/handheld/ios/Share',
			color: '#000',
			icon: '/images/Icon-Friend.png',
			iconAndroid: '/images/Icon-Friend@2x.png',
			rowBackgroundColor: '#f8f8f8'
		}, /*{
			title: 'Contact',
			name: '_contact',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Contact' : '/ui/handheld/ios/Contact',
			color: '#000',
			icon: '/images/ic_contact.png',
			iconAndroid: '/images/ic_contact@2x.png',
			rowBackgroundColor: '#f8f8f8'
		}*/];

		this.menu = arr;
	},
	menu: [],

	menu2: [{
			title: 'WUGI MENU',
			name: '_main_menu',
			src: '',
			color: '#000',
			icon: '/images/ic_menu.png',
			iconAndroid: '/images/ic_menu@2x.png',
			rowBackgroundColor: '#f8f8f8',
			isHeader: true
		}, {
			title: 'Featured',
			name: '_featured',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Home' : '/ui/handheld/ios/Home',
			color: '#000',
			icon: '/images/Icon-Featured.png',
			iconAndroid: '/images/Icon-Featured@2x.png',
			rowBackgroundColor: '#f8f8f8'
		}, {
			title: 'Upcoming',
			name: '_upcoming',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Upcoming' : '/ui/handheld/ios/Upcoming',
			color: '#000',
			icon: '/images/Icon-Upcoming.png',
			iconAndroid: '/images/Icon-Upcoming@2x.png',
			rowBackgroundColor: '#f8f8f8'
		}, {
			title: 'Find Events',
			name: '_events',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
			color: '#000',
			icon: '/images/Icon-Event.png',
			iconAndroid: '/images/Icon-Event@2x.png',
			rowBackgroundColor: '#f8f8f8',
			subMenu: [{
				title: 'Back',
				name: '_back',
				src: '',
				color: '#000',
				icon: '/images/btn_back.png',
				iconAndroid: '/images/btn_back.png',
				rowBackgroundColor: '#f8f8f8'
			}, {
				title: 'Nearby',
				name: '_nearby',
				src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8'
			}, {
				title: 'By Neighborhood',
				name: '_neighborhood',
				src: '',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8',
				subMenu: [{
					title: 'Back',
					name: '_back',
					src: '',
					color: '#000',
					icon: '/images/btn_back.png',
					iconAndroid: '/images/btn_back.png',
					rowBackgroundColor: '#f8f8f8'
				}, {
					title: 'Downtown',
					name: '_downtown',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8'
				}, {
					title: 'Midtown',
					name: '_midtown',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8',

				}]
			}, {
				title: 'By Venue Type',
				name: '_venuetype',
				src: '',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8',
				subMenu: [{
					title: 'Back',
					name: '_back',
					src: '',
					color: '#000',
					icon: '/images/btn_back.png',
					iconAndroid: '/images/btn_back.png',
					rowBackgroundColor: '#f8f8f8'
				}, {
					title: 'Club',
					name: '_club',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8'
				}, {
					title: 'Eatery',
					name: '_eatery',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8',

				}, {
					title: 'Lounge',
					name: '_lounge',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8',

				}]
			}, {
				title: 'By Theme',
				name: '_theme',
				src: '',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8',
				subMenu: [{
					title: 'Back',
					name: '_back',
					src: '',
					color: '#000',
					icon: '/images/btn_back.png',
					iconAndroid: '/images/btn_back.png',
					rowBackgroundColor: '#f8f8f8'
				}, {
					title: 'Day Party',
					name: '_dayparty',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8'
				}, {
					title: 'Sexy',
					name: '_sexy',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8',

				}, {
					title: 'Urban',
					name: '_urban',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8',

				}]
			}, {
				title: 'By Age',
				name: '_age',
				src: '',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8',
				subMenu: [{
					title: 'Back',
					name: '_back',
					src: '',
					color: '#000',
					icon: '/images/btn_back.png',
					iconAndroid: '/images/btn_back.png',
					rowBackgroundColor: '#f8f8f8'
				}, {
					title: '18+',
					name: '_eighteen',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8',

				}, {
					title: '21+',
					name: '_twentyone',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Events' : '/ui/handheld/ios/Events',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8',

				}]
			}]
		}, {
			title: 'Find Venues',
			name: '_venues',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
			color: '#000',
			icon: '/images/Icon-Venue.png',
			iconAndroid: '/images/Icon-Venue@2x.png',
			rowBackgroundColor: '#f8f8f8',
			subMenu: [{
				title: 'Back',
				name: '_back',
				src: '',
				color: '#000',
				icon: '/images/btn_back.png',
				iconAndroid: '/images/btn_back.png',
				rowBackgroundColor: '#f8f8f8'
			}, {
				title: 'Nearby',
				name: '_venuesnearby',
				src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8'
			}, {
				title: 'By Neighborhood',
				name: '_venuesneighborhood',
				src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8',
				subMenu: [{
					title: 'Back',
					name: '_back',
					src: '',
					color: '#000',
					icon: '/images/btn_back.png',
					iconAndroid: '/images/btn_back.png',
					rowBackgroundColor: '#f8f8f8'
				}, {
					title: 'Buckhead',
					name: '_buckhead',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8'
				}]
			}, {
				title: 'By Venue Type',
				name: '_byvenuetype',
				src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
				color: '#000',
				icon: '',
				iconAndroid: '',
				rowBackgroundColor: '#f8f8f8',
				subMenu: [{
					title: 'Back',
					name: '_back',
					src: '',
					color: '#000',
					icon: '/images/btn_back.png',
					iconAndroid: '/images/btn_back.png',
					rowBackgroundColor: '#f8f8f8'
				}, {
					title: 'Adult',
					name: '_adult',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8'
				}, {
					title: 'Bar',
					name: '_venuebar',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8'
				}, {
					title: 'Club',
					name: '_venueclub',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8'
				}, {
					title: 'Eatery',
					name: '_venueeatery',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8'
				}, {
					title: 'Lounge',
					name: '_venuelounge',
					src: Titanium.Platform.Android ? '/ui/handheld/android/Venues' : '/ui/handheld/ios/Venues',
					color: '#000',
					icon: '',
					iconAndroid: '',
					rowBackgroundColor: '#f8f8f8'
				}]
			}]
		}, {
			title: 'Open Late',
			name: '_late',
			src: Titanium.Platform.Android ? '/ui/handheld/android/OpenLate' : '/ui/handheld/ios/OpenLate',
			color: '#000',
			icon: '/images/Icon-LateNight.png',
			iconAndroid: '/images/Icon-LateNight@2x.png',
			rowBackgroundColor: '#f8f8f8'
		}, {
			title: 'Recent Photos',
			name: '_photos',
			src: Titanium.Platform.Android ? '/ui/handheld/android/RecentPhotos' : '/ui/handheld/ios/RecentPhotos',
			color: '#000',
			icon: '/images/Icon-Photo.png',
			iconAndroid: '/images/Icon-Photo@2x.png',
			rowBackgroundColor: '#f8f8f8'
		},
		/*{
		title : 'Info/Settings',
		name : '_setting',
		src : Titanium.Platform.Android ? '/ui/handheld/android/Setting' : '/ui/handheld/ios/Events',
		color : '#000',
		icon : '/images/Icon-Settings.png',
		iconAndroid : '/images/Icon-Settings@2x.png',
		rowBackgroundColor : '#f8f8f8'
	}, */
		{
			title: 'Spread the Word',
			name: '_share',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Share' : '/ui/handheld/ios/Share',
			color: '#000',
			icon: '/images/Icon-Friend.png',
			iconAndroid: '/images/Icon-Friend@2x.png',
			rowBackgroundColor: '#f8f8f8'
		},
		/*{
		title : 'Map',
		name : '_map',
		src : Titanium.Platform.Android ? '/ui/handheld/android/Map' : '/ui/handheld/ios/Map',
		color : '#000',
		icon : '/images/ic_map.png',
		iconAndroid : '/images/ic_map@2x.png',
		rowBackgroundColor : '#f8f8f8'
	}, 
		{
			title: 'Contact',
			name: '_contact',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Contact' : '/ui/handheld/ios/Contact',
			color: '#000',
			icon: '/images/ic_contact.png',
			iconAndroid: '/images/ic_contact@2x.png',
			rowBackgroundColor: '#f8f8f8'
		}*/
	],
	
	hiddenMenu: [{
			title: 'Search',
			name: '_search',
			src: Titanium.Platform.Android ? '/ui/handheld/android/Search' : '/ui/handheld/ios/Search',
			color: '#000',
			icon: '/images/ic_search.png',
			iconAndroid: '/images/ic_search.png',
			rowBackgroundColor: '#f8f8f8'
		}],

	rightMenuItems: [{
		title: 'Menu Item 1',
		color: '#656565'
	}, {
		title: 'Menu Item 2',
		color: '#656565'
	}, {
		title: 'More Options',
		color: '#656565'
	}, {
		title: 'Settings',
		color: '#656565'
	}],

	events: {
		json: ''
	},

	venues: {
		json: ''
	}

};

exports.Styles = {
	menuRows: {
		hasChild: true,
		color: '#fff',
		font: {
			fontSize: 18,
			fontWeight: 'bold'
		}
	},
	//
	// Flyout Menu (left menu)
	//
	flyout_menu: {
		backgroundColor: '#f8f8f8'
	},

	flyout_menu_item: {
		font: {
			fontSize: 18 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		},
		rowHeight: 50 * dp,
		selectedBackgroundColor: 'transparent',
		verticalDividerColor: '#dfdfdf',
		rowSeparatorColor: '#f8f8f8',
	},
	//
	// Windows / Views
	//
	win: {
		backgroundColor: '#FFF',
		barColor: '#FFF',
		separatorColor: '#efefef'
	},
	//
	// Right menu
	//
	right_menu: {
		color: '#656565',
		backgroundColor: '#292929',
		selectedBackgroundColor: '#8c5e7a',
		rowSeparatorColor: '#343434',
		font: {
			fontSize: 18 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		},
		width: 175 * dp,
		rowHeight: 48 * dp
	},
	//
	// Home (eg: Home view)
	//
	home_logo: {
		color: '#ffffff',
		font: {
			fontSize: 18 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},

	home_button: {
		color: '#ffffff',
		backgroundColor: '#579aa9',
		selectedBackgroundColor: '#7eb162',
		font: {
			fontSize: 18 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},
	//
	// Widgets (textfields, buttons etc eg: Contact view)
	//
	textfield: {
		color: '#000',
		placeholderColor: '#656565',
		borderColor: '#EFEFEF',
		height: 55 * dp,
		font: {
			fontSize: 18 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},

	textarea: {
		color: '#000',
		placeholderColor: '#656565',
		borderColor: '#EFEFEF',
		height: 143 * dp,
		font: {
			fontSize: 18 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},

	button: {
		color: '#ffffff',
		// backgroundColor : '#1b7e5a',
		backgroundColor: '#579aa9',
		selectedBackgroundColor: '#8c5e7a',
		height: 55 * dp,
		font: {
			fontSize: 18 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},

	button_bar: {
		backgroundColor: '#FFF',
		font: {
			fontSize: 16 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},

	tabbed_bar: {
		backgroundColor: '#775068',
		font: {
			fontSize: 16 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},

	lableProgress: {
		color: '#fff',
		font: {
			fontSize: 14 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},
	//
	// Feed (eg: News view)
	//
	feed_table: {

	},

	feed_table_row: {
		imageWidth: 96 * dp,
		/* heigh: auto */
		backgroundColor: 'transparent',
		selectedBackgroundColor: '#8c5e7a',
	},

	feed_table_row_title: {
		color: '#000',
		font: {
			fontSize: 15 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},

	slider_title: {
		color: '#000',
		font: {
			fontSize: 17 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},

	feed_table_row_small_title: {
		color: '#000',
		font: {
			fontSize: 12 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},

	feed_table_row_tags: {
		color: '#4f4f4f',
		font: {
			fontSize: 11 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},

	feed_table_row_teaser: {
		font: {
			fontSize: 14 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		},
		color: '#bdbdbd'
	},
	//
	// Details (eg: NewsDetail view)
	//
	detail_title: {
		color: '#000',
		font: {
			fontSize: 24 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},

	detail_title_2: {
		color: '#000',
		font: {
			fontSize: 22 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Bold'
		}
	},

	detail_title_3: {
		color: '#000',
		font: {
			fontSize: 22 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Bold'
		}
	},
	
	detail_title_4: {
		color: '#666',
		font: {
			fontSize: 18 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},

	detail_tags: {
		color: '#000',
		font: {
			fontSize: 13 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},

	detail_body: {
		color: '#000',
		font: {
			fontSize: 16 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},
	
	detail_body_2: {
		color: '#000',
		font: {
			fontSize: 18 * dp,
			fontFamily: 'Arial',
			fontWeight: 'Regular'
		}
	},
	
	//
	// Products (eg: Products view)
	//
	products_table: {

	},

	products_table_row: {
		imageWidth: 139 * dp,
		imageHeight: 139 * dp,
	},

	products_table_tile: {
		backgroundColor: '#FFF',
		selectedBackgroundColor: '#8c5e7a',
	},
	//
	// Product (eg: Product view)
	//
	product: {

	},

	product_slider: {
		height: 180 * dp
	},

	navTintColor: '#7eb162'


};

exports.MapData = {
	origin: {
		latitude: 37.41,
		longitude: -122.1
	},
	annotations: [{
		picture: "http://lorempixel.com/100/76/",
		title: "eros",
		subtitle: "Molestie et wisi.",
		body: "Lobortis elit lobortis illum accumsan nibh, et facilisis eros zzril lorem, dignissim autem erat feugait. Delenit, ut illum.",
		latitude: 37.390749,
		longitude: -122.081651
	}, {
		picture: "http://lorempixel.com/100/76/",
		title: "Ullamcorper eros.",
		subtitle: "Ex consequat.",
		body: "Volutpat ex diam elit facilisi feugait, et odio qui aliquip.",
		latitude: 37.41,
		longitude: -122.1
	}]
};

exports.defaults = function (obj) {
	each(slice.call(arguments, 1), function (source) {
		for (var prop in source) {
			if (obj[prop] == null)
				obj[prop] = source[prop];
		}
	});
	return obj;
};