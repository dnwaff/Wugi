// Copyright Stephen Feather and other contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * Usage:
 * var Parse = require('parse');
 * 
 * Parse.getObjects('myClass', myCallback);
 * 
 * Notes: Some folks like to do their error handling/forking in the Library. 
 * I don't. So I only pass one callback into each function. 
 * if you want a specific error function, add another param.
 * 
 * Push notification registration borrowed/modified from Matt Berg (https://gist.github.com/3761738).
 * 
 */

var baseURL = 'https://api.parse.com/1/',
	appId = 'EUadtoyJ0BnZpnEfhdCp0ZRTGqS1QDR56lYhXXqm',
	apiKey = 'okNTFU7FnSlGQ4R359sx0bG3SNIndRyC6ObBHajM'; // Be sure to use your REST API key and NOT your master as bad stuff can happen.
	

function ParseClient(){
	
}

ParseClient.prototype.saveUserRecord = function(user){
	Ti.App.Properties.setObject('parseUser', user);
};

ParseClient.prototype.setSessionToken = function(token){
	Ti.App.Properties.setString('parseSessionToken', token);
};

ParseClient.prototype.getSessionToken = function () {
  return Ti.App.Properties.getString('parseSessionToken');
};


ParseClient.prototype.createObject = function(_class, data, callback){
	var url = baseURL+'classes/'+_class;
	var params = {
		method: 'POST',
		body: data
	};
	
	this._request(url, params, callback);
};

ParseClient.prototype.updateObject = function(_class, _objectID, data, callback){
	var url = baseURL+'classes/'+_class+'/'+_objectID;
	var params = {
		method: 'PUT',
		body: data
	};
	
	this._request(url, params, callback);
};

ParseClient.prototype.queryObjects = function(_class, query, callback){
	if(query){
		var q = '?' + query;
	}else{
		var q = "";
	}
	//var url = baseURL+'classes/'+_class+'?where={"feature":"2","cheatMode":false}';
	var url = baseURL+'classes/'+_class + q;
	var params = {
		method: 'GET'
	};
	
	this._request(url, params, callback);
};
//Query to retrieve all rows
ParseClient.prototype.getObjects = function(_class, callback){
	var url = baseURL+'classes/'+_class;
	var params = {
		method: 'GET'
	};
	
	this._request(url, params, callback);
};
//Query to retrieve row by id
ParseClient.prototype.getObject = function(_class, _objectID, callback){
	var url = baseURL+'classes/'+_class+'/'+_objectID;
	this._request(url, callback);
};

ParseClient.prototype.deleteObject = function(_class, _objectID, callback){
	var url = baseURL+'classes/'+_class+'/'+_objectID;
	var params = {
		method: 'DELETE'
	};
	
	this._request(url, params, callback);
};

ParseClient.prototype.createUser = function(data, callback){
	var url = baseURL+'users';
	var params = {
		method: 'POST',
		body: data
	};
	
	function cb(success, response, code){
		if (success === 1){
			response = JSON.parse(response);
			parse.setSessionToken(response.sessionToken);
			callback(success, response, code);
		} else {
			callback(success, response, code);
		}
	}
	
	this._request(url, params, cb);
};

ParseClient.prototype.getUsers = function(callback){
	var url = baseURL+'users';
	this._request(url, callback);
};

ParseClient.prototype.getUser = function(_userObject, callback){
	var url = baseURL+'users/'+_userObject;
	this._request(url, callback);
};

ParseClient.prototype.loginUser = function(_username, _password, callback){
	var url = baseURL+'login?username='+_username+'&password='+_password;
	function cb(success, response, code){
		if (success === 1){
			response = JSON.parse(response);
			parse.setSessionToken(response.sessionToken);
			parse.saveUserRecord(response);
			callback(success, response, code);
		} else {
			callback(success, response, code);
		}
	}
	this._request(url, cb);
};

ParseClient.prototype.updateUser = function(_userObject, data, callback){
	var url = baseURL+'users/'+_userObject;
	var params = {
		method: 'PUT',
		body: data
	};
	
	this._request(url, params, callback);
};

ParseClient.prototype.deleteUser = function(_userObject, callback){
	var url = baseURL+'users/'+_userObject;
	var params = {
		method: 'DELETE'
	};
	
	this._request(url, params, callback);
};

ParseClient.prototype.passwordReset = function(_email, callback){
	var url = baseURL+'requestPasswordReset';
	_email = {
		email: _email
	};
	
	var params = {
		method: 'POST',
		body: _email
	};
	
	
	this._request(url, params, callback);
};


ParseClient.prototype.uploadImage = function (_contentType, _filename, _blob, callback){
	var url = baseURL+'files/'+_filename;
	var params = {
		method: 'POST',
		type: 'image',
		body: _blob,
		headers : {}
	};
	params.headers['Content-Type'] = _contentType;
	//Ti.API.error(params);
	this._request(url, params, callback);
};

// -- functions below here not fully functional/tested --







ParseClient.prototype.registerPush = function(params, callback) {
    var method = 'POST',
        url = config.parse.baseUrl + '/installations',
        payload = (params) ? JSON.stringify(params) : '';
 
    this._request(url, method, payload, function(data, status) {
        Ti.API.log('completed registration: ' + JSON.stringify(status));
        callabck(1, data, status);
    }, function(xhr, error) {
        Ti.API.log('xhr error registration: ' + JSON.stringify(error));
        callback(0,error);
    });
};
 
ParseClient.prototype._request = function(url, params, callback) {
    if (typeof params === 'function'){
		callback = params;
		params = {};
    }
    
    
    params = params || {};
    
    // Clean up the call type, defaulting to GET if no method set
    params.method = params.method || 'GET';
	params.method = params.method.toUpperCase();
    
    // If not specified, use a 20 second timeout
    params.timeout = ('timeout' in params) ? params.timeout : 15000;
    params.body = params.body || {};
	params.query = params.query || {};
	params.url = url || baseURL;
	//params.url += url;
	params.headers = params.headers || {};
	params.headers['X-Parse-Application-Id'] = appId;
	params.headers['X-Parse-REST-API-Key'] = apiKey;
	if (!params.headers['Content-Type']){
		params.headers['Content-Type'] = 'application/json';
	}
	params.headers['Accept'] = params.headers['Accept'] || 'application/json';
    if(!('login' in params) || !params.login){
		params.headers['X-Parse-Session-Token'] = this.getSessionToken();
	}
    
    // Need to clear some properties depending on method
    if ((params.method === 'GET') || (params.method === 'DELETE')){
		params.body = null;
    } else {
		if (params.type === 'image'){
			params.body = params.body;
		} else {
			params.body = JSON.stringify(params.body);
		}
		params.query = null;
    }
    
    
    var xhr = Ti.Network.createHTTPClient({
		onsendstream: function(e){
			Ti.API.error(e.progress);
		}
    });
 
    xhr.setTimeout(params.timeout);
 
    xhr.onerror = function(e) {
        callback(0,this.responseText, this.status, this);
    };
 
    xhr.onload = function() {
        callback(1,this.responseText, this.status);
    };
 
    
    //params = params.replace(/\./g, '_');
 
    xhr.open(params.method, params.url);

    for (var key in params.headers) {
		xhr.setRequestHeader(key, params.headers[key]);
	}
    xhr.send(params.body);
};
 
var parse = new ParseClient();
module.exports = parse;