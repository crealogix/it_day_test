$(function(){
	$.ajax({
		url: "http:/test",
  		type: "GET",
  		dataType: "json",
  		success: function(data){
  			console.log(data);
  			// $('body').append( '<h1>Last 15 tweets containing #node or "nodeJs":</h1>');

  			// $.each(data.statuses, function(){
  			// 	$('body').append( '<p>' + this.text + '</p>');
  			// });
  		}
	});
}());

