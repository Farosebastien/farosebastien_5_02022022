let href = window.location.href;
let url = new URL(href);
let searchId = new URLSearchParams(url.search);
let id = 0;
let productById = [];

if(searchId.has('id')) {
    id = searchId.get('id');
  }

async function getProductById () {
  await fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((data) => (productById = data))
    .catch(err => console.log("erreur lors du chargement du produit", err));
}

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

  const productColors = document.getElementById("colors");
  for (let i = 0; i < productById.colors.length; i++){
  
    let newColor = document.createElement("option");
    newColor.setAttribute("value", `${productById.colors[i]}`);
    newColor.innerText = productById.colors[i];
    productColors.appendChild(newColor);
  }
}

async function colorControl () {
  const addToCartButton = document.getElementById("addToCart");
  const productColors = document.getElementById("colors");
  addToCartButton.addEventListener("click", function(event){
    if(productColors.getAttribute("value") == ""){
      alert("veuillez selectionner une couleur avant d'ajouter le produit au panier");
      event.preventDefault();
    }
  });
}

async function quantityControl () {
  const quantity = document.getElementById("quantity");
  if (quantity.getAttribute("value") > 100){
    quantity.setAttribute("value", "100");
  }
}

async function main () {
  await displayingProductById();
  await colorControl();
  await quantityControl();
}

main();