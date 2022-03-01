//fonction qui recupère les information des produits dans l'API
function get(){
    fetch("http://localhost:3000/api/products")
    .then (function(res){
        if(res.ok){
            return  res.json();        
        }
    })
    .then (function(products){
        for (let product of products){
            document.getElementById("items").innerHTML += `<a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>`;
        }
    })
    .catch(function(err){

    })
}
get();
