//.init of a function accepts a string to process
CLX.prototype.TweetScanner = function(){
	var string, criticalWords = {}, result = 50, i, prop, self;

	self = this;
	criticalWords.good = ['brand new', 'excited to see', 'launched ', 'future', 'deal to close', 'goes up', 'makes it easier', 'happy', 'started'];

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
		tweetsModalTemplate = '<div class="modal fade bs-example-modal-lg twet-modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button><div class="modal-content padding-20"><h4 class="tweet-topic capital-text"></h4><div class="tweet-list"></div></div></div></div>';

	self = this;
	defer = $.Deferred();
	clx = new CLX();
	stockCounter = 0;

	//append loader on function call
	addPreloader('../css/images/loader.gif');

	//get tweets
	self.getObserver = function(stock, amount){
		var stockNameParsed = stock.toLowerCase().split(' ').join('_');

		//count stocks
		stockCounter++;

		clx.GetTweet(stock).then(function(data){
			//cache tweets
			tweets[stockNameParsed] = data;
			tweets[stockNameParsed].amount = amount || 0;

			if( typeof tweets[stockNameParsed].statuses === 'undefined' ){
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

			for(i=0;i<tweets[stockNameParsed].statuses.length;i++){
				var setter = scanner.init(tweets[stockNameParsed].statuses[i].text.toLowerCase());
				barWidth = setter;
			}

			stockCounter--;

			self.appendToList(stock, amount);

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

	self.connectTo = function(connection){
		$( getListHolder(addTo) ).on('click', '.btn[data-trade]', function(){
			var stockName = $(this).data().stock,
				tradeType = $(this).data().trade,
				stockNameHolder = $('.stock-to-trade'),
				message = {},
				win = document.getElementById(connection).contentWindow;
			
			message.stockName = stockName;
			message.tradeType = tradeType;

			win.postMessage(
				message,
		    	location.href
			);
		});
	};

	self.appendToList = function(stockName, amount){
		var stockNameParsed = stockName.split(' ').join('_'),
			amount = amount || 0, 
			tableRowTemplate = '<ul id="stock_'+ stockNameParsed +'" class="table-content clearfix"><li class="width-15 capital-text">'+ stockName +'</li><li class="amount width-7 text-center">' + amount + '</li><li class="text-right width-12">--</li><li class="text-right width-12">--</li><li class="text-right width-7"><p class="font-12-success padding-5-0"><span class="font-bold"> -- %</span></p></li><li class="width-25"><div class="indicator"><span class="indicator-positive">Positive</span><span class="indicator-negative">Negative</span><span class="mask" style="width:'+ barWidth +'%"></span><span class="bar"></span></div></li><li> <input data-trade="Buy" type="button" value="Buy" data-stock="' + stockName + '" class="btn btn-info"> <input data-trade="Sell" type="button" value="Sell" data-stock="' + stockName + '" class="btn btn-success"> <input data-trade="stop" type="button" data-stock="' + stockName + '" value="Tweets" class="btn btn-primary getTweets" data-toggle="modal" data-target=".bs-example-modal-lg.twet-modal"> </li></ul>';
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

	// Create IE + others compatible event handler
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	// Listen to message from child window
	eventer(messageEvent,function(event) {
	  	console.log(event.data);
	  	var targetId = "stock_" + event.data.stockName.split(' ').join('_'),
	  		parsedStockName = event.data.stockName.split(' ').join('_'),
	  		currAmount = parseInt ( $('#' + targetId ).find('.amount').text() ), 
	  		reqAmount = parseInt( event.data.amount ),
	  		eventType = event.data.tradeType;

	  		if( eventType === "buy" ){
	  			$("#" + targetId).find('.amount').text( currAmount + reqAmount );
	  		}else if( eventType === "sell" ){
	  			$("#" + targetId).find('.amount').text( currAmount - reqAmount )
	  		}
	},false);

	self.init = function(){
		//append modal for displaying tweets
		if( $('.modal.fade.bs-example-modal-lg').length === 0 ){
	    	$('body').append( tweetsModalTemplate );
	    }

	    //bind show tweets event
		showTweets();
	};

	return self;
};

//pass argument where to append results 
var addTo = CLX.AddToList('stock-table-holder');

//adding tweets to observe
addTo.getObserver('IBM', 25000);
addTo.getObserver('Societe Generale', 10000);
addTo.getObserver('General Electrics', 1000);
addTo.getObserver('YAHOO', 1000000);
addTo.getObserver('Microsoft', 30000);
addTo.getObserver('Google', 5000);

addTo.connectTo('tradeWidget');

//initialize
addTo.init();