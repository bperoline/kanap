/**
 * Fonction principale
 */
async function init() {

    let produitId = recupererId();
    let produit = await recupererProduit(produitId);
    afficherProduit(produit)
}

// Appel de la fonction principale
init();

/**
 * Fonction permettant de recuperer l'ID du produit stocké dans l'URL
 * @returns l'ID du produit
 */
function recupererId() {

    let paramURL = window.location.search
    let rechercheParam = new URLSearchParams(paramURL)
    let monId = rechercheParam.get("id")
    return monId
}

/**
 * Fonction permettant de recuperer un produit en fonction du l'ID transmis
 * @param {*} id 
 * @returns les informations du produit contenu dans l'API en fonction de son ID
 */
function recupererProduit(id) {

    return fetch(`http://localhost:3000/api/products/${id}`)
        .then((reponse) => {
            return reponse.json();
        })
        .catch((erreur) => {
            console.log(erreur)
        })
}

/**
 * Fonction permettant d'afficher les informations du produit dans le DOM
 * @param {*} unProduit 
 */
function afficherProduit(unProduit) {

    let imageItem = document.querySelector(".item__img")
    imageItem.insertAdjacentHTML("beforeend", `
        <img src="${unProduit.imageUrl}" alt="${unProduit.altTxt}">
    `)

    let titreItem = document.querySelector("#title")
    titreItem.insertAdjacentHTML("beforeend",
        unProduit.name
    )

    let prixItem = document.querySelector("#price")
    prixItem.insertAdjacentHTML("beforeend",
        unProduit.price
    )

    let descriptionItem = document.querySelector("#description")
    descriptionItem.insertAdjacentHTML("beforeend",
        unProduit.description
    )

    let couleurItems = document.querySelector("#colors")
    for (let couleur of unProduit.colors) {
        couleurItems.insertAdjacentHTML("beforeend", `
        <option value="${couleur}">${couleur}</option>
        `)
    }
}

/**
 * Fonction permettant d'ajouter au panier (et le localStorage) un produit en fonction de son ID et de sa couleur
 */
function ajoutPanier() {

    let id = recupererId()
    let quantite = document.querySelector("#quantity").value
    let couleur = document.querySelector("#colors").value

    let panier = [id, quantite, couleur]

    let panierSauvegarder = localStorage.getItem(`${id}-${couleur}`)
    let donnePanier = JSON.parse(panierSauvegarder)

    if (donnePanier === null) {
        localStorage.setItem(`${id}-${couleur}`, JSON.stringify(panier))
    } else {
        donnePanier[1] = Number(donnePanier[1]) + Number(quantite)
        localStorage.setItem(`${id}-${couleur}`, JSON.stringify(donnePanier))
    }
}