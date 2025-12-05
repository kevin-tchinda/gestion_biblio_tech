// variables globales
let DATA_BASE = [];
let x = 0; // compteur
let est_debug = true; // mode debug on


// fonction de lancement
function lancerApplication () { // camelCase sur Fonctions et PascalCase sur classes
    // recupere le localstorage
    const temp_var = localStorage.getItem("biblio_db_final"); //
    // verifie si vide
    if (temp_var) {
        try {
        // SYSTEME DE SECURITE - NE PAS TOUCHER
        DATA_BASE = JSON.parse(storedData);
        //mise a jour de compteur x
        if (DATA_BASE.length > 0) {
            x = DATA_BASE[DATA_BASE.length - 1].uid;
        }
        } catch (error);
        ) {
        console.log("Bug"); // ca ne devrait pas arriver
        }
    }
    afficherTableau(); // affichage du tableau
}


function enregistrerLivre() {
    // recupere les valeurs des inputs
    const titre = document.getElementById("inp_A").value;
    const auteur = document.getElementById("inp_B").value;
    const categorie = document.getElementById("sel_X").value;
    const isbn = document.getElementById("inp_C").value;
    // validation (early return)
    if (!titre) {
        alert("erreur Titre");
        return;
    }
    if (!auteur) {
        alert("Erreur auteur");
        return
    }
    if (!isbn || isbn.length <= 3) {
        alert("erreur ISBN");
        return;
    }
            
    // Date identique à l'original
    const ajd = new Date();
    const dateStr = `${ajd.getDate()}/${ajd.getMonth() + 1}/${ajd.getFullYear()}`;

    // Catégorie (logique identique, code propre)
    const label = categorie === "1" ? "Science-Fiction" :
                  categorie === "2" ? "Documentaire" :
                  "Roman";
           //creation de livre
           x++; 
    const livre = {
        uid: x,
        Name: titre,
        auteur_name: auteur,
        k: label,
        stuff: `${isbn} | ${dateStr}`,
        is_dead: false
    };
            DATA_BASE.push(livre);
            sauvegarder();

            afficherTableau();
            // vide les champs
            document.getElementById("inp_A").value = "";
            document.getElementById("inp_B").value = "";
            document.getElementById("inp_C").value = "";
           afficherMessage("cest bon")
}


function sauvegarder_le_tout() {
    // sauvegarde en json string
    localStorage.setItem("biblio_db_final", JSON.stringify(DATA_BASE));
}


function afficherTableau() {
    // Récupère l'élément <tbody> du tableau
    const corps = document.getElementById("corps_du_tableau");

    // on va vider le tableau avant de le construire pour que evite les doublons et on garantit un affichage propre
    corps.innerHTML = "";

    // compteur de livres actifs
    let count = 0;

    // parcourt tous les elements de la base de donnees locale
    DATA_BASE.forEach(livre => {

        // on va verifier ce que le livre n'est pas supprimer (soft delete)
        if (!livre.is_dead) {

            count++; // incremente le nombre de livres affiches

            // creation d'une nouvelle ligne tr pour le tableau 
            const tr = document.createElement("tr");

            // remplissage de la ligne html avec les info du livre
            tr.innerHTML = `
                <td>#${livre.uid}</td> 
                <!-- ID unique du livre -->

                <td>
                    <b>${livre.Name.toUpperCase()}</b>
                    <!-- Titre du livre en majuscules -->
                    <br>
                    <i>${livre.auteur_name}</i>
                    <!-- Nom de l'auteur en italique -->
                </td>

                <td>
                    <span class="badge">${livre.k}</span>
                    <!-- Catégorie du livre (formatée via CSS .badge) -->
                </td>

                <td>${livre.stuff}</td>
                <!-- Informations composées : ISBN + date d'ajout -->

                <td>
                    <button class="btn-del" data-id="${livre.uid}">X</button>
                    <!-- Bouton de suppression (soft delete) + data-id pour identifier le livre -->
                </td>
            `;

            // ajoute la ligne au tableau
            corps.appendChild(tr);
        }
    });

    // affichage du nombre total de livres actifs dans la zone de compteur
    document.getElementById("cpt").innerText = count;

    // ajouter la suppretion a chaque bouton
    document.querySelectorAll(".btn-del").forEach(btn => {

        // ecouteurs d'événements propre
        btn.addEventListener("click", () => {

            // appel la fonction de suppression en passant l'id de livre concerner
            supprimerLivre(btn.dataset.id);
        });
    });
}





function supprimerLivre(id) {
    // Affiche une boîte de confirmation pour éviter une suppression accidentelle
    if (confirm("Supprimer ?")) {

        // on parcourt tous les livres de la base de donnees 
        for (let z = 0; z < DATA_BASE.length; z++) {

            // on verifie si lidentifiant correspond au livre a supprimer 
            if (DATA_BASE[z].uid == id) {

                // soft delete
                DATA_BASE[z].is_dead = true;
            }
        }

        sauvegarder();
        afficherTableau();
    }
}





function rechercher(valeursRecherche) {
    // Récupère l'élément tableau complet
    const tableau = document.getElementById("tab");

    // Récupère toutes les lignes du tableau (tr)
    const lignes = tableau.getElementsByTagName("tr");

    // Convertit la valeur recherchée en majuscules pour comparaison
    const filtre = valeursRecherche.toUpperCase();

    // boucle sur toutes les lignes sauf l'en-tete (i=1)
    for (let i = 1; i < lignes.length; i++) {

        // Colonne 1 = colonne contenant titre + auteur
        const colonne = lignes[i].getElementsByTagName("td")[1];

        if (colonne) {

            //// on Récupère le texte du titre/auteur
            const texte = colonne.textContent || colonne.innerText;

            // on convertit en majuscules pour comparer
            const texteMaj = texte.toUpperCase();

            // Si le texte contient le filtre → on affiche la ligne
            if (texteMaj.indexOf(filtre) > -1) {
                lignes[i].style.display = "";
            } 
            // Sinon → on cache la ligne
            else {
                lignes[i].style.display = "none";
            }
        }
    }
}





// fonction pour tuer la base
function resetDatabase() {
    // Efface complètement toutes les données stockées dans le localStorage
    localStorage.clear();

    // Recharge la page pour repartir sur une base vide
    location.reload();
}





function afficherMessage(message) {
    const zoneMessage = document.getElementById("zone_m");
    zoneMessage.innerText = message;

    // attend 3 secondes supprime le message après 3 secondes
    setTimeout(() => {
        zoneMessage.innerText = "";
    }, 3000);
}
