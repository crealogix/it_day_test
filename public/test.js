$(function(){
	$.ajax({
		url: "http:/test",
  		type: "GET",
  		dataType: "json",
  		success: function(data){
  			console.log(data);
  			
  			$('body').append( '<h1>Server response</h1> <p>' + data.user.description + ' by: ' + data.user.name + '</p>' )
  		}
	});
}());

