document.addEventListener("DOMContentLoaded", function (event) {


    async function init() {

        recuperePanier()


        window.onload = (event) => {

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

    function quantiteTotalProduit() {

        let totalProduit = document.querySelectorAll(".itemQuantity")
        let qttTotalProduit = 0
        for (let quantite of totalProduit) {
            qttTotalProduit = Number(qttTotalProduit) + Number(quantite.value)
        }

        return qttTotalProduit

    }

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

    function majDomLocalStorage(evenement) {

        let quantite = evenement.target
        let parent = quantite.closest("[data-id]")
        let id = parent.getAttribute("data-id")
        let color = parent.getAttribute("data-color")

        let donneTableau = [id, quantite.value, color]

        localStorage.setItem(`${id}-${color}`, JSON.stringify(donneTableau))

    }

    function majDomQttPrix() {

        document.getElementById("totalQuantity").innerHTML = ""
        document.getElementById("totalPrice").innerHTML = ""

    }

    function suppLigneCommande(evenement) {

        let cible = evenement.target

        let article = cible.closest("[data-id]")
        let id = article.getAttribute("data-id")
        let color = article.getAttribute("data-color")

        localStorage.removeItem(`${id}-${color}`)

        article.remove()

    }

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

    function verifchainecaract(parametre) {

        const chaineCaractRegex = /^[a-zA-Z- éèëêô]+$/
        const resultat = chaineCaractRegex.test(parametre)

        return resultat
    }

    function verifadresse(parametre) {

        const adresseRegex = /^[a-zA-Z0-9,éèëêô .'-]{3,}$/
        const resultat = adresseRegex.test(parametre)

        return resultat
    }

    function verifemail(parametre) {

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const resultat = emailRegex.test(parametre)

        return resultat
    }



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
                    console.log(dt)
                    localStorage.clear()
                    localStorage.setItem("commandeID", dt.orderId)

                    document.location.href = "../html/confirmation.html"
                })
        }
        catch (error) {
            console.error("Error:", error)
        }
    }


})