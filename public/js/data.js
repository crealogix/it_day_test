var CLX = function(){
  return {};
};

//returns a PROMISE
CLX.GetTweet = function(hashtag){
  var tweets;

  function ajax(){
    defer = $.Deferred();

    return $.ajax({
      url: "http:/tweets/" + hashtag,
      type: "GET",
      dataType: "json",
      contentType: 'application/json; charset=utf-8',
      success: function(data){
        return defer.resolve(data)
      }
    });
  };

  return ajax();
};

