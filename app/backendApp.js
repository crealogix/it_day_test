var twitter = require('twitter'),
	Q = require('q');

var twit = new twitter({
    consumer_key: 'dDDYuvE5eyBsAD0ouOK1C7MtQ',
    consumer_secret: 'NrNzM1Ej7qfdfH0YDpdY6mwU0oJkIddSH3gqNJbDqs93KP5OXZ',
    access_token_key: '1129618712-GTaSK0N8UtSDZJTA0Kklgpn9wlZk1adL3vokAnp',
    access_token_secret: 'FpzsoOQaHHtSltwlnpFL8urLaxamUjM3nZZEHv4B3hv2C'
});

exports.getTweet = function( hashtag ){
    var deferred = Q.defer();

    twit.search( hashtag, {include_entities:true, lang: 'en', geo:true}, function(data) {
        deferred.resolve( data );
    });

    return deferred.promise;
};

