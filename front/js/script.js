// variable globale qui va contenir la liste des produits dans un array
let products = [];


// fonction qui récupére les données des produits dans l'api mise a disposition
async function getProducts () {
   await fetch("http://localhost:3000/api/products/")
    .then((res) => res.json())
    .then((data) => (products = data))
    .catch(err => console.log("erreur lors du chargement des produits", err));
}

/* fonction qui appelle la fonction de récupération de données et qui
 utilise une boucle for pour créer chaque élement html en itérant l'array de produits
 et qui affecte les données correspondantes à chaque élément*/
async function displayingProducts () {
    await getProducts();
    const itemsId = document.getElementById("items");

    for (let i = 0; i < products.length; i++){
        let link = document.createElement('a');
        link.setAttribute("href", `./product.html?id=${products[i]._id}`);
        link.setAttribute("title", `${products[i].name}`);
        itemsId.appendChild(link);

        let article = document.createElement("article");
        link.appendChild(article);

        let imgProduct = document.createElement("img");
        imgProduct.setAttribute("src", `../../back/images/kanap0${i+1}.jpeg`);
        imgProduct.setAttribute("alt", `${products[i].altTxt}`);
        article.appendChild(imgProduct);

        let titleProduct = document.createElement("h3");
        titleProduct.classList.add("productname");
        titleProduct.innerText = products[i].name;
        article.appendChild(titleProduct);

        let descriptionProduct = document.createElement("p");
        descriptionProduct.classList.add("productDescription");
        descriptionProduct.innerText = products[i].description;
        article.appendChild(descriptionProduct);
    }
}

// fonction main qui appelle la fonction de création d'éléments HTML
async function main(){
    await displayingProducts();
}

// appel de la fonction main
main();