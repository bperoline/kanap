async function init() {
    recuperePanier()

    window.onload = (event) => {
        quantitePrixTotal()

        let changementQuantite = document.querySelectorAll(".itemQuantity")
        changementQuantite.forEach((item) => {
            item.addEventListener('change', (event) => {
                majDomLocalStorage(event)

                majDomQttPrix()
                quantitePrixTotal()
            }
            )
        }
        )

    }


}

init();

function recuperePanier() {

    // pour i allant de 0 au la taille du local storage, (a chaque fois on incrementera de 1)
    for (let i = 0; i < localStorage.length; i++) {
        let cle = localStorage.key(i); // recuperation de la clé dans la ligne correspondante de tableau dans le localstorage

        let panier = localStorage.getItem(cle) // recupere le panier en se basant sur la clé
        afficherPanier(panier)
    }

}

function recupererProduit(id) {
    return fetch(`http://localhost:3000/api/products/${id}`)
        .then((reponse) => {
            return reponse.json();
        })
        .catch((erreur) => {
            console.log(erreur)
        })
}

async function afficherPanier(unpanier) {
    unpanier = JSON.parse(unpanier)
    let produit = await recupererProduit(unpanier[0]);
    let sectionItems = document.querySelector("#cart__items")

    sectionItems.insertAdjacentHTML("beforeend", `
        <article class="cart__item" data-id="${unpanier[0]}" data-color="${unpanier[2]}">
            <div class="cart__item__img">
                <img src="${produit.imageUrl}" alt="${produit.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${produit.name}</h2>
                        <p>${unpanier[2]}</p>
                        <p class="prixProduit">${produit.price} €</p>
                    </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${unpanier[1]}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>
    `)
}

function quantitePrixTotal() {

    let totalProduit = document.querySelectorAll(".itemQuantity")
    let qttTotalProduit = 0
    for (let quantite of totalProduit) {
        qttTotalProduit = Number(qttTotalProduit) + Number(quantite.value)
    }


    let produitDuPanier = document.querySelectorAll(".cart__item")
    let qttTotalPrix = 0
    for (let produit of produitDuPanier) {
        let qttProduit = produit.querySelector(".itemQuantity").value

        let regex = /[0-9]+/g
        let prix = produit.querySelector(".prixProduit").textContent.match(regex)

        qttTotalPrix = qttTotalPrix + (qttProduit * Number(prix))

    }

    let cartPrice = document.querySelector(".cart__price")
    cartPrice.insertAdjacentHTML("beforeend", `
        <p>Total (<span id="totalQuantity">${qttTotalProduit}</span> articles) : <span id="totalPrice">${qttTotalPrix}</span>€</p>
    `)

}

function majDomLocalStorage(evenement) {

    let quantite = evenement.target
    let parent = quantite.closest("[data-id]")
    let id = parent.getAttribute("data-id")
    let color = parent.getAttribute("data-color")

    let donneTableau = [id, quantite.value, color]

    localStorage.setItem(`${id}-${color}`, JSON.stringify(donneTableau))

}

function majDomQttPrix() {

    let qttPrix = document.querySelector(".cart__price p")
    qttPrix.remove()

}




