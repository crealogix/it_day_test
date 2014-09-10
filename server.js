var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

app.get('/test', function(req, res){
    res.send( getTweet() );
});

app.listen(3000, '127.0.0.1', function(){
  console.log('node server started');
});

var util = require('util'),
    twitter = require('twitter');

var twit = new twitter({
    consumer_key: 'dDDYuvE5eyBsAD0ouOK1C7MtQ',
    consumer_secret: 'NrNzM1Ej7qfdfH0YDpdY6mwU0oJkIddSH3gqNJbDqs93KP5OXZ',
    access_token_key: '1129618712-GTaSK0N8UtSDZJTA0Kklgpn9wlZk1adL3vokAnp',
    access_token_secret: 'FpzsoOQaHHtSltwlnpFL8urLaxamUjM3nZZEHv4B3hv2C'
});

var utils;

var getTweet = function(){ 
	twit.search('nodejs OR #node', {include_entities:true, count: 15}, function(data) {
        console.log(util.inspect(data));
    	utils = data;
	});

	return utils;
};