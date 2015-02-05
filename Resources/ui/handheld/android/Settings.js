Ti.include(Titanium.Filesystem.resourcesDirectory + "constants/appConstants.js");
var styles = require('globals').Styles;
var globals = require('globals').Globals;

function createLayout(context) {
	
	var rowLocationTitle = Ti.UI.createTableViewRow({
		height : 50 * dp,
		selectionStyle : 'none',
		selectedBackgroundColor: 'transparent',
		layout : 'vertical',
		backgroundColor : '#EFEFEF'
	});

	var lbl_location = Ti.UI.createLabel({
		text : 'LOCATION',
		color : styles.detail_title.color,
		font : styles.detail_title_4.font,
		top : 14 * dp,
		left : 14 * dp,
		wordWrap : true
	});
	rowLocationTitle.add(lbl_location);

	var rowDistance = Ti.UI.createTableViewRow({
		height : 80 * dp,
		selectionStyle : 'none',
		selectedBackgroundColor: 'transparent',
		backgroundColor : 'transparent'
	});

	var lbl_distance = Ti.UI.createLabel({
		text : 'Distance Units',
		top : 14 * dp,
		left : 14 * dp,
		wordWrap : true,
		color: '#666',
		font : styles.detail_body_2.font
	});
	
	var mkm = Titanium.UI.createView({
		   backgroundImage : Ti.App.Properties.getString('units')=='mi'? '/images/select-left.png' : '/images/select-right.png',
		   width:180,
		   height:60,
		   top : 14 * dp,
		   right : 14 * dp
		});
		
	var mi = Ti.UI.createLabel({
		    text : 'mi',		
		    top:2*dp,
			left : 12 * dp,
			color: Ti.App.Properties.getString('units')=='mi'? '#FFF' : '#7eb162',
			height : Ti.UI.SIZE,
			zIndex: 5,
			active: Ti.App.Properties.getString('units')=='mi'? 1 : 0,
			font: {
					fontSize: 16 * dp,
					fontFamily: 'Arial',
					fontWeight: 'Regular'
				}
		});
		mi.addEventListener('click', function(){
			if(this.active == 0){
				mkm.backgroundImage = '/images/select-left.png',
				this.color = "#fff";
				km.color ="#7eb162";
				Ti.App.Properties.setString('units', 'mi');
				this.active = 1;
				km.active = 0;
				radText.text = Ti.App.Properties.getString('mRadius')+'mi';
				
			}
		});
	var km = Ti.UI.createLabel({
		    text : 'km',		
		    top:2*dp,
			right : 10 * dp,
			color: Ti.App.Properties.getString('units')=='km'? '#FFF' : '#7eb162',
			zIndex: 5,
			height : Ti.UI.SIZE,
			active: Ti.App.Properties.getString('units')=='km'? 1 : 0,
			font: {
					fontSize: 16 * dp,
					fontFamily: 'Arial',
					fontWeight: 'Regular'
				}
		});
		km.addEventListener('click', function(){
			if(this.active == 0){
				mkm.backgroundImage = '/images/select-right.png',
				this.color = "#fff";
				mi.color ="#7eb162";
				Ti.App.Properties.setString('units', 'km');
				this.active = 1;
				mi.active = 0;
				radText.text = Ti.App.Properties.getString('kmRadius')+'km';
			}
		});
	mkm.add(mi);
	mkm.add(km);
	rowDistance.add(lbl_distance);
	
	rowDistance.add(mkm);
	
	var rowRadius = Ti.UI.createTableViewRow({
		height : 110 * dp,
		selectionStyle : 'none',
		selectedBackgroundColor: 'transparent',
		backgroundColor : 'transparent'
	});

	var lbl_radius = Ti.UI.createLabel({
		text : 'Nearby Search Radius',
		left : 14 * dp,
		top : 14 * dp,
		wordWrap : true,
		color: '#666',
		font : styles.detail_body_2.font,
		width:Ti.Platform.displayCaps.platformWidth/2
	});
	var radText = Ti.UI.createLabel({
		    text : Ti.App.Properties.getString('units') =='mi' ? Ti.App.Properties.getString('mRadius')+'mi': Ti.App.Properties.getString('kmRadius')+'km',
			top : 14 * dp,
			right : 35 * dp,
			wordWrap : true,
			color: '#666',
			font : styles.detail_body_2.font
		});
	var rad = Titanium.UI.createView({
		   backgroundImage : '/images/select.png',
		   width:90 * dp,
		   height:30 * dp,
		   top : 40 * dp,
		   right : 14 * dp
		});
	var plus = Ti.UI.createButton({
			backgroundColor:'transparent',
		    title : '+',		
		    top:32*dp,
			right : 14 * dp,
			color: '#7eb162',
			width:45*dp,
			height:30* dp,
			verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			zIndex: 2,
			font: {
					fontSize: 30 * dp,
					fontFamily: 'Arial',
					fontWeight: 'Regular'
				}
		});
		plus.addEventListener('click',function(){
			var units = Ti.App.Properties.getString('units');
			var n = parseFloat(parseFloat(radText.text) + 0.5);
				radText.text = n.toFixed(1) + units;
				if(Ti.App.Properties.getString('units')=='mi'){
					Ti.App.Properties.setString('mRadius', n.toFixed(1));
				}
				if(Ti.App.Properties.getString('units')=='km'){
					Ti.App.Properties.setString('kmRadius', n.toFixed(1));
				}
				
		});
		
	var minus = Ti.UI.createButton({
		    backgroundColor:'transparent',
		    title : '-',		
		    top:32 *dp,
			right : 56 * dp,
			width:50 * dp,
			height:30 * dp,
			color: '#7eb162',
			zIndex: 2,
			verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			font: {
					fontSize: 30 * dp,
					fontFamily: 'Arial',
					fontWeight: 'Regular'
				}
		});
		minus.addEventListener('click',function(){
			if((Ti.App.Properties.getString('units')=='mi' && Ti.App.Properties.getString('mRadius')>1) || (Ti.App.Properties.getString('units')=='km' && Ti.App.Properties.getString('kmRadius')>1)){
				var units = Ti.App.Properties.getString('units');
				var n = parseFloat(parseFloat(radText.text) - 0.5);
				radText.text = n.toFixed(1) + units;
				if(Ti.App.Properties.getString('units')=='mi'){
					Ti.App.Properties.setString('mRadius', n.toFixed(1));
				}
				if(Ti.App.Properties.getString('units')=='km'){
					Ti.App.Properties.setString('kmRadius', n.toFixed(1));
				}
			}
			
		});
	
	rowRadius.add(lbl_radius);
	rowRadius.add(radText);
	rowRadius.add(minus);
	rowRadius.add(plus);
	rowRadius.add(rad);
	
	var rowSharingTitle = Ti.UI.createTableViewRow({
		height : 50 * dp,
		selectionStyle : 'none',
		selectedBackgroundColor: 'transparent',
		backgroundColor : '#efefef'
	});

	var lbl_sharing = Ti.UI.createLabel({
		text : 'SHARING',
		color : styles.detail_title.color,
		font : styles.detail_title_4.font,
		top : 14 * dp,
		left : 14 * dp,
		wordWrap : true
	});
	rowSharingTitle.add(lbl_sharing);
	
	var rowSharingText = Ti.UI.createTableViewRow({
		height : 80 * dp,
		selectionStyle : 'none',
		selectedBackgroundColor: 'transparent',
		backgroundColor : 'transparent'
	});

	var lbl_share = Ti.UI.createLabel({
		text : 'Share Photo With Event Or Venue Info?',
		left : 14 * dp,
		wordWrap : true,
		top: 14 * dp,
		color: '#666',
		font : styles.detail_body_2.font,
		width:Ti.Platform.displayCaps.platformWidth/2
	});
	rowSharingText.add(lbl_share);
	
	var shareView = Titanium.UI.createView({
		   backgroundImage : Ti.App.Properties.getString('sharephoto')=='yes'? '/images/select-left.png' : '/images/select-right.png',
		   width:180,
		   height:60,
		   top : 14 * dp,
		   right : 14 * dp
		});
		
	var yesShare = Ti.UI.createLabel({
		    text : 'yes',		
		    top:2*dp,
			left : 12 * dp,
			color: Ti.App.Properties.getString('sharephoto')=='yes'? '#FFF' : '#7eb162',
			height : Ti.UI.SIZE,
			active: Ti.App.Properties.getString('sharephoto')=='yes'? 1 : 0,
			font: {
					fontSize: 16 * dp,
					fontFamily: 'Arial',
					fontWeight: 'Regular'
				}
		});
		yesShare.addEventListener('click', function(){
			if(this.active == 0){
				shareView.backgroundImage = '/images/select-left.png',
				this.color = "#fff";
				noShare.color ="#7eb162",
				Ti.App.Properties.setString('sharephoto', 'yes');
				this.active = 1;
				noShare.active = 0;
				
			}
		});
	var noShare = Ti.UI.createLabel({
		    text : 'no',		
		    top:2*dp,
			right : 10 * dp,
			color: Ti.App.Properties.getString('sharephoto')=='no'? '#FFF' : '#7eb162',
			height : Ti.UI.SIZE,
			active: Ti.App.Properties.getString('sharephoto')=='no'? 1 : 0,
			font: {
					fontSize: 16 * dp,
					fontFamily: 'Arial',
					fontWeight: 'Regular'
				}
		});
		noShare.addEventListener('click', function(){
			if(this.active == 0){
				shareView.backgroundImage = '/images/select-right.png',
				this.color = "#fff";
				yesShare.color ="#7eb162",
				Ti.App.Properties.setString('sharephoto', 'no');
				this.active = 1;
				yesShare.active = 0;
			}
		});
	shareView.add(yesShare);
	shareView.add(noShare);
	
	rowSharingText.add(shareView);
	
	var rowVersion = Ti.UI.createTableViewRow({
		height : 50 * dp,
		selectionStyle : 'none',
		selectedBackgroundColor: 'transparent',
		backgroundColor : '#EFEFEF'
	});

	var lbl_version = Ti.UI.createLabel({
		text : 'VERSION',
		color : styles.detail_title.color,
		font : styles.detail_title_4.font,
		top : 14 * dp,
		left : 14 * dp,
		wordWrap : true
	});
	rowVersion.add(lbl_version);
	
	var rowVersionText = Ti.UI.createTableViewRow({
		height : 50 * dp,
		selectionStyle : 'none',
		selectedBackgroundColor: 'transparent',
		layout : 'vertical'
	});

	var lbl_versiontext = Ti.UI.createLabel({
		text : Titanium.App.version,
		left : 14 * dp,
		wordWrap : true,
		font : styles.detail_body.font
	});
	rowVersionText.add(lbl_versiontext);
		
	context.tableRows.push(rowLocationTitle);
	context.tableRows.push(rowDistance);
	context.tableRows.push(rowRadius);
	context.tableRows.push(rowSharingTitle);
	context.tableRows.push(rowSharingText);
	context.tableRows.push(rowVersion);
	context.tableRows.push(rowVersionText);

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




function Settings(argument) {
	return this.init.apply(this, arguments);
}

Settings.prototype.init = function(argument, isFlyout) {
	var that = this;
	this.winTitle = (argument != null) ? argument.menuItem.title : 'Settings';

	if (isFlyout) {
		this.SettingsWin = require('/ui/handheld/android/ParentView');
		this.SettingsWin = new this.SettingsWin();

		var lbl_title = Ti.UI.createLabel({
			text : this.winTitle,
			font : {
				fontSize : 18 * dp,
				fontFamily : 'Montserrat',
				fontWeight : 'Bold'
			},
			color : '#000'
		});
		this.SettingsWin.headerView.add(lbl_title);
	} else {
		this.SettingsWin = Ti.UI.createWindow({
			backgroundColor : styles.win.backgroundColor,
			zIndex : 20,
			exitOnClose : false,
			navBarHidden : true,
			orientationModes : [Ti.UI.PORTRAIT]
		});
		this.SettingsWin.add(globals.setHeaderBar(this.SettingsWin, this.winTitle));

		this.SettingsWin.addEventListener('open', function(e) {

		});

		this.SettingsWin.addEventListener('androidback', function(e) {
			that.SettingsWin.close();
		});
	}
    that.tableRows = [];
	var table = create_Table(that);
	createLayout(that);
	table.setData(that.tableRows);

	this.SettingsWin.add(table);

	return this.SettingsWin;
};

module.exports = Settings;
