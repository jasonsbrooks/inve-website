jQuery(document).ready(function($){
	$("#head").height($(window).height());
	var $timeline_block = $('.cd-timeline-block');

	//hide timeline blocks which are outside the viewport
	$timeline_block.each(function(){
		if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.75) {
			$(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
		}
	});

	//on scolling, show/animate timeline blocks when enter the viewport
	$(window).on('scroll', function(){
		$timeline_block.each(function(){
			if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.75 && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) {
				$(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
			}
		});
	});

	$(window).on("resize",function() {
		var bodyheight = $(window).height();
		$("#head").height(bodyheight);
	});

  	$("#arrow-down").click(function() {
	    $('html, body').animate({
	        scrollTop: $("#about").offset().top
	    }, 1000);
	});
});