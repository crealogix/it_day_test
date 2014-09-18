CLX.Observer = function(){
	var self = this;
	var templates = '<li class="clearfix"><h4>Dow Jones</h4> <div class="indicator"><span class="mask"></span><span class="bar"></span></div><div class="stock-options hide"><input data-trade="buy" type="button" value="Buy" class="btn btn-info"><input data-trade="sell" type="button" value="Sell" class="btn btn-success"><input data-trade="stop" type="button" value="Stop tracking" class="btn btn-danger"></div></li>';

	$('.stock-list li').on('click', function(){
	  $(this).find('.stock-options').removeClass('hide');
	});

	$('.stock-list li').on('mouseleave', function(){
	  $(this).find('.stock-options').addClass('hide');
	});

	self.addStockToObserver = function(stock){
		CLX.GetTweet(stock).then(function(data){
			console.log(data);
	  		return data;
		});
	}

	self.init = function(stockName){
		var stock = stockName;
		self.addStockToObserver(stockName)
	};

	return self;
};

CLX.AddToList = function(addFrom, addTo){
	var self, getForm, getFormValue, stocks = [];

	self = this;

	getForm = function(addFrom){
		return '#' + addFrom;
	};

	getFormValue = function(){
		$( getForm(addFrom) ).submit(function(event){
			var input = $(this).find('input[type=text]'), 
				tweets = CLX.Observer();
			event.preventDefault();

			if( input.val() === '' ){
				return false;
			}

			if( stocks.indexOf( input.val() ) === -1 ){
				stocks.push( input.val() );
				tweets.init( input.val() );
				console.log('Adding stock!');
			}else{
				throw new Error('Allready in the Stock List!');
			}

			return false;
		})
	};

	self.init = function(){
		getFormValue();
	};

	return self;
};

var addTo = CLX.AddToList('stock-form');
addTo.init();

