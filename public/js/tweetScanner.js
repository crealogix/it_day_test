//function accepts a string to process
CLX.TweetScanner = function(){
	var string, criticalWords = {}, result = 50, i, prop, self;

	self = this;
	criticalWords.good = ['trial in florida', 'head of user experience', 'great marketing', ' play long', 'excited to see ubs'];

	function scanTweet(string){
		for(prop in criticalWords){
			for(i=0;i<criticalWords[prop].length;i++){
				if( string.indexOf(criticalWords[prop][i]) > -1 ){
					result = result - 10;
				}
			}
		}
	};

	//result needs to be a precentage to set the progressbar next to stock name
	self.init = function(string){
		string = string;
		scanTweet(string);

		return result;
	}

	return self;
};