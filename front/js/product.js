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

var idProduct = url.substring(url.lastIndexOf("id=")+3);
getProduct(idProduct);

document.getElementById("addToCart").addEventListener('click',function(){
    if (document.getElementById("colors").value !== "" && document.getElementById("quantity").value != 0){
        var newChoice = new choixProduit (
            idProduct,
            document.getElementById("colors").value,
            parseInt(document.getElementById("quantity").value));

           localStorage.setItem('panier' , JSON.stringify(newChoice))`
            <article class="cart__item" data-id="${newChoice.id}" data-color="${newChoice.color}">
            <div class="cart__item__img">
              <img src="${newChoice.imgSrc}" alt="${newChoice.imgAlt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${newChoice.name}</h2>
                <p>${newChoice.color}</p>
                <p>${newChoice.price}</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${newChoice.quantité}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`;
          console.log(decodeURIComponent(document.cookie).split(';'));

            
    }else{
        if (document.getElementById("colors").value === ""){
            alert("choisissez une couleur de canapé");
        }else{
            if (document.getElementById("quantity").value == 0){
                alert("Selectionnez un nombre d'article(s)");
            }
        }       
    }
    
})
