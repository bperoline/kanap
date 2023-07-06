async function init() {
    recuperePanier()


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
                        <p>${produit.price} €</p>
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
