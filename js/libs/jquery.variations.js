/* ****************************************************************************
	jVariations works with (1) no parameters, (2) a string parameter, or (3) an 
	object pararmeter whose properties override the default options. Note, all 
	properties are optional. Also, they can be mixed and matched together to 
	achieve desired results. Confused? See examples below:

	****************************************************************************
	SIMPLIFED EXAMPLE USAGE

	// add a checkbox to the control panel with a label of "Show Variation #"
	$('p').jVariation();

	// add a checkbox to the control panel with a label of "Show all paragraphs"
	$('p').jVariation("Show all paragraphs");

	// add a checkbox to the control panel with a label of "Show all paragraphs"
	$('p').jVariation({ label: "Show all paragraphs" });

	// add an unchecked checkbox to the control panel
	// the paragraphs will be hidden using the default .hide()
	$('p').jVariation({ autoHide: true });

	// creates three variations that are mutually exclusive
	// adds three radio buttons to control panel and groups them together
	// autoHide the last two variations (so the first radio button is selected)
	$('#promoTypeA').jVariation({ group: 'promo_area' })
	$('#promoTypeB').jVariation({ group: 'promo_area', autoHide: true })
	$('#promoTypeC').jVariation({ group: 'promo_area', autoHide: true })

	// add a checkbox to the control panel with a label of "Show Variation #"
	// override the default .show() and .hide() with custom functions
	$('p').jVariation({
		onShow: function(){ this.addClass('showMe') },
		onHide: function(){ this.removeClass() }
	});
			
	// creates two variations that are mutually exclusive
	// chains the variations on the same object (w00t! chaining!)
	// first variation adds a class ('intro') to the paragraph tag
	// second varitation removes all classes on the pagagraph tag
	// second variation is set to autoHide to ensure that first radio button is selected
	// in both cases, onHide is set to false because onShow does all the work
	$('p:eq(0)').jVariation({
		onShow: function(){ this.addClass('intro'); },
		onHide: false,
		group: "first_paragraph"
	}).jVariation({
		autoHide: true,
		onShow: function(){ this.removeClass(); },
		onHide: false,
		group: "first_paragraph"
	});

	// creates a variation for div.wrapper
	// creates a separate variation for all paragraphs inside div.wrapper
	// if the user clicks to show the paragraph tags and div.wrapper is hidden, div.wrapper will be shown as well
	$('div.wrapper').jVariation({ id: 'theContainingDiv' });
	$('div.wrapper p').jVariation({ require: 'theContainingDiv' });

	****************************************************************************
	DOCUMENTATION

	label:
	It's just a string that's used as the label for the checkbox/radio button.

	autoHide:
	Boolean (either true or false). If autoHide is true then the HTML elements are 
	hidden using the default .hide() or the onHide function, if provided.

	onShow:
	Either false, or a function. I don't see any real purpose to "false" for onShow, 
	but I like the symmetry with onHide. If false, it is ignored. If a function, the 
	function will be used instead of the default .show(). Note, the 'this' keyword 
	in your function will refer to the collection of jQuery objects this variation 
	is applied to. So 'this' in $('p').jVariation( onShow: function(){ this }); will 
	refer to $('p')

	onHide:
	Either false, or a function. If false, the hiding of a variation is ignored. 
	This is useful with radio buttons that change the class name of a single DIV 
	when selected (shown) and should therefore do nothing when hidden. If a function 
	is provided, the function will be used instead of the default .hide(). Note, the 
	'this' keyword in your function will refer to the collect of jQuery objects this 
	variation is applied to. See onShow, and simplified examples above.

	group:
	A string that contains no spaces or funny characters. It is used to associate 
	mutually exclusive variations (aka radio buttons).

	id:
	A string that contains no spaces or funny characters. Must be unique, if 
	declaring more than one variation id. Used to identify a variation that other 
	variations require.

	require:
	A string that contains no spaces or funny characters. Must reference the 
	id of a variation that is required. The string can be a comma separated list
	of ids, should more than one variation be required... but no spaces, just commas.
	
******************************************************************************* */


