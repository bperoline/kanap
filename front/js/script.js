async function init() {

    let produits = await recupererProduits();
    console.log(produits);
    afficherProduit(produits);
}

init();

function recupererProduits() {
    return fetch("http://localhost:3000/api/products")
        .then((reponse) => {
            return reponse.json();
        })
        .catch((erreur) => {
            console.log(erreur)
        })
}

function afficherProduit(tousProduits) {
    let sectionItems = document.querySelector("#items")
    for (let produit of tousProduits) {
        sectionItems.insertAdjacentHTML("beforeend", `
    <a href="./product.html?id=${produit._id}">
        <article>
            <img src="${produit.imageUrl}" alt="${produit.altTxt}">
            <h3 class="productName">${produit.name}</h3>
            <p class="productDescription">${produit.description}</p>
        </article>
    </a>
    `)
    }
}