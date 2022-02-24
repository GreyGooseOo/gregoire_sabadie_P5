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
        //ajout de qté supplémentaire si le produit a deja été selectionné
        if(localStorage.getItem(idProduct +"-"+ newChoice.color)){
            
            newChoice.quantité += JSON.parse(localStorage.getItem(idProduct +"-"+ newChoice.color)).quantité;
        }
        /* implantation d'un objet contenant l'id,la couleur et la qté d'un produit dans le local storage
        avec la clé correspondant à l'id et la couleur pour les différencier */     
        localStorage.setItem(idProduct +"-"+ newChoice.color , JSON.stringify(newChoice));
        console.log(JSON.parse(localStorage.getItem(idProduct+ newChoice.color)))
            
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
