var prixTotal;
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
                console.log(document.getElementById(element.title).value);
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
        for(let product of products){
            for(let color of product.colors){
                var panier = JSON.parse(localStorage.getItem(product._id+color));
                console.log(product._id)
                console.log(panier);
                if(panier){
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
                        <div class="cart__item__content__settings">
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
                    prixTotal += product.price;
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









    