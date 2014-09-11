var express = require('express'),
    app = express(),
    backend = require('./app/backendApp');

app.use(express.static(__dirname + '/public'));

app.listen(3000, '127.0.0.1', function(){
  console.log('node server started');
});

app.get('/test', function(req, res){
    backend.getTweet().then(function(val){
        res.send( val );
    })
});