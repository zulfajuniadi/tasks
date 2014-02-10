var rootApiServer = 'http://api.hasrimy.com:8000/yowsup/';
var ApiServerAuthToken = 'v8FgyM0GrzEE2YS3yI8wUq4Z';

APIRequest = function(oper, path, data, done) {
	var method, requestData, url = rootApiServer + path;
	var id = (data.id) ? data.id : data._id;
	if(oper === 'insert') {
		delete data.id;
		method = 'POST';
		requestData = data;
	} else if (oper === 'update') {
		method = 'PUT';
		requestData = data;
		url = url + '/' + id;
	} else if (oper === 'remove') {
		method = 'DELETE';
		url = url + '/' + id;
	}
	HTTP.call(method, url, {
		data : requestData,
		headers : {
			'Auth-Token' : ApiServerAuthToken
		}
	}, function(err, resp){
		if(err) return;
		if(resp && resp.data && done) {
			done.call(window, resp.data);
		}
	});
}