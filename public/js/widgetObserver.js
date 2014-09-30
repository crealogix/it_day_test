//.init of a function accepts a string to process
CLX.prototype.TweetScanner = function(){
	var string, criticalWords = {}, result = 50, i, prop, self;

	self = this;
	criticalWords.good = ['brand new', 'excited to see', 'launched ', 'future', 'deal to close', 'goes up', 'makes it easier', 'happy'];

	//parse string
	self.scanTweet = function(string){
		for(var prop in criticalWords){
			for(i=0;i<criticalWords[prop].length;i++){
				//if some critical work found, increse progress bar
				if( string.indexOf(criticalWords[prop][i]) > -1 ){
					result = result - 10;
				}
			}
		}
	};

	//result needs to be a precentage to set the progressbar next to stock name
	self.init = function(string){
		string = string;
		self.scanTweet(string);

		if( result < 0 ){
			result = 0;
		}

		return result;
	};

	return self;
};

//appending function
CLX.AddToList = function(addTo, addFrom){
	var self, clx, stockCounter, tweets = {}, defer, i, scanner, barWidth = 0, failedToLoad = [],
		tweetsModalTemplate = '<div class="modal fade bs-example-modal-lg twet-modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button><div class="modal-content padding-20"><h4 class="tweet-topic capital-text"></h4><div class="tweet-list"></div></div></div></div>',
		buyModalTemplate = '<div class="modal fade bs-example-modal-lg trade-modal-buy" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button><div class="modal-content padding-20"><h4>Buy stock: <span class="stock-to-trade"></span></h4><input placeholder="Ammount to buy" type="text" class="width-35"><input data-trade="buy" type="button" value="Buy" class="btn btn-info" placeholder="ammount"></div></div></div>',
		sellModalTemplate = '<div class="modal fade bs-example-modal-lg trade-modal-sell" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button><div class="modal-content padding-20"><h4>Sell stock: <span class="stock-to-trade"></span></h4><input placeholder="Ammount to sell" type="text" class="width-35"><input data-trade="sell" type="button" value="Sell" class="btn btn-success" placeholder="ammount"></div></div></div>';

	self = this;
	defer = $.Deferred();
	clx = new CLX();
	stockCounter = 0;

	//append loader on function call
	addPreloader('../css/images/loader.gif');

	//get tweets
	self.getObserver = function(stock){
		//count stocks
		stockCounter++;

		clx.GetTweet(stock).then(function(data){
			//cache tweets
			tweets[stock] = data;

			if( typeof tweets[stock].statuses === 'undefined' ){
				failedToLoad.push(stock);
				stockCounter--;
				clx.GetTweet(stock);

				if(stockCounter === 0){
					console.log('Load done!');
					$('#preloader').remove();
					console.log( 'Failed to load: ' + failedToLoad );
				}

				return false;
			}

			console.log(tweets);
			
			scanner = clx.TweetScanner();

			for(i=0;i<tweets[stock].statuses.length;i++){
				var setter = scanner.init(tweets[stock].statuses[i].text.toLowerCase());
				barWidth = setter;
			}

			stockCounter--;

			self.appendToList(stock);

			if(stockCounter === 0){
				console.log('Load done!');
				$('#preloader').remove();

				if(failedToLoad.length > 0){
					console.log( 'Failed to load: ' + failedToLoad );
				}
			}
		});
	};

	function getListHolder(addTo){
		return '#' + addTo;
	}

	function addPreloader(url){
		var preloader = '<img id="preloader" class="preloader" src="' + url +'">';

		$( getListHolder(addTo) ).append( preloader );
	}

	function formatText(string,word){
		var stringToFormat = string.toLowerCase(),
			regExp = new RegExp(word, 'g');

		subString = stringToFormat.replace(regExp, '<span class="highlight">' + word + '</span>');

		return subString;
	}

	$( getListHolder(addTo) ).on('click', '.btn[data-trade]', function(){
		var stockName = $(this).data().stock,
			stockNameHolder = $('.stock-to-trade');

		$('.modal.fade.bs-example-modal-lg').find('input[type=text]').val('');
		stockNameHolder.text(stockName);
	});	

	self.appendToList = function(stockName){
		var tableRowTemplate = '<ul id="stock_'+ stockName +'" class="table-content clearfix"><li class="width-15 capital-text">'+ stockName +'</li><li class="width-7 text-center">--</li><li class="text-right width-12">--</li><li class="text-right width-12">--</li><li class="text-right width-7"><p class="font-12-success padding-5-0"><span class="font-bold"> -- %</span></p></li><li class="width-25"><div class="indicator"><span class="indicator-positive">Positive</span><span class="indicator-negative">Negative</span><span class="mask" style="width:'+ barWidth +'%"></span><span class="bar"></span></div></li><li> <input data-trade="buy" type="button" value="Buy" data-trade="buy" data-stock="' + stockName + '" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg.trade-modal-buy"> <input data-trade="sell" type="button" value="Sell" data-stock="' + stockName + '" class="btn btn-success" data-toggle="modal" data-target=".bs-example-modal-lg.trade-modal-sell"> <input data-trade="stop" type="button" data-stock="' + stockName + '" value="Tweets" class="btn btn-primary getTweets" data-toggle="modal" data-target=".bs-example-modal-lg.twet-modal"> </li></ul>';
		$( '.preloader' ).before( $(tableRowTemplate) );
	};

	//show list of tweets
	function showTweets(){
		$( getListHolder(addTo) ).on('click', '.getTweets', function() {
		    var stockName = $(this).data().stock,
		    	modalList = $('.modal-content>.tweet-list'),
		    	modalHead = $('.modal-content>.tweet-topic'),
		    	tweetText,
		    	userName;	

		    modalHead.empty();
		    modalList.empty();

		    modalHead.append( stockName + ' tweets:');

		    for(i=0;i<tweets[stockName].statuses.length;i++){
		    	tweetText = tweets[stockName].statuses[i].text;
		    	userName = tweets[stockName].statuses[i].user.name;
		    	modalList.append( 'By ' + userName + ':  ' + formatText(tweetText, stockName.toLowerCase() ) + '<br/>');
		    }
		});
	}

	self.init = function(){
		//append modal for displaying tweets
		if( $('.modal.fade.bs-example-modal-lg').length === 0 ){
	    	$('body').append( tweetsModalTemplate );
	    }

	    //append modal for buying
	    if( $('.modal.fade.bs-example-modal-lg.trade-modal-buy').length === 0 ){
	    	$('body').append( buyModalTemplate );
	    }

	    //append modal for selling
	    if( $('.modal.fade.bs-example-modal-lg.trade-modal-sell').length === 0 ){
	    	$('body').append( sellModalTemplate );
	    }

	    //bind show tweets event
		showTweets();
	};

	return self;
};

//pass argument where to append results 
var addTo = CLX.AddToList('stock-table-holder');

//adding tweets to observe
addTo.getObserver('IBM');
addTo.getObserver('Societe Generale');
addTo.getObserver('General Electrics');
addTo.getObserver('YAHOO');
addTo.getObserver('Microsoft');
addTo.getObserver('Google');

//initialize
addTo.init();