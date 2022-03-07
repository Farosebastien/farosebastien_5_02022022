// déclaration des variables globales
let localCart = [];
let productById = 0;
let cartItems = document.getElementById("cart__items");
let cart = JSON.parse(localStorage.getItem("cart"));
let cartForQuantity = JSON.parse(localStorage.getItem("cart"));
let cartForDelete = JSON.parse(localStorage.getItem("cart"));
contact = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: "",
};
let formIsValid = false;

// fonction de récupération du localstorage et de chaque produit du panier en fonction de son id
async function getProductById() {

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

//fonction de calcul des prix et des quantités totales
async function calc() {
    let totalQuantitySpan = document.getElementById("totalQuantity");
    let totalPriceSpan = document.getElementById("totalPrice");
    let totalQuantity = 0;
    let totalPrice = 0;
    let modifyCart = cart;
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
    //deleteProduct.addEventListener("click", removeItem(localCart.id, localCart.color));
    divContentSettingsDelete.appendChild(deleteProduct);
}

//fonction de changement des quantités si l'utilisateur les change dans le panier
function changeQuantity() {
    let articleToChangeQuantity = document.querySelectorAll(".cart__item");
    let quantityItems = document.querySelectorAll(".itemQuantity");
    cartForQuantity = JSON.parse(localStorage.getItem("cart"));
    if (cartForQuantity){
        for (let i = 0; i < articleToChangeQuantity.length; i++) {
            const quantityItem = quantityItems[i];
            let newQuantity = cartForQuantity[i];
            quantityItem.addEventListener("change", function(e){
                if (e.target.value > 0 && e.target.value < 101){
                    newQuantity.quantity = parseInt(e.target.value);
                cartForDelete = cartForQuantity;
                cart = cartForQuantity;
                localStorage.setItem("cart", JSON.stringify(cartForQuantity));
                calc();
                } else {
                    alert("La quantité doit être comprise entre 1 et 100");
                }   
            });
        }
    }
}

//fonction de suppression d'article si l'utilisateur le supprime dans le panier
function deleteItem() {
    let  articleToDelete = document.querySelectorAll(".cart__item");
    let deleteButtons = document.querySelectorAll(".deleteItem");
    let a = 0;
    for (let i = 0; i < articleToDelete.length; i++) {
        const deleteButton = deleteButtons[i];
        let dataId = cartForDelete[i].id;
        let colorId = cartForDelete[i].color;
        deleteButton.addEventListener("click", function(){
            let filteredcart = cartForDelete.filter(function(itemToRemove) {
                return itemToRemove.id != dataId  || itemToRemove.color != colorId;
            });
            cartForDelete = filteredcart;
            cart = cartForDelete;
            cartForQuantity = cartForDelete;
            localStorage.setItem("cart", JSON.stringify(cartForDelete));
            a = document.querySelector(`[data-id = "${dataId}"]` && `[data-color = "${colorId}"]`);
            a.remove();
            calc();
        });
    }
}

//fonction de test des inputs du formulaire à l'aide de regex
function testFormInput() {
    let firstNameTest = document.getElementById("firstName");
    let lastNameTest = document.getElementById("lastName");
    let addressTest = document.getElementById("address");
    let cityTest = document.getElementById("city");
    let emailTest = document.getElementById("email");
    let firstNameError = document.getElementById("firstNameErrorMsg");
    let lastNameError = document.getElementById("lastNameErrorMsg");
    let addressError = document.getElementById("addressErrorMsg");
    let cityError = document.getElementById("cityErrorMsg");
    let emailError = document.getElementById("emailErrorMsg");
    let firstNameRegex = /[A-Za-z\-\è\é\ê\à\î\â].{2,}/g;
    let lastNameRegex = /[A-Za-z\-].{2,}/g;
    let addressRegex = /^[0-9]{1,}\s[A-Za-z]/g;
    let cityRegex = /[A-Za-z\-].{2,}/g;
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g;

    //test sur le firstname
    firstNameTest.addEventListener("change", function (e) {
        //si il ne convient pas on l'indique a l'utilisateur et on garde le booléen à false
        if (!firstNameRegex.test(e.target.value)) {
            firstNameError.innerText = "Votre prénom doit contenir uniquement des lettres et un tiret le cas échéant";
            formIsValid = false;
        //si il convient on le met en mémoire, on met le message d'erreur à zero et on met le booléen à true
        } else {
            firstNameError.innerText = "";
            contact.firstName = e.target.value;
            formIsValid = true;
        }
    });
    //test sur le lastname
    lastNameTest.addEventListener("change", function (e) {
        if (!lastNameRegex.test(e.target.value)) {
            lastNameError.innerText = "Votre nom doit contenir uniquement des lettres";
            formIsValid = false;
        } else {
            lastNameError.innerText = "";
            contact.lastName = e.target.value;
            formIsValid = true;
        }
    });
    //test sur l'adresse
    addressTest.addEventListener("change", function (e) {
        if (!addressRegex.test(e.target.value)) {
            addressError.innerText = "Votre adresse n'est pas valide";
            formIsValid = false;
        } else {
            addressError.innerText = "";
            contact.address = e.target.value;
            formIsValid = true;
        }
    });
    //test sur la ville
    cityTest.addEventListener("change", function (e) {
        if (!cityRegex.test(e.target.value)) {
            cityError.innerText = "La ville ne doit contenir que des lettres";
            formIsValid = false;
        } else {
            cityError.innerText = "";
            contact.city = e.target.value;
            formIsValid = true;
        }
    });
    //test sur l'email
    emailTest.addEventListener("change", function (e) {
        if (!emailRegex.test(e.target.value)) {
            emailError.innerText = "Votre adresse email n'est pas valide";
            formIsValid = false;
        } else {
            emailError.innerText = "";
            contact.email = e.target.value;
            formIsValid = true;
        }
    });
}

//fonction d,envoie des données a l'api si tout est ok
function getOrderId() {
    orderButton = document.getElementById("order");
    //au click sur le bouton de commande
    orderButton.addEventListener("click", function(e){
        let orderId = null;
        let cartForFetch = JSON.parse(localStorage.getItem("cart"));
        let products = [];
        //si on a au moins un article on stocke son id dans un tableau
        if (cartForFetch){
            for (let product of cartForFetch) {
                products.push(product.id);
            }       
        }
        //si on a au moins un article et que le formulaire est ok
        if (cartForFetch && formIsValid) {
            //on envoie un fetch post à l'api
            e.preventDefault();
            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ contact, products }),
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    //on stocke l'id de commande
                    orderId = data.orderId;
                    //si l'id de commande est bien là
                    if (orderId) {
                        //on envoie l'utilisateur sur la page confirmation, on vide le localstorage et on remet l'id de commande à null
                        window.location.href = `./confirmation.html?id=${orderId}`;
                        localStorage.clear();
                        orderId = null;
                    }
                });
        //sinon on indique aà l'utilisateur qu'il a raté une étape 
        } else {
            alert("veuillez choisir un article et remplir le formulaire avant de passer commande");
        }
    });
}

//fonction main
async function main() {
    await getProductById();
    deleteItem();
    changeQuantity();
    testFormInput();
    getOrderId();

}

main();