CLX.AddToList = function(addFrom, addTo){
	var self, clx, stocks = [], tweets = {}, defer, i, scanner, barWidth = 0,
		modalTemplate = '<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content padding-20"><h4 class="tweet-topic capital-text"></h4><div class="tweet-list"></div></div></div></div>';

	self = this;
	addFrom = addFrom;
	addTo = addTo;
	defer = $.Deferred();
	clx = new CLX();

	//get tweets
	self.getObserver = function(stock){
		clx.GetTweet(stock).then(function(data){
			//cache tweets
			tweets[stock] = data;
			console.log(tweets);
			
			scanner = clx.TweetScanner();

			for(i=0;i<tweets[stock].statuses.length;i++){
				var setter = scanner.init(tweets[stock].statuses[i].text.toLowerCase());
				barWidth = setter;
			};

			self.appendToList(stock);

			$('#preloader').remove();

	  		return data;
		});
	};

	function getForm(addFrom){
		return '#' + addFrom;
	};

	function getListHolder(addTo){
		return '#' + addTo;
	};

	function addPreloader(url){
		var preloader = '<img id="preloader" class="preloader" src="' + url +'">'

		$('.stock-list').append( preloader );
	};

	function formatText(string,word){
		var string = string.toLowerCase();
		var word = word;
		var regExp = new RegExp(word, 'g');

		subString = string.replace(regExp, '<span class="highlight">' + word + '</span>');

		return subString;
	};

	self.appendToList = function(stockName){
		var listItemtemplate = '<li id="stock_'+ stockName +'" class="clearfix"><h4 class="capital-text">' + stockName + '</h4> <div class="indicator"><span class="indicator-positive">Positive</span><span class="indicator-negative">Negative</span><span class="mask" style="width:'+ barWidth +'%"></span><span class="bar"></span></div><div class="stock-options hide"><input data-trade="buy" type="button" value="Buy" class="btn btn-info"><input data-trade="sell" type="button" value="Sell" class="btn btn-success"><input data-trade="stop" type="button" value="Stop tracking" class="btn btn-danger"><input data-trade="stop" type="button" value="Tweets" class="btn btn-primary getTweets" data-toggle="modal" data-target=".bs-example-modal-lg"></div></li>',
			tableRowTemplate = '<ul id="stock_'+ stockName +'" class="table-content clearfix"><li class="width-15 capital-text">'+ stockName +'</li><li class="width-7 text-center">--</li><li class="text-right width-12">--</li><li class="text-right width-12">--</li><li class="text-right width-7"><p class="font-12-success padding-5-0"><span class="font-bold"> -- %</span></p></li><li class="width-25"><div class="indicator"><span class="indicator-positive">Positive</span><span class="indicator-negative">Negative</span><span class="mask" style="width:'+ barWidth +'%"></span><span class="bar"></span></div></li><li> <input data-trade="buy" type="button" value="Buy" class="btn btn-info"> <input data-trade="sell" type="button" value="Sell" class="btn btn-success"> <input data-trade="stop" type="button" data-stock="' + stockName + '" value="Tweets" class="btn btn-primary getTweets" data-toggle="modal" data-target=".bs-example-modal-lg"> </li></ul>'
		$( getListHolder(addTo) ).append( tableRowTemplate );

		//bind mouse and keyboard events
		CLX.Layout();

		//empty form input
		emptyInput();
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
	};

	function emptyInput(){
		$( getForm(addFrom) ).find('input[type=text]').val('');
	};

	self.getFormValue = function(value){
		$( getForm(addFrom) ).submit(function(event){
			var input = value || $(this).find('input[type=text]');

			event.preventDefault();

			if( input.val() === '' ){
				return false;
			}

			if( stocks.indexOf( input.val().toLowerCase() ) === -1 ){
				stocks.push( input.val().toLowerCase() );
				self.getObserver( input.val() );
				addPreloader('css/images/loader.gif');
			}else{
				alert('Allready in the Stock List!');
			}

			return false;
		})
	};

	self.init = function(){
		self.getFormValue();

		//append modal for displaying tweets
		if( $('.modal.fade.bs-example-modal-lg').length === 0 ){
	    	$('body').append( modalTemplate );
	    }

	    //bind show tweets event
		showTweets();
	};

	return self;
};

//pass arguments wich form to observe and where to append results 
var addTo = CLX.AddToList(undefined, 'stock-table-holder');
addTo.getObserver('dow jones');
addTo.getObserver('crealogix');
addTo.getObserver('microsoft');


addTo.init();