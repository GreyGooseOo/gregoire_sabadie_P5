// variable du tableau de string contenant les ID des produit du panier
var arrayProductId =[];
// tableau contenant les différents ID du formulaire et les regex correspondante
const tableauForm = [
    {title : "firstName",regex : /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/},
    {title : "lastName", regex : /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/},
    {title : "address", regex : /([0-9]*) ?([a-zA-Z,\. ]*) ?([0-9]{5}) ?([a-zA-Z]*)/},
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
//fonction qui recupère les information des produits dans l'API
function get(){
    fetch("http://localhost:3000/api/products")
    .then (function(res){
        if(res.ok){
            return  res.json();        
        }
    })
    .then(function(products){
        //remise a zero de l'affichage du panier
        var prixTotal = 0;
        var quantityTotal = 0;
        arrayProductId =[];
        document.getElementById("cart__items").innerHTML = "";
        document.getElementById("totalPrice").innerText = 0;
        document.getElementById("totalQuantity").innerText = 0;
        // vérification de la présence d'un produit dans le panier avec son ID et sa couleur en fonction de la clé du localStorage
        for(let product of products){
            for(let color of product.colors){
                var panier = JSON.parse(localStorage.getItem(product._id+"-"+color));
            
                if(panier){
                    arrayProductId.push(panier.id);
                    document.getElementById("cart__items").innerHTML +=
                    // pour pouvoir modifer la qté ou supprimer, ajout de la clé du local corresspopndante au produit pour connaitre le produit a modifier
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
                    // calcul du prix et de la qté total et implantation
                    prixTotal += product.price*panier.quantité;
                    quantityTotal += parseInt(panier.quantité);
                    document.getElementById("totalPrice").innerText = prixTotal;
                    document.getElementById("totalQuantity").innerText = quantityTotal;
            }
            }            
        }   
    })
    .catch (function(err){
        alert("Le panier n'as pas été récupéré");
    })
}
get();
// fonction pour supprimer un élement du panier
document.addEventListener('click', function(event){
    let recupClé = event.target.parentNode;
    let clé = recupClé.parentNode.id
    if(JSON.parse(localStorage.getItem(clé)) && event.target.className == "deleteItem"){
        
        localStorage.removeItem(clé);
        get(); //l'appel de cette fonction permet 'l'actualisation' du panier grace a la remise a zero du debut de cette fonction
    }
})
//modification de la qté
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
            alert ("Erreur : panier vide ou mauvaise ID des produits");
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
                var newUlr = document.location.href.replace('cart.html','confirmation.html?orderId='+ value.orderId);
                document.location.href = newUlr;
            })
            .catch (function(err){
                alert("La commande n'as pas pu etre transmise");
            })
        }
        
    }
},false)
