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
		text : 'Distance units',
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
	var mkm = Titanium.UI.iOS.createTabbedBar({
	    labels:['mi', 'km', ],
	    backgroundColor:'#4FDD65',
	    index:Ti.App.Properties.getString('units')=='mi'? 0 : 1,
	    top:14 * dp,
	    right: 14 * dp,
	    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
	    height:30 * dp,
	    width:90 * dp,
	    font:{fontSize:14 *dp}
	});
	
	mkm.addEventListener('click', function(e){
		if(e.index == 0){
				Ti.App.Properties.setString('units', 'mi');
				radText.text = Ti.App.Properties.getString('mRadius')+'mi';
		}
		if(e.index == 1){
				Ti.App.Properties.setString('units', 'km');
				radText.text = Ti.App.Properties.getString('kmRadius')+'km';
		}
	});

		
	rowDistance.add(lbl_distance);
	
	rowDistance.add(mkm);
	
	var rowRadius = Ti.UI.createTableViewRow({
		height : 110 * dp,
		selectionStyle : 'none',
		selectedBackgroundColor: 'transparent',
		backgroundColor : 'transparent'
	});

	var lbl_radius = Ti.UI.createLabel({
		text : 'Nearby search radius',
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
	var rad = Titanium.UI.createButtonBar({
	    labels:['-', '+' ],
	    backgroundColor:'#4FDD65',
	    top:50 * dp,
	    right: 14 * dp,
	    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
	    height:30 * dp,
	    width:90 * dp,
	    font:{fontSize:14 *dp}
	});
	rad.addEventListener('click',function(e){
			if(e.index == 0){
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
			}
			if(e.index == 1){
				var units = Ti.App.Properties.getString('units');
				var n = parseFloat(parseFloat(radText.text) + 0.5);
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
		text : 'Share photo with event or venue info?',
		left : 14 * dp,
		wordWrap : true,
		top: 14 * dp,
		color: '#666',
		font : styles.detail_body_2.font,
		width:Ti.Platform.displayCaps.platformWidth/2
	});
	rowSharingText.add(lbl_share);

	var shareSwitch = Ti.UI.createSwitch({
		value : true, // mandatory property for iOS,
		top : 14,
		right:14,
		value:Ti.App.Properties.getString('sharephoto') == 'yes' ? true : false
	});

	shareSwitch.addEventListener('change', function(e) {
		//Ti.API.info('Switch value: ' + e.value);
		if(e.value ==true){
				Ti.App.Properties.setString('sharephoto', 'yes');		
			}
		if(e.value == false){
				Ti.App.Properties.setString('sharephoto', 'no');
			}
	});
	
	//rowSharingText.add(shareView);
	rowSharingText.add(shareSwitch);
	
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
		top: 0
	});

	return table;
}




function Settings(argument) {
	return this.init.apply(this, arguments);
}

Settings.prototype.init = function(argument, isFlyout) {
	var that = this;
	this.navGroup = argument;
	this.window = Ti.UI.createWindow({
		backgroundColor : styles.win.backgroundColor,
		barColor : styles.win.barColor,
		navTintColor : styles.navTintColor
	});
	this.window.setTitleControl(globals.setCustomTitle('Settings'));
	
	this.window.addEventListener('open', function(e) {
		that.tableRows = [];
		var table = create_Table(that);
		createLayout(that);
		table.setData(that.tableRows);
		that.window.add(table);
	});
    

	return this.window;
};

module.exports = Settings;
