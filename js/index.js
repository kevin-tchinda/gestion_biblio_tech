// DIHIA:

// variables globales Modernité JS :
let dataBase = [];
let idLivre = 0; // Compteur de suppression - identifie chaque element à supprimer (soft delete)
const BIBLIO_DB_FINAL = "biblio_db_final";

// fonction de lancement
const lancerApplication = () => {
  // camelCase sur Fonctions et PascalCase sur classes
  // recupere le localstorage
  const savedData = localStorage.getItem(BIBLIO_DB_FINAL);

  // verifie si vide
  if (savedData) {
    try {
      // Utilisation de JSON.parse a la place de eval
      const parsedData = JSON.parse(savedData);

      if (Array.isArray(parsedData) && parsedData.length > 0) {
        dataBase = parsedData;
        idLivre = dataBase[dataBase.length - 1].uid;
      }
    } catch (error) {
      // e: paramètre pas explicite
      // Message "Bug" comme érreur - non explicite
      console.error("Erreur lors de la lecture du localStorage :", error);
    }
  }
  afficherTableau(); // changement de `Display` en `afficherTableau` - Compréhensible
};

// fonction principale d'enregistrement (camelCase + arrow function)
const executeSaveDataToMemory = () => {
  // recuperer les valeurs des inputs
  const titre = document.getElementById("input-titre").value.trim(); // titre
  const auteur = document.getElementById("input-auteur").value.trim(); // auteur
  const categorie = document.getElementById("select-category").value; // categorie
  const isbn = document.getElementById("input-isbn").value.trim(); // ISBN

  // validation (early return)
  if (!titre) {
    alert("erreur Titre");
    return;
  }
  if (!auteur) {
    alert("Erreur auteur");
    return;
  }
  if (!isbn || isbn.length <= 3) {
    alert("erreur ISBN");
    return;
  }

  // incremente le compteur
  idLivre += 1;

  // gestion de la date
  const today = new Date();
  const dateString = `${today.getDate()}/${
    today.getMonth() + 1
  }/${today.getFullYear()}`;

  // Catégorie (logique identique, code propre)
  let label =
    categorie === "1"
      ? "Science-Fiction"
      : categorie === "2"
      ? "Documentaire"
      : "Roman"; // Usage des opérateurs ternaires

  // objet a sauvegarder (on garde les memes cles que notre ancien code)

  const livre = {
    uid: idLivre,
    title: titre,
    author: auteur,
    category: label,
    info: `${isbn} | ${dateString}`,
    isDelete: false,
  };

  dataBase.push(livre);
  sauvegarderLeTout();

  afficherTableau();

  // vider les champs
  document.getElementById("input-titre").value = "";
  document.getElementById("input-auteur").value = "";
  document.getElementById("input-isbn").value = "";

  afficherMessage("C'est bon !");
};

//sauvegarderLeTout
const sauvegarderLeTout = () => {
  // sauvegarde en json string
  localStorage.setItem(BIBLIO_DB_FINAL, JSON.stringify(dataBase));
};

//MASSI :
const afficherTableau = () => {
  // Récupère l'élément <tbody> du tableau
  const corps = document.getElementById("corps-du-tableau");

  // on va vider le tableau avant de le construire pour que evite les doublons et on garantit un affichage propre
  corps.innerHTML = "";

  // compteur de livres actifs
  let count = 0;

  // parcourt tous les elements de la base de donnees locale
  dataBase.forEach((livre) => {
    // on va verifier ce que le livre n'est pas supprimer (soft delete)
    if (!livre.isDelete) {
      count++; // incremente le nombre de livres affiches

      // creation d'une nouvelle ligne tr pour le tableau
      const tr = document.createElement("tr");

      // remplissage de la ligne html avec les info du livre
      tr.innerHTML = `
                <td>#${livre.uid}</td> 
                <!-- ID unique du livre -->

                <td>
                    <b>${livre.title.toUpperCase()}</b>
                    <!-- Titre du livre en majuscules -->
                    <br>
                    <i>${livre.author}</i>
                    <!-- Nom de l'auteur en italique -->
                </td>

                <td>
                    <span class="badge">${livre.category}</span>
                    <!-- Catégorie du livre (formatée via CSS .badge) -->
                </td>

                <td>${livre.info}</td>
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

};


const supprimerLivre = (id) => {

  // Demande une confirmation avant suppression
  if (!confirm("Supprimer ?")) return;

  // Recherche du livre correspondant
  const livre = dataBase.find(l => l.uid == id);
  if (!livre) return;

  // Soft delete
  livre.isDelete = true;

  // Sauvegarde et rafraîchissement d’affichage
  sauvegarderLeTout();
  afficherTableau();
};


const rechercher = (valeursRecherche) => {
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
      // Sinon => on cache la ligne
      else {
        lignes[i].style.display = "none";
      }
    }
  }
};


// fonction pour tuer la base
const resetDataBase = () => {
  // Efface complètement toutes les données stockées dans le localStorage
  localStorage.clear();

  // Recharge la page pour repartir sur une base vide
  location.reload();
};

const afficherMessage = (message) => {
  const zoneMessage = document.getElementById("zone-m");
  zoneMessage.innerText = message;

  // attend 3 secondes supprime le message après 3 secondes
  setTimeout(() => {
    zoneMessage.innerText = "";
  }, 3000);
};


// Retirer les appels de fonctions js inline-HTML
window.addEventListener("DOMContentLoaded", () => {
  // Lancer l'application principale
  lancerApplication();

  // ENREGISTRER
  document.querySelector(".btn-add")
    .addEventListener("click", executeSaveDataToMemory);

  // RAZ/Reinitialiser
  document.getElementById("btn-reset")
    .addEventListener("click", resetDataBase);

  // Champ de recherche
  const searchField = document.querySelector(".search-field");
  searchField.addEventListener("keyup", (e) => {
    rechercher(e.target.value);
  });

  // Boutons de suppression (delegation pour le tableau)
  document.addEventListener("click", (e) => {
    if (e.target.matches(".btn-del")) {
      supprimerLivre(e.target.dataset.id);
    }
  });
});