/**
* Styles required for jVariations
*/
var jVariationCSS = '<style type="text/css">';
jVariationCSS += '#jvariations{position:absolute;z-index:10000;top:110px;left:550px;background:white;width:280px;border: solid 1px #ccc;font-size:11px;font-family:verdana;padding:0;margin:0;}';
jVariationCSS += '#jvariations h1{display:block;font-size:12px;font-weight:bold;background:#666;color:#fff;cursor:move;margin:1px;padding:2px 2px 4px 4px;font-variant:small-caps;}';
jVariationCSS += '#jvariations fieldset{padding:0;margin:0;border-style:none;border-top: solid 1px #ccc;border-bottom: solid 1px #fff;}';
jVariationCSS += '#jvariations label{display:block;background:#efefef;padding:0;margin:0;border: solid 1px #fff;border-bottom:none;position:relative;overflow:hidden;clear:both;zoom:1;}';
jVariationCSS += '#jvariations label.jvariation_hover{background:#fff;}';
jVariationCSS += '#jvariations label.jvariation_required{background:#ccc;}';
jVariationCSS += '#jvariations label span.label{width:252px;display:block;float:left;padding:3px 0 3px 0;margin:0;cursor:default;}';
jVariationCSS += '#jvariations label span.input{width:22px;display:block;float:left;padding:0;margin:0;}';
jVariationCSS += '#jvariations label span.input input{}';
jVariationCSS += '</style>';
document.write(jVariationCSS);


/**
* jVariations is a developer tool that generates a control panel to show and 
* hide variations (aka corner cases) in a single HTML template.
* 
* jVariations r2 // 2007.07.06 // jQuery 1.1.3
* <http://localhost/brian/resources/jquery.variations.html>
* 
* @author    Brian Cherne <brian@cherne.net>
*/
(function($) {
	$.jVariationData = { length: 0 };
	$.fn.jVariation = function( param ) {
	
		if ( !this[0] ) { return this; }

		// set the current variation number
		var n = ++$.jVariationData.length;

		// set the default configuration
		var v = {
			//autoHide: false,
			label: 'Show Variation ' + n,
			//controlPanelLabel: false,
			//group: false,
			onShow: function(){ this.show(); },
			onHide: function(){ this.hide(); },
			//require: false,
			id: 'jvInput_' + n
		}

		// prep param for extending configuration options
		param = typeof param == 'string' ? { label: param } : param;

		// merge confirguration options with params
		$.extend( v , param );
		v.collection = this;
		v.id = 'jvariation_' + v.id;
		if( v.require ){ v.require = v.require.split(','); }
		
		// write jvariations control panel to HTML DOM if it does not exist yet
		if( !document.getElementById('jvariations') ) {
			$('<div id="jvariations"><h1>variations control panel</h1></div>').appendTo('body').css('opacity',.6).hover(function(){$(this).fadeTo(200,1)},function(){$(this).fadeTo(200,0.6)}).jqVariationDrag('h1');
		}

		var handleOver = function(){
			$(this).addClass('jvariation_hover');
			if(v.require){ $.each(v.require,function(i,n){ $('#jvariation_'+n).not("[@checked]").parent().parent().addClass('jvariation_required'); }) }
		}

		var handleOut = function(){
			$(this).removeClass('jvariation_hover');
			if(v.require){ $.each(v.require,function(i,n){ $('#jvariation_'+n).parent().parent().removeClass(); }) }
		}

		// assume we are showing the variation thus the checkbox/radio button is checked
		var checked = ' checked="checked"'; v.lastState = 'checked';
		// if autoHide is defined, then automatically hide the variation
		if( v.autoHide ) {
			if (v.onHide) { v.onHide.apply(v.collection); }
			checked = ''; v.lastState = 'notChecked';
		}

		// save variation data to global object for referencing in click function
		$.jVariationData[v.id] = v;

		// RADIO BUTTONS // if group is defined
		if( v.group ) {

			// if the group fieldset doesn't exist (for this group) then create it
			if( !document.getElementById('jvariation_jvGroup_'+v.group) ) {
				$('<fieldset id="jvariation_jvGroup_'+v.group+'"></fieldset>').appendTo("#jvariations");
			}

			// write label and input tag // append to control panel // attach hover to label
			$('<label for="'+v.id+'"><span class="input"><input id="'+v.id+'" type="radio" name="jvariation_jvGroup_'+v.group+'"'+checked+' /></span><span class="label">'+v.label+'</span></label>').appendTo("#jvariation_jvGroup_"+v.group).hover( handleOver , handleOut );

			$('#'+v.id).click(function(){
				// delay making any changes by 1ms to make sure radio element is actually checked
				// when programmatically clicked via "require" checked state change is not immediate
				setTimeout( function(){
					$("input","#jvariation_jvGroup_"+v.group).not("[@checked]").each(function(){
						var vData = $.jVariationData[this.id];
						if( vData.lastState == 'checked' ){
							if(vData.onHide){vData.onHide.apply(vData.collection);}
							vData.lastState = 'notChecked';
						}
					}).end().filter("[@checked]").each(function(){
						var vData = $.jVariationData[this.id];
						if( vData.lastState == 'notChecked' ){
							if(vData.onShow){vData.onShow.apply(vData.collection);}
							vData.lastState = 'checked';
						}
						if(vData.require){ $.each(vData.require,function(i,n){ $('#jvariation_'+n).not(":checked").click(); }) }
					});
				} , 1 ); // close timeout
			}); // close click

		// CHECKBOXES // if group is UNdefined
		} else {
			// write label and input tag // append to control panel // attach hover to label
			$('<label for="'+v.id+'"><span class="input"><input id="'+v.id+'" type="checkbox"'+checked+' /></span><span class="label">'+v.label+'</span></label>').appendTo("#jvariations").hover( handleOver , handleOut ).wrap('<fieldset></fieldset>');

			$('#'+v.id).click(function(){
				// store checkbox element for use inside timeout function
				var oInput = this;
				// delay making any changes by 1ms to make sure checkbox element is actually checked
				// when programmatically clicked via "require" checked state change is not immediate
				setTimeout( function(){
					if(oInput.checked) {
						v.onShow.apply(v.collection);
						if(v.require){ $.each(v.require,function(i,n){ $('#jvariation_'+n).not(":checked").click(); }) }
					} else {
						v.onHide.apply(v.collection);
					}
				} , 1 ); // close timeout
			}); // close click
		} // close else (this is a checkbox, not a radio button)

		// return the found set of jQuery objects in case someone wants to chain
		return this;
	}
})(jQuery);

