(function() {
  function listener(event){
    var allowedTransaction = ['Buy', 'Sell'], style = ['#5bc0de', '#5cb85c'], indexAt,
      tradeTypeText = document.getElementById("trade-type"),
      tradeStock = document.getElementById("trade-stock"),
      input = document.getElementById("amount"),
      submit = document.getElementById("trade"),
      stockName = event.data.stockName,
      tradeType = event.data.tradeType;

    if( allowedTransaction.indexOf( event.data.tradeType ) === -1 ){
      return false;
    }

    response = event.data.tradeType + " " + input.value + " stocks";

    indexAt = allowedTransaction.indexOf( event.data.tradeType );

      tradeTypeText.innerHTML = tradeType;
      tradeTypeText.style.color = style[indexAt];
      tradeStock.innerHTML = stockName + " stocks";

      input.removeAttribute("disabled");

      submit.onclick = function(){
        responser(stockName, input.value, tradeType);
        input.value = "";
      };
  }

  function responser(stockName, amount, tradeType){
    var response = {};

    response.tradeType = tradeType.toLowerCase();
    response.stockName = stockName;
    response.amount = amount;

    parent.postMessage(response, location.href);
  }

  if (window.addEventListener){
    addEventListener("message", listener, false);
  } else {
    attachEvent("onmessage", listener);
  }

  $(document).ready(function() {
      $("#amount").keydown(function (e) {
          // Allow: backspace, delete, tab, escape, enter and .
          if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
               // Allow: Ctrl+A
              (e.keyCode == 65 && e.ctrlKey === true) || 
               // Allow: home, end, left, right
              (e.keyCode >= 35 && e.keyCode <= 39)) {
                   // let it happen, don't do anything
                   return;
          }
          // Ensure that it is a number and stop the keypress
          if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
              e.preventDefault();
          }
      });
  });
})();
