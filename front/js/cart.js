var arrayProductId =[];
const tableauForm = [
    {title : "firstName",regex : /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/},
    {title : "lastName", regex : /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/},
    {title : "address", regex : /([0-9]*) ?([a-zA-Z,\. ]*) ?([0-9]{5}) ?([a-zA-Z]*)/},
    {title : "city", regex : /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/},
    {title : "email", regex : /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/},
]
for (let element of tableauForm){
    document.getElementById(element.title).addEventListener("input", function(elt) {
        if (element.regex.test(elt.target.value)) {
                document.getElementById(element.title + "ErrorMsg").innerText = "";
        } else {
            document.getElementById(element.title + "ErrorMsg").innerText = "Non valide";
        }
});
}

function get(){
    fetch("http://localhost:3000/api/products")
    .then (function(res){
        if(res.ok){
            return  res.json();        
        }
    })
    .then(function(products){
        var prixTotal = 0;
        var quantityTotal = 0;
        document.getElementById("cart__items").innerHTML = "";
        document.getElementById("totalPrice").innerText = 0;
        document.getElementById("totalQuantity").innerText = 0;
        for(let product of products){
            for(let color of product.colors){
                var panier = JSON.parse(localStorage.getItem(product._id+"-"+color));
                
                if(panier){
                    arrayProductId.push(panier.id);
                    document.getElementById("cart__items").innerHTML += 
                        `<article class="cart__item" data-id="${panier.id}" data-color="${panier.color}">
                            <div class="cart__item__img">
                                <img src="${product.imageUrl}" alt="${product.altTxt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${product.name}</h2>
                                    <p>${panier.color}</p>
                                    <p>${product.price}€</p>
                                </div>
                                <div class="cart__item__content__settings" id="${panier.id +"-"+ panier.color}">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté : </p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${panier.quantité}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                            </div>
                        </article>`;
                    prixTotal += product.price*panier.quantité;
                    quantityTotal += parseInt(panier.quantité);
                    document.getElementById("totalPrice").innerText = prixTotal;
                    document.getElementById("totalQuantity").innerText = quantityTotal;
            }
            }            
        }   
    })
    .catch (function(err){
        alert("erreur");
    })
}
get();
document.addEventListener('click', function(event){
    let recupClé = event.target.parentNode;
    let clé = recupClé.parentNode.id
    if(JSON.parse(localStorage.getItem(clé)) && event.target.className == "deleteItem"){
        
        localStorage.removeItem(clé);
        get();
    }
})
document.addEventListener('input', function(event){
    let recupClé = event.target.parentNode;
    let clé = recupClé.parentNode.id
    if(JSON.parse(localStorage.getItem(clé)) && event.target.className == "itemQuantity"){
        let idAndColor = clé.split('-');
        let newQuantity = {
            id : idAndColor[0],
            color : idAndColor[1],
            quantité : event.target.value
        };
        localStorage.setItem(clé, JSON.stringify(newQuantity));
        get();
    }
})
document.getElementById("order").addEventListener('click',function(event){
    
    var errForm = false;
    for( let element of tableauForm){
        if(document.getElementById(element.title + "ErrorMsg").textContent){
            errForm = true;
        } 
    }
    if (errForm){
        event.preventDefault();
        alert ("Merci de remplir correctement les champs du formulaire");
    }else{
        var newForm = {
            firstName : document.getElementById("firstName").value,
            lastName : document.getElementById("lastName").value,
            address : document.getElementById("address").value,
            city : document.getElementById("city").value,
            email : document.getElementById("email").value
        }
        event.preventDefault();
        fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
         },
        body: JSON.stringify({contact: newForm, products: arrayProductId})
        })

        .then(function(res) {
            if (res.ok) {
              return res.json();
            }
        })
          .then(function(value) {
            console.log(value.orderId);
        })
        .catch (function(err){
            alert("erreur");
        })
    }
},false)
