var twitter = require('twitter'),
	Q = require('q');

var twit = new twitter({
    consumer_key: 'your consumer key',
    consumer_secret: 'your consumer secret',
    access_token_key: 'your access token key',
    access_token_secret: 'your access token secret'
});

exports.getTweet = function( hashtag ){
    var deferred = Q.defer();

    twit.search( hashtag, {include_entities:true, lang: 'en', geo:true, count: 100}, function(data) {
        deferred.resolve( data );
    });

    return deferred.promise;
};