/**
* jqDnR - Minimalistic Drag'n'Resize for jQuery.
* <http://dev.iceburg.net/jquery/jqDnR/>
* Renamed jqVariationDnR to avoid potential naming conflicts should you have a modified jqDnR already installed.
*/
(function($){$.fn.jqVariationDrag=function(r){$.jqVariationDnR.init(this,r,'d');return this;};$.fn.jqVariationResize=function(r){$.jqVariationDnR.init(this,r,'r');return this;};$.jqVariationDnR={init:function(w,r,t){r=(r)?$(r,w):w;r.bind('mousedown',{w:w,t:t},function(e){var h=e.data;var w=h.w;hash=$.extend({oX:f(w,'left'),oY:f(w,'top'),oW:f(w,'width'),oH:f(w,'height'),pX:e.pageX,pY:e.pageY,o:w.css('opacity')},h);h.w.css('opacity',0.8);$().mousemove($.jqVariationDnR.drag).mouseup($.jqVariationDnR.stop);return false;});},drag:function(e){var h=hash;var w=h.w[0];if(h.t=='d')h.w.css({left:h.oX+e.pageX-h.pX,top:h.oY+e.pageY-h.pY});else h.w.css({width:Math.max(e.pageX-h.pX+h.oW,0),height:Math.max(e.pageY-h.pY+h.oH,0)});return false;},stop:function(){var j=$.jqVariationDnR;hash.w.css('opacity',hash.o);$().unbind('mousemove',j.drag).unbind('mouseup',j.stop);},h:false};var hash=$.jqVariationDnR.h;var f=function(w,t){return parseInt(w.css(t))||0};})(jQuery);
