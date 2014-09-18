CLX.Layout = (function(argument) {
	$('.stock-list li').on({
		click: function(){
			$(this).find('.stock-options').removeClass('hide');
		},
		mouseleave: function(){
			$(this).find('.stock-options').addClass('hide');	
		}
	})
}());