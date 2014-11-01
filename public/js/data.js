//global wrapper object
var CLX = function(){
  return;
};

//returns a PROMISE
CLX.prototype.GetTweet = function(hashtag){
  var tweets;

  function ajax(){
    defer = $.Deferred();

    return $.ajax({
      url: "http:/tweets/" + hashtag,
      type: "GET",
      dataType: "json",
      contentType: 'application/json; charset=utf-8',
      success: function(data){
        return defer.resolve(data);
      }
    });
  }

  return ajax();
};

//.init of a function accepts a string to process
CLX.prototype.TweetScanner = function(){
  var string, criticalWords = {}, result = 50, i, prop, self;

  self = this;
  criticalWords.good = ['brand new', 'excited to see', 'launched ', 'future',
                        'deal to close', 'goes up', 'makes it easier', 'happy', 'started'];
  criticalWords.bad = ['milestone', 'stay away'];

  //parse string
  self.scanTweet = function(string){
    for (i=0; i<criticalWords.good.length; i++){
      //if some goor critical work found, increse progress bar
      if (string.indexOf(criticalWords.good[i]) > -1 ){
        result = result - 10;
      }
    }

    for (i=0; i<criticalWords.bad.length; i++) {
      //if some goor critical work found, increse progress bar
      if( string.indexOf(criticalWords.bad[i]) > -1 ){
        result = result + 10;
      }
    }
  };

  //result needs to be a precentage to set the progressbar next to stock name
  self.init = function(string){
    string = string;
    self.scanTweet(string);

    if (result < 0 ){
      result = 0;
    } else if( result >= 100 ){
      result = 90;
    }

    return result;
  };

  return self;
};

