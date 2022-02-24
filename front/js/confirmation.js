fetch("http://localhost:3000/api/products/order")
    .then (function(res){
        if(res.ok){
            return  res.json();        
        }
    })
    .then(function(commande){
        console.log(commande)
        //document.getElementById("orderId").innerText = comande.orderId;
    })
    .catch (function(err){
        console.log(err);
    })