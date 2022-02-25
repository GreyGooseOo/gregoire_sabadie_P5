//récupération des informations du produit dans l'API en fonction de l'ID
function getProduct(id){
    fetch("http://localhost:3000/api/products" + "/" + id)
    .then (function(res){
        if(res.ok){
            return  res.json();        
        }
    })
    .then(function(product){
        document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
        document.getElementById("title").innerText = product.name;
        document.getElementById("price").innerText = product.price;
        document.getElementById("description").innerText = product.description;
        for ( let color of product.colors){
            document.getElementById("colors").innerHTML += `<option value="${color}">${color}</option>`;

        }
    })
    .catch (function(err){

    })
}
var panier = [];
var url = document.location.href;
var idProduct = url.substring(url.lastIndexOf("id=")+3);
getProduct(idProduct);
//gestion de l'ajout au panier
document.getElementById("addToCart").addEventListener('click',function(){
    // vérification que les champs couleur et qté sois bien reseigné
    if (document.getElementById("colors").value !== "" && document.getElementById("quantity").value != 0){
        let newChoice = {
            id : idProduct,
            color : document.getElementById("colors").value,
            quantité : parseInt(document.getElementById("quantity").value)
        };
        if (localStorage.getItem('panier')){       
            panier = JSON.parse(localStorage.getItem('panier'));
            var doublon = false;
            for (let product of panier){
                if(product.id == newChoice.id && product.color == newChoice.color){
                    product.quantité += newChoice.quantité;
                    doublon = true;
                }
            }
            if(doublon == false){
                panier.push(newChoice);
            }
            localStorage.setItem('panier', JSON.stringify(panier.sort()));   
        }else{
            panier = [newChoice],
            localStorage.setItem('panier', JSON.stringify(panier));
        }
        alert("Le produit a bien été ajouté au panier")       
    }else{
        //message d'erreur si les champs ne sont pas reseingé
        if (document.getElementById("colors").value === ""){
            alert("choisissez une couleur de canapé");
        }else{
            if (document.getElementById("quantity").value == 0){
                alert("Selectionnez un nombre d'article(s)");
            }
        }       
    }
    
})
