// récupération du numero de commande dans l'url
var orderId = document.location.href.substring(document.location.href.lastIndexOf("?")+9);
document.getElementById("orderId").innerText = orderId;