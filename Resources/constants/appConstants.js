var dp = "";
if (Titanium.Platform.Android) {
	dp = (Ti.Platform.displayCaps.dpi / 160);
} else {
	dp = 1;
}
var osname = Ti.Platform.osname;
var version = Titanium.Platform.version.split(".");
version = version[0];
var HEIGHT = Ti.Platform.displayCaps.platformHeight;
var WIDTH = Ti.Platform.displayCaps.platformWidth;
var isTablet = osname === 'ipad' || (osname === 'android' && (WIDTH > 950));
if(isTablet){
	var orientationArray = [
		Ti.UI.PORTRAIT,
	    Ti.UI.UPSIDE_PORTRAIT,
	    Ti.UI.LANDSCAPE_LEFT,
	    Ti.UI.LANDSCAPE_RIGHT,
	    Titanium.UI.FACE_UP,
    	Titanium.UI.FACE_DOWN
	];
}else{
	var orientationArray = [Ti.UI.PORTRAIT];
}
function isIOS7Plus(){
	// iOS-specific test
	if (Titanium.Platform.name == 'iPhone OS')
	{
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0],10);

		// Can only test this support on a 3.2+ device
		if (major >= 7)
		{
			return true;
		}
	}
	return false;
}
var iOS7 = isIOS7Plus();
var theTop = iOS7 ? 20 * dp : 0;
var Parse = require('parse');
var dayOfWeek = new Array("Sunday", "Monday", "Tuesday", "Wednesday", 
	"Thursday", "Friday", "Saturday");
function formatDate(timestamp){
	var m_names = new Array("January", "February", "March", 
	"April", "May", "June", "July", "August", "September", 
	"October", "November", "December");
	
	var d = new Date(timestamp);
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	var curr_year = d.getFullYear();
	var newDate = m_names[curr_month] + ' ' + curr_date + ', ' + curr_year;
	return newDate;

}

function echo(data){
	Ti.API.info(data);
}
