/* jshint node: true */
'use strict';
var http = require('http');
var fetch = require('node-fetch');
var fs = require('fs');
var hogan = require('hogan.js');

// compile index.mu into a template for rendering
var page = hogan.compile(fs.readFileSync('index.mu').toString());
serve();

// create a simple http server
function serve() {
	var server = http.createServer(function(req, res) {
		// serve pre.js
		if (/pre\.js$/.test(req.url)) {
			res.writeHead(200, { 'Content-Type': 'application/javascript' });
			res.write(fs.readFileSync('./pre.js'));
			res.end();
		} else {
			var correlator = getCorrelator();
			var url = 'http://pubads.g.doubleclick.net/gampad/ads?gdfp_req=1&correlator=' + correlator + '&output=json_html&callback=callbackProxy&impl=fifs&json_a=1&eid=108809048&sc=0&sfv=1-0-2&iu_parts=5887%2Ctest.5887.origami%2Cserver%2Cleaderboard%2Chalfpage&enc_prev_ius=%2F0%2F1%2F2%2F3%2C%2F0%2F1%2F2%2F4&prev_iu_szs=728x90%2C300x600&cookie_enabled=1&lmt=1430151259&dt=1430153754724&cc=77&frm=20&biw=1005&bih=782&oid=3&adks=3231446615%2C3272423894&gut=v2&ifi=1&u_tz=60&u_his=3&u_java=true&u_h=900&u_w=1440&u_ah=877&u_aw=1436&u_cd=24&u_nplug=6&u_nmime=8&u_sd=1&flash=17.0.0&url=http%3A%2F%2Flocalhost%3A8080%2FResponsive-Positions.html&vrg=60&vrp=60&ga_vid=2004011242.1430153755&ga_sid=1430153755&ga_hid=1819194691&dpt=1';
			var headers = {
				"User-Agent": req.headers['user-agent'],
				"Referer": "http://localhost:8080/demos/local/Responsive-Positions.html"
			};

			// request the ads from dfp
			fetch(url, headers)
				.then(resolve)
				.then(getJSON)
				.then(parseResponse)
				.then(render.bind(null, res))
				.catch(onError);
		}
	});

	var port = 1311;
	server.listen(port, function() {
		console.log('server listening on port ' + port);
	});
}

// create a new correlator value for the ad call
function getCorrelator() {
	function genRand(sig){
	 return parseInt(Math.random() * Math.pow(10, sig), 10);
	}
	return ('' + genRand(5) + genRand(5) + genRand(6) + '00000').substr(0, 16);
}

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

function getJSON(body) {
	// pull the json from the SRA request body
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

function parseResponse(data) {
	// parse ad info into a script tags
	var scripts = '';
	console.log('render ' + data.length + ' ads');
	data.forEach(function (slot) {
		var name = Object.keys(slot)[0];
		slot = slot[name];
		if (!slot['_empty_']){
			//var path = name + '/' + slot['_width_'] + '/' + slot['_height_'];
			slot['_html_'] = encodeURIComponent(slot['_html_']);
			scripts += '<script name="' + name + '" type="application/json">';
			scripts += JSON.stringify(slot);
			scripts += '</script>';
		} else {
			console.log('empty');
		}
	});

	return scripts;
}

function render(res, data){
	// render the page
	res.writeHead(200, { 'Content-Type': 'text/html' });
	console.log('page write', data.length);
	res.write(page.render({content: data}));
	console.log('page end');
	res.end();
}
