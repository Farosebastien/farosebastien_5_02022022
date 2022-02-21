// déclaration des variables globales
let cart = [];
let productById = 0;
let cartItems = document.getElementById("cart__items");
let totalQuantity = 0;
let totalPrice = 0;
let i = 0;

// fonction de récupération du localstorage et de chaque produit du panier en fonction de son id
async function getProductById() {
    cart = JSON.parse(localStorage.getItem("cart"));
    for (i = 0; i < cart.length; i++) {
        await fetch(`http://localhost:3000/api/products/${cart[i].id}`)
        .then((res) => res.json())
        .then((data) => (productById = data))
        .catch(err => console.log("erreur lors du chargement du produit", err));
        displayingProducts();
        totalQuantity += cart[i].quantity;
        totalPrice += (productById.price * cart[i].quantity);
    }
}

//fonction d'affichage des produits dans le dom
function displayingProducts() {
    let productArticle = document.createElement("article");
    productArticle.setAttribute("class", "cart__item");
    productArticle.setAttribute("data-id", `${productById._id}`);
    productArticle.setAttribute("data-color", `${cart[i].color}`);
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
    productColors.innerText = cart[i].color;
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

    //affichage de la quantité désirée
    let productQuantity = document.createElement("p");
    productQuantity.innerText = `Qté : ${cart[i].quantity}`;
    divContentSettingsQuantity.appendChild(productQuantity);

    //input pour la modification de la quantité
    let productQuantityInput = document.createElement("input");
    productQuantityInput.setAttribute("type", "number");
    productQuantityInput.setAttribute("class", "itemQuantity");
    productQuantityInput.setAttribute("name", "itemQuantity");
    productQuantityInput.setAttribute("min", "1");
    productQuantityInput.setAttribute("max", "100");
    productQuantityInput.setAttribute("value", `${cart[i].quantity}`);
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



async function main() {
    await getProductById();
    let totalQuantitySpan = document.getElementById("totalQuantity");
    totalQuantitySpan.innerText = totalQuantity;
    let totalPriceSpan = document.getElementById("totalPrice");
    totalPriceSpan.innerText = totalPrice;
}

main();