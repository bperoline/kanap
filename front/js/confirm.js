/**
 * Fonction principale
 */
function init() {

    numCommande()
}

// Appel de la fonction principale
init();

/**
 * Fonction permettant de recuperer le numero de commande stocké dans l'URL
 * @returns le numero de commande
 */
function recupeCommandeID() {

    let paramURL = window.location.search
    let rechercheParam = new URLSearchParams(paramURL)
    let commandeId = rechercheParam.get("commandeID")

    return commandeId
}

/**
 * Fonction permettant d'afficher le numero de commande dans le DOM
 */
function numCommande() {

    let numeroCommande = document.querySelector("#orderId")
    numeroCommande.insertAdjacentHTML("beforeend",
        recupeCommandeID()
    )
}