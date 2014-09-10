var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.send('hello world');
});

app.listen(3000, '127.0.0.1', function(){
  console.log('node server started');
});
