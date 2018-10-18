jQuery.fn.selectText = function(){
	this.find('input').each(function() {
		if($(this).prev().length == 0 || !$(this).prev().hasClass('p_copy')) { 
			$('<p class="p_copy" style="position: absolute; z-index: -1;"></p>').insertBefore($(this));
		};
		$(this).prev().html($(this).val());
	});
	var doc = document;
	var element = this[0];
	if (doc.body.createTextRange) {
		var range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) {
		var selection = window.getSelection();        
		var range = document.createRange();
		range.selectNodeContents(element);
		selection.removeAllRanges();
		selection.addRange(range);
	};
};

$('*').click(function(e) {
	var container = $('.ipDisplay, .copyIP');
	if (!container.is(e.target) && container.has(e.target).length === 0) {

		$('.copyIP').removeClass('copied');
		$('.copyIP').text('COPY');
		$('#audio').trigger('pause');
		$('#audio')[0].currentTime = 1;

		$('.info-box').removeClass('infoButSpam');

	} else {

		$('.ipDisplay').selectText();

		document.execCommand("copy");

		$('.copyIP').addClass('copied');
		$('.copyIP').text('COPIED!');

		$('.info-box').addClass('infoButSpam');

		var box = $('.info-box');

		if (!$.cookie('disabled-music')) {
			$('#audio').trigger('play');
			$('#audio').prop("volume", 0.1);
			$('#audio')[0].currentTime = 1;
		};

		confetti.addConfettiParticles(40, -45, 5000, $(window).width()/2-100, $(window).height()/2+100);
		confetti.addConfettiParticles(40, -130, 5000, $(window).width()/2+100, $(window).height()/2+100);
		confetti.addConfettiParticles(40, 45, 5000, $(window).width()/2-100, $(window).height()/2-100);
		confetti.addConfettiParticles(40, 130, 5000, $(window).width()/2+100, $(window).height()/2-100);

	};
});


let element, circle, d, x, y;

var clickables = [".top"];

$(clickables.toString()).click(function(e){
	element = $(this);

	if(element.find(".circle").length == 0) {
		element.prepend("<span class='circle'></span>");
	};

	circle = element.find(".circle");
	circle.removeClass("animate");

	if(!circle.height() && !circle.width()) {
		d = Math.max(element.outerWidth(), element.outerHeight());
		circle.css({height: d, width: d});
	};

	x = e.pageX - element.offset().left - circle.width()/2;
	y = e.pageY - element.offset().top - circle.height()/2;

	circle.css({top: y+'px', left: x+'px'}).addClass("animate");
});

function setDisableText () {
	$('.musicDisabler a').text(
		!$.cookie('disabled-music') 
		? 'Disable Music' 
		: 'Enable Music'
	);
};

$(document).ready(function() {
	setDisableText();
});

function disableMusic(el) {
	const cookie = $.cookie('disabled-music');
	if (cookie) {
		$.removeCookie('disabled-music');
	} else {
		$.cookie('disabled-music', 1);
	}
	setDisableText();
};