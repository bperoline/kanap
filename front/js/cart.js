// Demande que le DOM soit completement chargé pour lancer la fonction
document.addEventListener("DOMContentLoaded", function (event) {

    /**
     * Fonction principale
     */
    async function init() {

        recuperePanier()

        window.onload = (event) => {

            // lance les instructions à 1000ms après que le DOM soit chargé
            setTimeout(() => {
                quantiteProduitPrixTotal()

                let changementQuantite = document.querySelectorAll(".itemQuantity")

                changementQuantite.forEach((item) => {
                    item.addEventListener('change', (event) => {
                        majDomLocalStorage(event)

                        majDomQttPrix()
                        quantiteProduitPrixTotal()
                    })
                })

                let suppression = document.querySelectorAll(".deleteItem")
                suppression.forEach((item) => {
                    item.addEventListener('click', (event) => {
                        suppLigneCommande(event)

                        majDomQttPrix()
                        quantiteProduitPrixTotal()
                    })
                })

            }, "1000");

        }

        let donneCommander = document.querySelector("#order")
        donneCommander.addEventListener('click', (event) => {
            recupDonnees(event)
        })

    }

    // Appel de la fonction principale
    init();

    /**
     * Fonction permettant de recuperer le panier (LocalStorage)
     */
    function recuperePanier() {

        for (let i = 0; i < localStorage.length; i++) {
            let cle = localStorage.key(i);

            let panier = localStorage.getItem(cle)
            afficherPanier(panier)
        }
    }

    /**
     * Fonction permettant de recuperer dans l'API un produit en fonction du l'ID transmis
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
     * Fonction permettant d'afficher le panier dans le DOM
     * @param {*} unpanier 
     */
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

    /**
     * Fonction permettant de calculer la quantité totale des produits du panier
     * @returns la quantité totale des produits du panier
     */
    function quantiteTotalProduit() {

        let totalProduit = document.querySelectorAll(".itemQuantity")
        let qttTotalProduit = 0
        for (let quantite of totalProduit) {
            qttTotalProduit = Number(qttTotalProduit) + Number(quantite.value)
        }

        return qttTotalProduit
    }

    /**
     * Fonction permettant de calculer le prix totale des produits du panier
     * @returns le prix total du panier
     */
    function quantiteTotalPrix() {

        let produitDuPanier = document.querySelectorAll(".cart__item")
        let qttTotalPrix = 0
        for (let produit of produitDuPanier) {
            let qttProduit = produit.querySelector(".itemQuantity").value

            let regex = /[0-9]+/g
            let prix = produit.querySelector(".prixProduit").textContent.match(regex)

            qttTotalPrix = qttTotalPrix + (qttProduit * Number(prix))

        }

        return qttTotalPrix
    }

    /**
     * Fonction permettant d'inserer le retour de la quantité et du prix total dans le DOM
     */
    function quantiteProduitPrixTotal() {

        let docTotalQuantity = document.querySelector("#totalQuantity")
        docTotalQuantity.insertAdjacentHTML("beforeend",
            quantiteTotalProduit()
        )

        let docTotalPrix = document.querySelector("#totalPrice")
        docTotalPrix.insertAdjacentHTML("beforeend",
            quantiteTotalPrix()
        )
    }

    /**
     * Fonction permettant de mettre a jour le localStorage lors d'une modification d'une quantité
     * @param {*} evenement 
     */
    function majDomLocalStorage(evenement) {

        let quantite = evenement.target
        let parent = quantite.closest("[data-id]")
        let id = parent.getAttribute("data-id")
        let color = parent.getAttribute("data-color")

        let donneTableau = [id, quantite.value, color]

        localStorage.setItem(`${id}-${color}`, JSON.stringify(donneTableau))
    }

    /**
     * Fonction permettant de reinitialiser l'affichage quantité/prix
     */
    function majDomQttPrix() {

        document.getElementById("totalQuantity").innerHTML = ""
        document.getElementById("totalPrice").innerHTML = ""
    }

    /**
     * Fonction permettant de supprimer un produit du DOM et du localStorage
     * @param {*} evenement 
     */
    function suppLigneCommande(evenement) {

        let cible = evenement.target

        let article = cible.closest("[data-id]")
        let id = article.getAttribute("data-id")
        let color = article.getAttribute("data-color")

        localStorage.removeItem(`${id}-${color}`)

        article.remove()

    }

    /**
     * Fonction permettant de recuperer les informations de l'utilisateur,
     * de verifier leurs conformités avec les Regex,
     * d'afficher un message d'erreur si besoin,
     * et envoyer la commande à la fonction envoieCommande
     * @param {*} evenement 
     */
    function recupDonnees(evenement) {

        let recupPrenom = document.querySelector("#firstName").value
        let recupNom = document.querySelector("#lastName").value
        let recupAdresse = document.querySelector("#address").value
        let recupVille = document.querySelector("#city").value
        let recupMail = document.querySelector("#email").value

        evenement.preventDefault()

        let returnPrenom = verifchainecaract(recupPrenom)
        let returnNom = verifchainecaract(recupNom)
        let returnAdresse = verifadresse(recupAdresse)
        let returnVille = verifchainecaract(recupVille)
        let returnEmail = verifemail(recupMail)


        let pErrorMsgPrenom = document.querySelector("#firstNameErrorMsg")
        if (returnPrenom === true) {
            pErrorMsgPrenom.innerText = ""
        }
        else {
            pErrorMsgPrenom.innerText = "Le prénom saisie n'est pas conforme"
        }

        let pErrorMsgNom = document.querySelector("#lastNameErrorMsg")
        if (returnNom === true) {
            pErrorMsgNom.innerText = ""
        }
        else {
            pErrorMsgNom.innerText = "Le nom saisie n'est pas conforme"
        }

        let pErrorMsgAdresse = document.querySelector("#addressErrorMsg")
        if (returnAdresse === true) {
            pErrorMsgAdresse.innerText = ""
        }
        else {
            pErrorMsgAdresse.innerText = "L'adresse saisie n'est pas conforme"
        }

        let pErrorMsgVille = document.querySelector("#cityErrorMsg")
        if (returnVille === true) {
            pErrorMsgVille.innerText = ""
        }
        else {
            pErrorMsgVille.innerText = "La ville saisie n'est pas conforme"
        }

        let pErrorMsgMail = document.querySelector("#emailErrorMsg")
        if (returnEmail === true) {
            pErrorMsgMail.innerText = ""
        }
        else {
            pErrorMsgMail.innerText = "L'email saisie n'est pas conforme"
        }

        if (returnPrenom && returnNom && returnAdresse && returnVille && returnEmail) {
            const objcontact = {
                firstName: recupPrenom,
                lastName: recupNom,
                address: recupAdresse,
                city: recupVille,
                email: recupMail
            }

            let tabproduit = []
            let panier = Object.keys(localStorage)
            let i = panier.length
            while (i--) {
                tabproduit.push(JSON.parse(localStorage.getItem(panier[i]))[0])
            }

            let commande = {
                contact: objcontact,
                products: tabproduit
            }

            if (tabproduit.length >= 1) {
                envoieCommande(commande)
            }
        }
    }

    /**
     * Fonction permettant de verifier les chaines de caracteres
     * @param {*} parametre 
     * @returns vrai ou faux
     */
    function verifchainecaract(parametre) {

        const chaineCaractRegex = /^[a-zA-Z- éèëêô]+$/
        const resultat = chaineCaractRegex.test(parametre)

        return resultat
    }

    /**
     * Fonction permettant de verifier l'adresse
     * @param {*} parametre 
     * @returns vrai ou faux
     */
    function verifadresse(parametre) {

        const adresseRegex = /^[a-zA-Z0-9,éèëêô .'-]{3,}$/
        const resultat = adresseRegex.test(parametre)

        return resultat
    }

    /**
     * Fonction permettant de verifier l'email
     * @param {*} parametre 
     * @returns vrai ou faux
     */
    function verifemail(parametre) {

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const resultat = emailRegex.test(parametre)

        return resultat
    }

    /**
     * Fonction permettant d'enregistrer la commande dans l'API,
     * rediriger vers la page confirmation, en incluant le numéro de commande dans l'URL,
     * et de supprimer le localStorage
     * @param {*} data 
     */
    async function envoieCommande(data) {

        try {
            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((reponse) => reponse.json())
                .then((dt) => {
                    localStorage.clear()

                    window.location = `../html/confirm.html?commandeID=${dt.orderId}`
                })
        }
        catch (error) {
            console.error("Error:", error)
        }
    }

})