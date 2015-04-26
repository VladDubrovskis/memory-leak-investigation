'use strict';
var slots = [].slice.call(document.querySelectorAll('script[name]'));

function write(slot) {
	slot = JSON.parse(slot.innerHTML);
	var iframe = document.createElement('iframe');
	iframe.setAttribute('width', slot['_width_']);
	iframe.setAttribute('height', slot['_height_']);
	document.body.appendChild(iframe);
	iframe.contentWindow.document.write(decodeURIComponent(slot['_html_']));
}

slots.forEach(write);
