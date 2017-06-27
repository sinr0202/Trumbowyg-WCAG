/* ===========================================================
 * wcag.js v1.0
 * WCAG compliance check plugin for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Richard, Cool Developer at Wedsby
 *		  Website : www.kimchirichie.com
 */
(function ($) {
	// 'use strict';
	var debug = false;
	var classList = [
			{class:'no-alt', msg:'Add Alternative Text'},
			{class:'no-summary', msg:'Add Table Summary'}
		];

	var d = function(rule, lvl, elm){
		if (debug){
			var level = "";
			for(var i=0; i<lvl; i++){
				level += " ";
			}
			console.log("["+rule+"]"+level+"{"+lvl+"} "+elm.nodeName);
		}
	},
	// Checks for alt text in images
	_1_1_1 = function(elm, lvl){
		// d('1.1.1', lvl, elm);

		// Add more tags below array
		if(['IMG'].indexOf(elm.nodeName)>-1 && !elm.getAttribute('alt')){
			elm.className += (" " +classList[0].class);
			// tooltip(elm, "");
		}
		var len = elm.childNodes.length
		for(var i=0; i<len; i++){
			_1_1_1(elm.childNodes[i],lvl+1);
		}
	},
	// Checks for summary in tables
	_1_3_1 = function(elm, lvl){
		// d('1.3.1', lvl, elm)

		// Add more tags below array
		if(['TABLE'].indexOf(elm.nodeName)>-1 && !elm.getAttribute('summary')){
			elm.className += (" " +classList[1].class);
			// tooltip(elm, "Add Table Summary");
		}
		var len = elm.childNodes.length
		for(var i=0; i<len; i++){
			_1_3_1(elm.childNodes[i],lvl+1);
		}
	},
	// creates a tooltip by wrapping the element in a container
	tooltip = function(elm,text){
		var clone = elm.cloneNode(true);
		var div = document.createElement('span');
		var span = document.createElement('span');
		div.className += (" tooltip");
		span.className += (" tooltiptext");
		span.innerHTML = text;
		div.appendChild(clone);
		div.appendChild(span);
		elm.parentNode.replaceChild(div,elm)
	},
	// inserts tooltips to the topmost nodes which require fixes
	insertTooltip = function(elm){
		var len = elm.childNodes.length;
		for(var i=0; i<len; i++){
			var child = elm.childNodes[i];
			var inserted = false;
			for(var j=0; j<classList.length; j++){
				if(child.classList && child.classList.contains(classList[j].class)){
					tooltip(child, classList[j].msg);
					inserted = true;
					break;
				}
			}
			if(!inserted){
				insertTooltip(child);
			}
		}
	},
	// removes the tooltip given the container of the span box
	clearTooltip = function(elm){
		var clone; 
		var len = elm.childNodes.length;
		for(var i=0; i<len; i++){
			var child = elm.childNodes[i];
			if(["IMG", "TABLE"].indexOf(child.nodeName)>-1){
				clone = child.cloneNode(true);
				break;
			}
		}
		if(!clone){
			// if there is no element inside, just return false to say nothing changed
			return false;
		} else {
			// otherwise return the clone to search deeper
			elm.parentNode.replaceChild(clone,elm);
			return clone;
		}
	},
	// clears WCAG tags by removing tooltips and classes
	clearWcag = function(elm,lvl){
		d('clearWcag', lvl, elm);
		var len = elm.childNodes.length;
		for(var i=0; i<len; i++){
			var child = elm.childNodes[i];
			if(child.classList){
				if(child.classList.contains('tooltip')){
					child = clearTooltip(child);
				}
				for(var j=0; j<classList.length; j++){
					if(child.classList.contains(classList[j].class)){
						child.classList.remove(classList[j].class);
					}
				}
				// return;
			}
			clearWcag(child, lvl+1)
		}
	},
	refresh = function(t){
		console.log('clear')
		// console.clear();
		clearWcag(t.$c[0],0)
		_1_1_1(t.$c[0],0);
		_1_3_1(t.$c[0],0);
		insertTooltip(t.$c[0],0)
		// t.syncTextarea();

	}

	$.extend(true, $.trumbowyg, {
		langs: {
			en: {
				wcag: "WCAG"
			}
		},
		plugins: {
			wcag: {
				init: function (trumbowyg) {
					trumbowyg.addBtnDef('wcag', {
						ico: "wcag", // change the icon later
						fn: function () {
							refresh(trumbowyg)
							// trumbowyg.$c.on('tbwchange',function(){
							// 	refresh(trumbowyg)
							// });
						}
					});
				}
			}
		}
	});
})(jQuery);
