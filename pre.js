'use strict';
var slots = [].slice.call(document.querySelectorAll('script[name]'));

function write(slot) {
	slot = JSON.parse(slot.innerHTML);
	var iframe = document.createElement('iframe');
	iframe.setAttribute('width', slot['_width_']);
	iframe.setAttribute('height', slot['_height_']);
	iframe.setAttribute('scrolling', 'no');
	iframe.setAttribute('marginwidth', '0');
	iframe.setAttribute('marginheight', '0');
	iframe.setAttribute('frameborder', '0');
	iframe.setAttribute('style', 'border: 0px; vertical-align: bottom;');
	document.body.appendChild(iframe);
	iframe.contentWindow.document.write(decodeURIComponent(slot['_html_']));
}

slots.forEach(write);
