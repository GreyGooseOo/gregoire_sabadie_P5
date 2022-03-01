// variable du tableau de string contenant les ID des produit du panier
var prixTotal;
var quantityTotal;
var arrayProductId =[];
var panier = JSON.parse(localStorage.getItem('panier'));
// tableau contenant les différents ID du formulaire et les regex correspondante
const tableauForm = [
    {title : "firstName",regex : /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/},
    {title : "lastName", regex : /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/},
    {title : "address", regex : /([0-9]*) ?([a-zA-Z,\. ]*) ?([a-zA-Z]*)/},
    {title : "city", regex : /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/},
    {title : "email", regex : /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/},
]
//Boucle for en fonction des input de l'utilisateur qui verifie si c'est en accord avec la regex
for (let element of tableauForm){
    document.getElementById(element.title).addEventListener("input", function(elt) {
        if (element.regex.test(elt.target.value)) {
                document.getElementById(element.title + "ErrorMsg").innerText = "";
        } else {
            document.getElementById(element.title + "ErrorMsg").innerText = "Non valide";
        }
});
}
prixTotal = 0;
quantityTotal = 0;
document.getElementById("cart__items").innerHTML = "";
for (let product of panier){
    fetch("http://localhost:3000/api/products" + "/" + product.id)
    .then (function(res){
        if(res.ok){
            return  res.json();        
        }
    })
    .then(function(api){
        document.getElementById("cart__items").innerHTML +=
        `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                    <img src="${api.imageUrl}" alt="${api.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${api.name}</h2>
                        <p>${product.color}</p>
                        <p>${api.price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantité}" data-id="${product.id}" data-color="${product.color}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem" data-id="${product.id}" data-color="${product.color}">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`;
            prixTotal += product.price*quantité;
            quantityTotal += parseInt(quantité);
            document.getElementById("totalPrice").innerText = prixTotal;
            document.getElementById("totalQuantity").innerText = quantityTotal;
    })
    .catch (function(err){

    })
}


var btnSuppr = document.querySelectorAll('.deleteItem');
var ModifQté = document.querySelectorAll('.itemQuantity');
console.log(btnSuppr);
    console.log(ModifQté);
//supprimer un élement du panier

for(let bouton of btnSuppr){
    
    bouton.addEventListener('click', function () {
        for (let product of panier){
            if(product.id == bouton.dataset.id && product.color == bouton.dataset.color){
                panier.unshift(product);
                localStorage.setItem('panier', JSON.stringify(panier));
                buildPanier();
            };
        }
        
      })
}
//modification de la qté
document.addEventListener('input', function(event){
    if(event.target.className == "itemQuantity"){
        var panier = JSON.parse(localStorage.getItem('panier'));
        for (let product of panier){
            if(product.id == event.target.dataset.id && product.color == event.target.dataset.color){
                product.quantité = event.target.value;
            };
        }
        localStorage.setItem('panier', JSON.stringify(panier.sort()));
        buildPanier();

    }
})

// lorsque que l'utilisateur clique sur commander
document.getElementById("order").addEventListener('click',function(event){
    var errForm = false;
    var errTableauId = false
    // verification que le formulaire est remplit correctement
    for( let element of tableauForm){
        if(document.getElementById(element.title + "ErrorMsg").textContent || document.getElementById(element.title).value ==""){
            errForm = true;
        } 
    }
    //verification que le tableau de chaine des ID soit correctement reseingé
    if (arrayProductId.length === 0){
        errTableauId = true;
    }else{
        for (let productId of arrayProductId){
            if(typeof productId !=="string"){
                errTableauId = true;
            }
        }
    }
    //message d'erreur si le formulaire n'est pas bien reseigné
    if (errForm){
        event.preventDefault();
        alert ("Merci de remplir correctement les champs du formulaire");
    }else{
        //message d'erreur si le tableau ne contient pas ce qu'il faut
        if(errTableauId){
            event.preventDefault();
            alert ("Erreur : panier vide ou produits inexistant");
        }else{
            //envoi du panier dans l'API
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
            //recupération du numéro de commande et implantation dans l'url de comfirmation
              .then(function(value) {
                //suppression du panier
                localStorage.clear();
                var newUlr = document.location.href.replace('cart.html','confirmation.html?orderId='+ value.orderId);
                document.location.href = newUlr;
            })
            .catch (function(err){
                alert("La commande n'as pas pu etre transmise");
            })
        }
        
    }
},false)
