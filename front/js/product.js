//déclaration des variables globales
let href = window.location.href;
let url = new URL(href);
let searchId = new URLSearchParams(url.search);
let id = 0;
let productById = [];
let productToCart = {
  id : "",
  quantity : 0,
  color : ""
}

//récupération de l'id produit dans l'URL de la page
if(searchId.has("id")) {
    id = searchId.get("id");
  }

// fonction qui récupère le produit sélectionné en fonction de son id grace à un fetch
async function getProductById () {
  await fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((data) => (productById = data))
    .catch(err => console.log("erreur lors du chargement du produit", err));
}

//fonction d'affichage des informations du produit
async function displayingProductById () {
  await getProductById();

  const itemImg = document.querySelector("div.item__img");
  let productImg = document.createElement("img");
  productImg.setAttribute("src", `${productById.imageUrl}`);
  productImg.setAttribute("alt", "Photographie d'un canapé");
  itemImg.appendChild(productImg);

  const productTitle = document.getElementById("title");
  productTitle.innerText = productById.name;
  
  const productPrice = document.getElementById("price");
  productPrice.innerText = productById.price;

  const productDescription = document.getElementById("description");
  productDescription.innerText = productById.description;

  //boucle qui itère sur l'array colors du produit et qui les affiche une par une
  const productColors = document.getElementById("colors");
  for (let i = 0; i < productById.colors.length; i++){
    let newColor = document.createElement("option");
    newColor.setAttribute("value", `${productById.colors[i]}`);
    newColor.innerText = productById.colors[i];
    productColors.appendChild(newColor);
  }
}

//fonction qui écoute les événements sur les inputs couleur et quantité et sur le bouton d'ajout au panier
function addToCart(){
  const addToCartButton = document.getElementById("addToCart");
  const quantityInput = document.getElementById("quantity");
  const productColors = document.getElementById("colors");

  quantityInput.addEventListener("input", function(event){
    productToCart.quantity = parseInt(event.target.value);
  });

  productToCart.id = productById._id;

  productColors.addEventListener("input", function(e){
    productToCart.color = e.target.value;
  });

  //une fois le bouton cliqué on vérifie la couleur et la quantité
  addToCartButton.addEventListener("click", function(e){
    //si aucune couleur n'est choisie on l'indique à l'utilisateur
    if(productToCart.color == "") {
      alert("veuillez choisir une couleur");
      //si la quantité n'est pas comprise entre 1 et 100 on l'indique à l'utilisateur
    } else if ((productToCart.quantity < 1) || (productToCart.quantity =="") || (productToCart.quantity > 100)){
      alert("veuillez choisir une quantité comprise entre 1 et 100");
      //si les valeurs sont correctes on appelle la fonction de localstorage
    } else {
      setToLocalStorage();
    }
  }); 
}

//fonction qui insère l'élémént choisi dans un array dans le local storage
function setToLocalStorage() {
let storageString = localStorage.getItem("cart");
let storage = JSON.parse(storageString);

//si le stockage n'est pas vide
  if(storage) {
    //on recherche un élément qui a le même id et la même couleur
    let getproduct = storage.find((item) => item.id == productToCart.id && item.color == productToCart.color);
    //si on en trouve un on ajoute la nouvelle quantité désirée
    if(getproduct){
      getproduct.quantity += productToCart.quantity;
      localStorage.setItem("cart", JSON.stringify(storage));
      alert ("la quantité a été mise à jour");
      //sinon on ajoute un nouvel élément à l'array du localstorage
    } else {
      storage.push(productToCart);
      localStorage.setItem("cart", JSON.stringify(storage));
      alert ("le panier a été mis à jour");
    }
    //si le local storage est vide on crée le premier élément
  } else {
    const cart = [];
    cart.push(productToCart);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert ("le panier a été mis à jour");
  }
}


//fonction main qui appelle les fonction d'affichage et d'ajout des produits
async function main () {
  await displayingProductById();
  addToCart();
}

main();