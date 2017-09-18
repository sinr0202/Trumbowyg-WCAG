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
			{class:'trumbowyg-wcag-no-alt', msg:'Add Alternative Text'},
			{class:'trumbowyg-wcag-no-summary', msg:'Add Table Summary'}
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
		d('1.1.1', lvl, elm);

		// Add more tags below array
		if(['IMG'].indexOf(elm.nodeName)>-1 && !elm.getAttribute('alt')){
			elm.className += (" " +classList[0].class);
		}
		var len = elm.childNodes.length
		for(var i=0; i<len; i++){
			_1_1_1(elm.childNodes[i],lvl+1);
		}
	},
	// Checks for summary in tables
	_1_3_1 = function(elm, lvl){
		d('1.3.1', lvl, elm)

		// Add more tags below array
		if(['TABLE'].indexOf(elm.nodeName)>-1 && !elm.getAttribute('summary')){
			elm.className += (" " +classList[1].class);
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
		div.className += (" trumbowyg-wcag-tooltip");
		span.className += (" trumbowyg-wcag-tooltiptext");
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
				if(child.classList.contains('trumbowyg-wcag-tooltip')){
					child = clearTooltip(child);
				}
				for(var j=0; j<classList.length; j++){
					if(child.classList.contains(classList[j].class)){
						child.classList.remove(classList[j].class);
					}
				}
			}
			clearWcag(child, lvl+1)
		}
	},
	refresh = function(t){
		clearWcag(t.$ed[0],0)
		_1_1_1(t.$ed[0],0);
		_1_3_1(t.$ed[0],0);
		insertTooltip(t.$ed[0],0)
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
					trumbowyg.o.plugins.wcag = false;
					trumbowyg.addBtnDef('wcag', {
						ico: "wcag", // change the icon later
						fn: function () {
							trumbowyg.o.plugins.wcag = !trumbowyg.o.plugins.wcag;
							if(!trumbowyg.o.plugins.wcag){
								// didnt find any other way to make it toggle on and off so just adding class brute force
								// if there is a better way to make the button toggle in the future, change this behaviour
								$(".trumbowyg-wcag-button").removeClass("trumbowyg-active")
								clearWcag(trumbowyg.$ed[0],0)
							} else {
								// refresh(trumbowyg)
								// console.log(trumbowyg)
								$(".trumbowyg-wcag-button").addClass("trumbowyg-active")
							}
						}
					});
					//refresh wcag on document change
					trumbowyg.$c.on('tbwchange',function(){
						//we only refresh when table manager is done.
						//we can only tell through the css value of the modal box from table manager.
						var top = $('.trumbowyg-modal-box').css('top')
						modalClosed = top ==="0px" || top === undefined;

						//check that wcag is toggled on and that the modal is not opened
						if(trumbowyg.o.plugins.wcag && modalClosed) {
							refresh(trumbowyg)
							if(!$(".trumbowyg-wcag-button")[0].classList.contains("trumbowyg-active")){
								$(".trumbowyg-wcag-button").addClass("trumbowyg-active")
							}
						}
					});


				}
			}
		}
	});
})(jQuery);
