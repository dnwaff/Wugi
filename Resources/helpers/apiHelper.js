function APIGetRequest(url, callback, errorCallback) {
	var req = Titanium.Network.createHTTPClient({
		onload : callback,
		onerror : errorCallback,
		timeout : 60000
	});
	req.open("GET", url, true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.send();
}

function APIGetRequestImage(url, imgView, actInd, callback) {
	var loader = Titanium.Network.createHTTPClient({
		onload : callback,
		onerror : function(e) {
			Ti.API.debug(e.error);
		},
		timeout : 10000
	});
	loader.imgView = imgView;
	loader.ind = actInd;
	loader.open("GET", url);
	loader.send();
}