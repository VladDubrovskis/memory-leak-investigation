/* jshint node: true */
'use strict';
var http = require('http');
var fetch = require('node-fetch');
var fs = require('fs');
var hogan = require('hogan.js');

function getCorrelator() {
	function genRand(sig){
	 return parseInt(Math.random() * Math.pow(10, sig), 10);
	}
return ('' + genRand(5) + genRand(5) + genRand(6) + '00000').substr(0, 16);
}

var correlator = getCorrelator();
var url = 'http://pubads.g.doubleclick.net/gampad/ads?gdfp_req=1&correlator=' + correlator + '&output=json_html&callback=callbackProxy&impl=fifs&json_a=1&eid=108809022%2C108809029&sfv=1-0-2&iu_parts=5887%2Ctest.5887.origami%2Cresponsive-1%2Cresponsive-2&enc_prev_ius=%2F0%2F1%2F2%2C%2F0%2F1%2F3&prev_iu_szs=728x90%2C300x600&cookie_enabled=1&lmt=1429278461&dt=1429278502371&cc=81&frm=20&biw=1005&bih=738&oid=3&adks=1836066525%2C2040731753&gut=v2&ifi=1&u_tz=60&u_his=4&u_java=true&u_h=900&u_w=1440&u_ah=877&u_aw=1436&u_cd=24&u_nplug=10&u_nmime=34&u_sd=1&flash=17.0.0&url=http%3A%2F%2Flocalhost%3A8080%2Fdemos%2Flocal%2FResponsive-Positions.html&vrg=59&vrp=59&ga_vid=920811734.1429278502&ga_sid=1429278502&ga_hid=665793948&dpt=1';

var headers =  {
	"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36",
	// "X-Client-Data": "CIq2yQEIprbJAQiptskBCMG2yQEI8IjKAQiKksoBCMOUygE=",
	"Referer": "http://localhost:8080/demos/local/Responsive-Positions.html",
	// "Cookie": "id=223c05d60202007b||t=1424444983|et=730|cs=002213fd48b43ca36778aadde2"
};

// var response = new Promise(function(resolve, reject) {
// 	fs.readFile('./response.jsonp', 'utf8', function (err, data) {
// 		if (err){
// 			reject(err);
// 		}
// 		resolve(data);
// 	});
// });

var page = hogan.compile(fs.readFileSync('index.mu').toString());


function getCorrelator() {
	function genRand(sig){
	 return parseInt(Math.random() * Math.pow(10, sig), 10);
	}
return ('' + genRand(5) + genRand(5) + genRand(6) + '00000').substr(0, 16);
}



var correlator = getCorrelator();
var url = 'http://pubads.g.doubleclick.net/gampad/ads?gdfp_req=1&correlator=' + correlator + '&output=json_html&callback=callbackProxy&impl=fifs&json_a=1&eid=108809022%2C108809029&sfv=1-0-2&iu_parts=5887%2Ctest.5887.origami%2Cresponsive-1%2Cresponsive-2&enc_prev_ius=%2F0%2F1%2F2%2C%2F0%2F1%2F3&prev_iu_szs=728x90%2C300x600&cookie_enabled=1&lmt=1429278461&dt=1429278502371&cc=81&frm=20&biw=1005&bih=738&oid=3&adks=1836066525%2C2040731753&gut=v2&ifi=1&u_tz=60&u_his=4&u_java=true&u_h=900&u_w=1440&u_ah=877&u_aw=1436&u_cd=24&u_nplug=10&u_nmime=34&u_sd=1&flash=17.0.0&url=http%3A%2F%2Flocalhost%3A8080%2Fdemos%2Flocal%2FResponsive-Positions.html&vrg=59&vrp=59&ga_vid=920811734.1429278502&ga_sid=1429278502&ga_hid=665793948&dpt=1';

//response
fetch(url, headers)
	.then(resolve)
	.then(parseBody)
	.then(buildPage)
	.then(serve)
	.catch(onError);


function onError(err) {
	/* jshint devel: true */
	console.log(err);
}

function resolve(res){
	if(res.text){
		return res.text();
	} else {
		return res;
	}
}

function parseBody (body) {
	/* jshint evil: true */
	if (body.length){
		body = body
			.trim()
			.replace(/(^callbackProxy\()|(\);$)/g, '');

		return new Function( 'return ' + body )();
	} else {
		throw new Error('Invalid repsonse');
	}
}

function buildPage(data) {
	var scripts = '';
	data.forEach(function (slot) {
		var name = Object.keys(slot)[0];
		slot = slot[name];
		if (!slot['_empty_']){
			//var path = name + '/' + slot['_width_'] + '/' + slot['_height_'];
			slot['_html_'] = encodeURIComponent(slot['_html_']);
			scripts += '<script name="' + name + '" type="application/json">';
			scripts += JSON.stringify(slot);
			scripts += '</script>';
		}
	});

	return scripts;
}

function serve(data) {
	/* jshint devel: true */
	var server = http.createServer(function(req, res) {

		res.writeHead( 200);

		if (/pre\.js$/.test(req.url)) {
			res.write(fs.readFileSync('./pre.js'));
		} else {
			res.write(page.render({content: data}));
		}
		res.end();
	});

	var port = 1311;
	server.listen(port, function() {
		console.log('server listening on port ' + port);
	});
}



