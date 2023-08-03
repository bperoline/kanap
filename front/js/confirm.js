function init() {

    numCommande()

}

init();

function recupeCommandeID() {

    let paramURL = window.location.search

    let rechercheParam = new URLSearchParams(paramURL)

    let commandeId = rechercheParam.get("commandeID")
    return commandeId

}

function numCommande() {

    let numeroCommande = document.querySelector("#orderId")
    numeroCommande.insertAdjacentHTML("beforeend",
        recupeCommandeID()
    )

}