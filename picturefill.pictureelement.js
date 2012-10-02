/*! Picturefill - Responsive Images that work today. (and mimic the proposed Picture element with divs). Author: Scott Jehl, Filament Group, 2012 | License: MIT/GPLv2 */

(function( w ){

	// Enable strict mode
	"use strict";

	w.types = {};

	w.picturedetect = function() {
		// based on Modernizr's inlinesvg test
		// https://github.com/Modernizr/Modernizr/blob/master/modernizr.js
		var ns = {'svg': 'http://www.w3.org/2000/svg'},
			div = document.createElement( "div" );
		div.innerHTML = "<svg/>";
		if( ( div.firstChild && div.firstChild.namespaceURI ) == ns.svg ){
			w.types['image/svg+xml'] = true;
		}

		// based on Modernizr's img-webp test
		// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/img-webp.js
		// note: asynchronous
		var image = new Image();
		image.onload = function() {
			if( image.width == 1 ){
				w.types['image/webp'] = true;
			}
		};
		image.src = "data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAAAUAgCdASoBAAEAL/3+/3+CAB/AAAFzrNsAAP5QAAAAAA==";
	};

	w.picturefill = function() {
		var ps = w.document.getElementsByTagName( "picture" );

		// Loop the pictures
		for( var i = 0, il = ps.length; i < il; i++ ){

				var sources = ps[ i ].getElementsByTagName( "source" ),
					matches = [],
					lastType;

				// See which sources match
				for( var j = 0, jl = sources.length; j < jl; j++ ){
					var media = sources[ j ].getAttribute( "media" ),
						type = sources[ j ].getAttribute("type");

					// stop once type changes if we've already found matches
					if( matches.length && type != lastType ){
						break;
					}

					// if there's no type OR the type is in w.types
					if (!type || ( w.types[type] == true) ){

						// if there's no media specified, OR w.matchMedia is supported
						if( !media || ( w.matchMedia && w.matchMedia( media ).matches ) ){
							matches.push( sources[ j ] );
						}
					}

					lastType = type;
				}

			// Find any existing img element in the picture element
			var picImg = ps[ i ].getElementsByTagName( "img" )[ 0 ];

			if( matches.length ){
				if( !picImg ){
					picImg = w.document.createElement( "img" );
					picImg.alt = ps[ i ].getAttribute( "alt" );
					ps[ i ].appendChild( picImg );
				}

				picImg.src =  matches.pop().getAttribute( "src" );
			}
			else if( picImg ){
				ps[ i ].removeChild( picImg );
			}
		}
	};

	// Run on resize and domready (w.load as a fallback)
	if( w.addEventListener ){
		w.addEventListener( "resize", w.picturefill, false );
		w.addEventListener( "DOMContentLoaded", function(){
			w.picturedetect();

			// WebP detect is asynchronous
			// this should allow it to finish before picturefill runs
			setTimeout(w.picturefill, 1);

			// Run once only
			w.removeEventListener( "load", w.picturedetect, false );
			w.removeEventListener( "load", w.picturefill, false );
		}, false );
		w.addEventListener( "load", w.picturedetect, false );
		w.addEventListener( "load", w.picturefill, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onload", w.picturedetect );
		w.attachEvent( "onload", w.picturefill );
	}

}( this ));