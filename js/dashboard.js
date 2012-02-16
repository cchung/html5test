$( function() {

	$('#inputset div').hide();
	ToggleDisplay($('.optionset:checked').val());

	$('.optionset').click( function() {
		ToggleDisplay($('.optionset:checked').val());
	});
	
	$('.expandable header').click( function() {
		$(this).parent().toggleClass('collapsed');
		$('#dashboard').masonry('reload');
	});
	$('#screen').click ( function() {
		$(this).fadeOut(100);
		var widget = $('section.active-widget');
		widget.removeClass('active-widget', 300).animate({
			'top': widget.data('widget-top'),
			'left': widget.data('widget-left'),
		}, 300, 'swing');
	});
	/*
	$('button').click( function() {
		var widget = $(this).parents('.widget');
		$('.widget:not' . widget).removeClass('active-widget');
		if (widget.hasClass('active-widget')) {
			$('#screen').fadeOut(50);
			widget.removeClass('active-widget', 300).animate({
				'top': widget.data('widget-top'),
				'left': widget.data('widget-left'),
			}, 300, 'swing');
		}
		else {
			$('.widget').css('z-index', 1);
			$('#screen').fadeIn(200);
			position = widget.position();
			widget.data({
				'widget-top': position.top,
				'widget-left': position.left,
			});
			if (widget.hasClass('active-two-column')) {
				widgetwidth = 350;
			}
			else if (widget.hasClass('active-three-column')) {
				widgetwidth = 550;
			}
			else if (widget.hasClass('active-four-column')) {
				widgetwidth = 662;
			}
			else {
				widgetwidth = 250;
			}
			widget.css('z-index', 5).animate({
				'top': ($(window).height()/2) - 80,
				'left': ($(window).width()/2) -  widgetwidth
			}, 300, 'swing').addClass('active-widget', 300);
		}
	});
	*/
	
	$('button').click( function() {
		var widget = $(this).parents('.widget');
		if (widget.hasClass('two-column')) {
			widget.toggleClass('two-column three-column');
		}
		else if (widget.hasClass('three-column')) {
			widget.toggleClass('three-column four-column');
		}
		else if (widget.hasClass('four-column')) {
			widget.toggleClass('four-column');
		}
		else {
			widget.toggleClass('two-column');
		}
		$('#dashboard').masonry('reload');
	});
	
	
	$('#dashboard').masonry({
		itemSelector: '.widget',
		columnWidth: 241,
		gutterWidth: 20,
		isAnimated: true,
		animationOptions : {
			duration: 300,
			easing: 'swing',
			queue: false
		}
	});
	
});

function ToggleDisplay(value) {
	$('#inputset div').hide();
	if (value== 'Option 1') {
		$('#option1Input').show();
	}
	else if (value == 'Option 2') {
		$('#option2Input').show();
	}
}









