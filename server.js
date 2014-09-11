var express = require('express'),
    app = express(),
    Q = require('q');

app.use(express.static(__dirname + '/public'));

app.get('/test', function(req, res){
    res.send( getTweet().then(function(val){
        return val;
    }) );
});

app.listen(3000, '127.0.0.1', function(){
  console.log('node server started');
});

var twitter = require('twitter');

var twit = new twitter({
    consumer_key: 'dDDYuvE5eyBsAD0ouOK1C7MtQ',
    consumer_secret: 'NrNzM1Ej7qfdfH0YDpdY6mwU0oJkIddSH3gqNJbDqs93KP5OXZ',
    access_token_key: '1129618712-GTaSK0N8UtSDZJTA0Kklgpn9wlZk1adL3vokAnp',
    access_token_secret: 'FpzsoOQaHHtSltwlnpFL8urLaxamUjM3nZZEHv4B3hv2C'
});

function getTweet() {
    var deferred = Q.defer();

    twit.search('nodejs OR #node', {include_entities:true, count: 15}, function(data) {
        deferred.resolve( data );
    });

    return deferred.promise;
};