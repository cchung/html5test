$( function() {

	// index page
	$('#inputset div').hide();
	ToggleDisplay($('.optionset:checked').val());

	$('.optionset').click( function() {
		ToggleDisplay($('.optionset:checked').val());
	});
	
	$('.expandable header').click( function() {
		$(this).parent().toggleClass('collapsed');
	});
	
	// dashboard test page
	$('#dashboard').masonry({
		itemSelector: '.widget',
		columnWidth: 241,
		gutterWidth: 20,
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









