/* jshint node: true */
'use strict';
var http = require('http');
var fetch = require('node-fetch');
var fs = require('fs');
var qs = require('querystring');
var hogan = require('hogan.js');
var prettysize = require('prettysize');

// configuration stuff
var adsConfig = require('./config.json');
var adUnit = '5887,test.5887.origami,server,leaderboard,halfpage';
var sizes = '970x90%2C300x600';

// compile templates for rendering
var page = hogan.compile(fs.readFileSync('index.mu').toString());
var slotTmpl = hogan.compile(fs.readFileSync('slot.mu').toString());

// read other files
var standard = fs.readFileSync('./standard.html');
var js = fs.readFileSync('./built.js');
var css = fs.readFileSync('./styles.css');

var server = http.createServer(function(req, res) {

	switch(true){
		case (/built\.js$/.test(req.url)):
			res.writeHead(200, { 'Content-Type': 'application/javascript' });
			res.write(js);
			res.end();
			break;
		case (/styles\.css$/.test(req.url)):
			res.writeHead(200, { 'Content-Type': 'text/css' });
			res.write(css);
			res.end();
			break;
		case (req.url === '/standard'):
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.write(standard);
			res.end();
			break;
		case (req.url === '/'):
			var cookies = qs.parse(req.headers.cookie, '; ', '=');
			console.log('AYSC data:', cookies.AYSC);
			console.log('User data:', cookies['FT_U']);
			var correlator = getCorrelator();

			var url = 'http://pubads.g.doubleclick.net/gampad/ads?gdfp_req=1&correlator=' + correlator + '&output=json_html&callback=callbackProxy&impl=fifs&json_a=1&eid=108809048&sc=0&sfv=1-0-2&iu_parts=' + adUnit + '&enc_prev_ius=%2F0%2F1%2F2%2F3%2C%2F0%2F1%2F2%2F4&prev_iu_szs=' + sizes + '&cookie_enabled=1&lmt=1430151259&dt=1430153754724&cc=77&frm=20&biw=1005&bih=782&oid=3&adks=3231446615%2C3272423894&gut=v2&ifi=1&u_tz=60&u_his=3&u_java=true&u_h=900&u_w=1440&u_ah=877&u_aw=1436&u_cd=24&u_nplug=6&u_nmime=8&u_sd=1&flash=17.0.0&url=http%3A%2F%2Flocalhost%3A8080%2FResponsive-Positions.html&vrg=60&vrp=60&ga_vid=2004011242.1430153755&ga_sid=1430153755&ga_hid=1819194691&dpt=1';
			var headers = {
				'User-Agent': req.headers['user-agent'],
				Referer: 'http://localhost:8080/demos/local/Responsive-Positions.html',
			};

			// request the ads from dfp
			fetch(url, headers)
				.then(getJSON)
				.then(parseResponse)
				.then(render.bind(null, res))
				.catch(onError.bind(null, res));
			break;
		default:
			res.writeHead(404, { 'Content-Type': 'text/html' });
			res.write('page not found!');
			res.end();
			break;
	}
});

// start a simple http server
function start() {
	var port = 1311;
	server.listen(port, function() {
		console.log('server listening on port ' + port);
	});
}

// create a new correlator value for the ad call
function getCorrelator() {
	function genRand(sig) {
		return parseInt(Math.random() * Math.pow(10, sig), 10);
	}

	return ((process.hrtime().join('') + genRand(6)).substr(0, 16));
}

function onError(res, err) {
	/* jshint devel: true */
	console.log(err);
	res.writeHead(500, { 'Content-Type': 'text/plain' });
	res.write(page.render({content: err.message}));
	res.end();
}

function getJSON(res) {
	// pull the json from the SRA request body
	/* jshint evil: true */
	return res.text().then(function (body) {
		if (body.length) {
			body = body
				.trim()
				.replace(/(^callbackProxy\()|(\);$)/g, '');

			return new Function('return ' + body)();
		} else {
			throw new Error('Invalid repsonse');
		}
	});
}

function parseResponse(data) {
	// parse ad info into a script tags
	var scripts = '';
	var slots = {};
	console.log('render ' + data.length + ' ads');
	data.forEach(function(slot) {
		var unitName = Object.keys(slot)[0];
		slot = slot[unitName];
		var name = unitName.split('/').pop();

		if (!slot._empty_) {
			var html = slot._html_.replace(/id=/gi, 'class=').replace(/ci\/o\-ads\-pm\.js/gi, 'prod/ads.js');
			delete slot._html_;
			slots[name] = slotTmpl.render({ name: name, html: html, json: JSON.stringify(slot), width: slot._width_, height: slot._height_ });
		} else {
			console.log('empty');
		}
	});
	return slots;
}
function getLocalIP() {
	var os = require('os');
	var ifaces = os.networkInterfaces();
	var ip = '';
	Object.keys(ifaces).forEach(function (ifname) {
		ifaces[ifname].forEach(function (iface) {
			// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
			if ('IPv4' !== iface.family || iface.internal !== false) {
				return;
			}

			ip = iface.address;
		});
	});
	return ip.length ? ip : false;
}

function render(res, data) {
	data.config = JSON.stringify(adsConfig);
	data.ip = getLocalIP();
	// render the page
	res.writeHead(200, { 'Content-Type': 'text/html' });
	console.log('page write', prettysize(JSON.stringify(data).length));
	res.write(page.render(data));
	console.log('page end');
	res.end();
}

// start the app
start();
