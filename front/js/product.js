async function init() {

    let produitId = recupererId(); // reception de l'id du produit

    let produit = await recupererProduit(produitId); //recuperation des caracteristiques du produit grace a son id precedement recuperé

    afficherProduit(produit)

}

init();

// récuperation de l'id d'un produit a partir d'un produit
function recupererId() {

    let paramURL = window.location.search // récupération des paramètres de l'URL

    let rechercheParam = new URLSearchParams(paramURL) // création de l'objet URLSP, en lui donnant comme paramètre, les paramètres de notre URL précedemment récuperé

    let monId = rechercheParam.get("id") // recuperé l'id de l'objet URLSP
    return monId // retour de l'id contenu de l'URL

}

// recuperation du produit a partir de son id
function recupererProduit(id) {
    return fetch(`http://localhost:3000/api/products/${id}`) //contact l'API
        .then((reponse) => {
            return reponse.json(); // si bonne réponse, la reponse doit etre sous json
        })
        .catch((erreur) => {
            console.log(erreur) // si erreur, afffichage dans la console de l'erreur avec ses explications
        })
}

// afficher les caracteristiques du produits sur la page product.html
function afficherProduit(unProduit) {
    let imageItem = document.querySelector(".item__img") //cherche item__img dans le html

    imageItem.insertAdjacentHTML("beforeend", `
        <img src="${unProduit.imageUrl}" alt="${unProduit.altTxt}">
    `) // ajoute dans le html l'image + le texte alternatif correspondante au produit 


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


    let couleurItems = document.querySelector("#colors") // cherche l'id colors dans le html
    for (let couleur of unProduit.colors) {
        couleurItems.insertAdjacentHTML("beforeend", `
        <option value="${couleur}">${couleur}</option>
        `)
    }// pour chaque couleur presente pour mon produit, ajoute une/des option avec comme valeur la couleur

}

// ajouter des produits au panier
function ajoutPanier() {
    let id = recupererId() // recuperer l'id
    let quantite = document.querySelector("#quantity").value // cherche la quantité dans le doc
    let couleur = document.querySelector("#colors").value // cherche la couleur dans le doc

    let panier = [id, quantite, couleur] // panier est un tableau contenant id + quantité + couleur

    let panierSauvegarder = localStorage.getItem(`${id}-${couleur}`) // recupere dans le local de stockage l'element qui porte comme nom la concatenation de l'id et de la couleur, c'est le panier qui doit etre sauvegarder dans le local
    let donnePanier = JSON.parse(panierSauvegarder) // met paniersauvegarder sous forme de tableau, et appelle le donnépanier

    //si  donnépanier n'as pas de valeur alors enregistre sous forme de chaine de caractere le panier, il sappellera dans le local par la concatenation id+ couleur
    if (donnePanier === null) {
        localStorage.setItem(`${id}-${couleur}`, JSON.stringify(panier))  // sauvegarder dans le localStorage notre produit avec son id sa couleur et sa quantité
    } else {
        donnePanier[1] = Number(donnePanier[1]) + Number(quantite) // modifier la quantité de donnépanier[1] en ajoutant la valeur de quantité à la valeur déjà enregistrée
        localStorage.setItem(`${id}-${couleur}`, JSON.stringify(donnePanier))
    } // sinon modifie la quantite de donnépanier(1) en ajoutant la valeur a la valeur deja enregistré. et enregistre les données de donnepanier sous chaine de caractere dans le local avec la concatenation id+couleur

}


