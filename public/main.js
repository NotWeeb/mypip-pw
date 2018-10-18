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
	
const intervals = [];

$('*').click(function(e) {
	
	

	function disableMusic(el) {
		const cookie = $.cookie('disabled-music');
		if (cookie) {
			$.removeCookie('disabled-music');
		} else {
			$.cookie('disabled-music', 1);
		}
		setDisableText();
	};


	const makeExplode = () => {
		confetti.addConfettiParticles(40, -45, 10000, 0, window.outerHeight-120); // bottom left
		confetti.addConfettiParticles(40, -130, 10000, window.outerWidth, window.outerHeight-120); // bottom right
		confetti.addConfettiParticles(40, 45, 10000, -40, -120); // top left
		confetti.addConfettiParticles(40, 130, 10000, window.outerWidth+40, -120); // top right
	}

	if (!$('.this-is-not-an-easter-egg').is(e.target) && $('.this-is-not-an-easter-egg').has(e.target).length === 0) {
		
		clearInterval(intervals[0]);
		clearInterval(intervals[1]);
		
		$('.doTheShake').removeClass('shake-hard');
		$('.doTheShake').removeClass('shake-constant');
		$('#yeetAudio').trigger('pause');
		
	} else {
		
		$('.doTheShake').addClass('shake-hard');
		$('.doTheShake').addClass('shake-constant');
		
		if (!$.cookie('disabled-music')) {
			$('#yeetAudio').trigger('play');
			$('#yeetAudio')[0].currentTime = 1;
		}

		makeExplode();

		intervals[0] = setInterval(makeExplode, 1700);

		let is = true;
		intervals[1] = setInterval(() => {
			$('#canvas').css('filter', is ? 'invert(100%)' : 'unset');
			is = !is;
		}, 100);
		
	}
	
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
		$('.copyIP').text('COPIED');

		$('.info-box').addClass('infoButSpam');

		var box = $('.info-box');

		if (!$.cookie('disabled-music')) {
			$('#audio').trigger('play');
			$('#audio').prop("volume", 0.1);
			$('#audio')[0].currentTime = 1;
		};
		
		confetti.addConfettiParticles(20, -45, 10000, 0, window.outerHeight-120); // bottom left
		confetti.addConfettiParticles(20, -130, 10000, window.outerWidth, window.outerHeight-120); // bottom right
		confetti.addConfettiParticles(20, 45, 10000, -40, -120); // top left
		confetti.addConfettiParticles(20, 130, 10000, window.outerWidth+40, -120); // top right

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