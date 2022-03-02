//déclaration des variables globales
let href = window.location.href;
let url = new URL(href);
let searchId = new URLSearchParams(url.search);
let id = 0;

//recherche de l'id de commande dans l'url
if(searchId.has("id")) {
    id = searchId.get("id");
  }

//affichage de l'id de commande
let orderId = document.getElementById("orderId");
orderId.innerText = id;