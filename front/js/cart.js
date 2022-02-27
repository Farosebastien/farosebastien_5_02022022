// déclaration des variables globales
let localCart = [];
let productById = 0;
let cartItems = document.getElementById("cart__items");

// fonction de récupération du localstorage et de chaque produit du panier en fonction de son id
async function getProductById() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) {
        for (localCart of cart) {
            await fetch(`http://localhost:3000/api/products/${localCart.id}`)
            .then((res) => res.json())
            .then((data) => (productById = data))
            .catch(err => console.log("erreur lors du chargement du produit", err));
            displayingProducts();
            calc();
        }
    } else {
        alert("votre panier est vide");
    }     
}

async function calc() {
    let totalQuantitySpan = document.getElementById("totalQuantity");
    let totalPriceSpan = document.getElementById("totalPrice");
    let totalQuantity = 0;
    let totalPrice = 0;
    let modifyCart = JSON.parse(localStorage.getItem("cart"));
    for ( let j = 0; j < modifyCart.length; j++) {
        await fetch(`http://localhost:3000/api/products/${modifyCart[j].id}`)
        .then((res) => res.json())
        .then((data) => (article = data))
        .catch(err => console.log("erreur lors du chargement du produit", err));
        totalQuantity += modifyCart[j].quantity;
        totalPrice += (article.price * modifyCart[j].quantity);
        totalQuantitySpan.innerText = totalQuantity;
        totalPriceSpan.innerText = totalPrice;
    }
    if (totalQuantity == 0) {
        alert("votre panier va être vide");
        totalQuantitySpan.innerText = totalQuantity;
        totalPriceSpan.innerText = totalPrice;
        localStorage.clear();
    }
}

//fonction d'affichage des produits dans le dom
function displayingProducts() {
    let productArticle = document.createElement("article");
    productArticle.setAttribute("class", "cart__item");
    productArticle.setAttribute("data-id", `${localCart.id}`);
    productArticle.setAttribute("data-color", `${localCart.color}`);
    cartItems.appendChild(productArticle);

    let divImg = document.createElement("div");
    divImg.setAttribute("class", "cart__item__img");
    productArticle.appendChild(divImg);

    //affichage de l'image
    let productImg = document.createElement("img");
    productImg.setAttribute("src", productById.imageUrl);
    productImg.setAttribute("alt", "Photographie d'un canapé");
    divImg.appendChild(productImg);

    let divContent = document.createElement("div");
    divContent.setAttribute("class", "cart__item__content");
    productArticle.appendChild(divContent);

    let divContentDescription = document.createElement("div");
    divContentDescription.setAttribute("class", "cart__item__content__description");
    divContent.appendChild(divContentDescription);

    //affichage du nom
    let productTitle = document.createElement("h2");
    productTitle.innerText = productById.name;
    divContentDescription.appendChild(productTitle);

    //affichage de la couleur choisie
    let productColors = document.createElement("p");
    productColors.innerText = localCart.color;
    divContentDescription.appendChild(productColors);

    //affichage du prix unitaire
    let productPrice = document.createElement("p");
    productPrice.innerText = productById.price + "\u20ac";
    divContentDescription.appendChild(productPrice);

    let divContentSettings = document.createElement("div");
    divContentSettings.setAttribute("class", "cart__item__content__settings");
    divContent.appendChild(divContentSettings);

    let divContentSettingsQuantity = document.createElement("div");
    divContentSettingsQuantity.setAttribute("class", "cart__item__content__settings__quantity");
    divContentSettings.appendChild(divContentSettingsQuantity);

    let productQuantity = document.createElement("p");
    productQuantity.innerText = "Qté :";
    divContentSettingsQuantity.appendChild(productQuantity);

    //affichage de la  quantité désirée dans un input pour la modification
    let productQuantityInput = document.createElement("input");
    productQuantityInput.setAttribute("type", "number");
    productQuantityInput.setAttribute("class", "itemQuantity");
    productQuantityInput.setAttribute("name", "itemQuantity");
    productQuantityInput.setAttribute("min", "1");
    productQuantityInput.setAttribute("max", "100");
    productQuantityInput.setAttribute("value", `${localCart.quantity}`);
    divContentSettingsQuantity.appendChild(productQuantityInput);

    let divContentSettingsDelete = document.createElement("div");
    divContentSettingsDelete.setAttribute("class", "cart__item__content__settings__delete");
    divContentSettings.appendChild(divContentSettingsDelete);

    //bouton supprimer
    let deleteProduct = document.createElement("p");
    deleteProduct.setAttribute("class", "deleteItem");
    deleteProduct.innerText = "Supprimer";
    divContentSettingsDelete.appendChild(deleteProduct);
}

function changeQuantity() {
    let quantityItems = document.querySelectorAll(".itemQuantity");
    let cartForQuantity = JSON.parse(localStorage.getItem("cart")); 
    for ( let k = 0; k < quantityItems.length; k++) {
        quantityItems[k].addEventListener("change", function(e){
            cartForQuantity[k].quantity = parseInt(e.target.value);
            localStorage.setItem("cart", JSON.stringify(cartForQuantity));
            calc();
        });
    }
}

function deleteItem() {
    let  articleToDelete = document.querySelectorAll(".cart__item");
    let deleteButtons = document.querySelectorAll(".deleteItem");
    let cartForDelete = JSON.parse(localStorage.getItem("cart"));
    for (let i = 0; i < articleToDelete.length; i++) {
        let dataId = cartForDelete[i].id;
        let colorId = cartForDelete[i].color;
        deleteButtons[i].addEventListener("click", function(event){
            let filteredcart = cartForDelete.filter(function(itemToRemove) {
                return itemToRemove.id != dataId  || itemToRemove.color != colorId;
            });
            cartForDelete = filteredcart;
            localStorage.setItem("cart", JSON.stringify(cartForDelete));
            cartItems.removeChild(articleToDelete[i]);
            calc();
        });
    } 
}

async function main() {
    await getProductById(); 
    changeQuantity();
    deleteItem();
}

main();