/**
 * Fonction principale
 */
async function init() {

    let produits = await recupererProduits();
    afficherProduit(produits);
}

// Appel de la fonction principale
init();

/**
 * Fonction permettant de récupèrer les produits de l'API
 * @returns les produits de l'API
 */
function recupererProduits() {

    return fetch("http://localhost:3000/api/products")
        .then((reponse) => {
            return reponse.json();
        })
        .catch((erreur) => {
            console.log(erreur)
        })
}

/**
 * Fonction permettant d'afficher des produits dans le DOM
 * @param {*} tousProduits 
 */
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