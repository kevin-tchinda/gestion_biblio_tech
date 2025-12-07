// DIHIA:

// variables globales Modernité JS :
let dataBase = [];
let x = 0; // compteur
let estDebug = true; // mode debug on --- non constante,
const BIBLIO_DB_FINAL = "biblio_db_final";

// fonction de lancement
const lancerApplication = () => {
  // camelCase sur Fonctions et PascalCase sur classes
  // recupere le localstorage
  const savedData = localStorage.getItem(BIBLIO_DB_FINAL);

  // verifie si vide
  if (savedData) {
    try {
      // SYSTEME DE SECURITE - NE PAS TOUCHER
      // Utilisation de JSON.parse a la place de eval
      const parsedData = JSON.parse(savedData);

      if (Array.isArray(parsedData) && parsedData.length > 0) {
        dataBase = parsedData;
        x = dataBase[dataBase.length - 1].uid;
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
  const titre = document.getElementById("inp_A").value.trim(); // titre
  const auteur = document.getElementById("inp_B").value.trim(); // auteur
  const categorie = document.getElementById("sel_X").value; // categorie
  const isbn = document.getElementById("inp_C").value.trim(); // ISBN

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
  x += 1;

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
    uid: x,
    title: titre,
    author: auteur,
    category: label,
    info: `${isbn} | ${dateString}`,
    isDead: false,
  };

  dataBase.push(livre);
  sauvegarderLeTout();

  afficherTableau();

  // vider les champs
  document.getElementById("inp_A").value = "";
  document.getElementById("inp_B").value = "";
  document.getElementById("inp_C").value = "";

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
    if (!livre.isDead) {
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

  // ajouter la suppretion a chaque bouton
  document.querySelectorAll(".btn-del").forEach((btn) => {
    // ecouteurs d'événements propre
    btn.addEventListener("click", () => {
      // appel la fonction de suppression en passant l'id de livre concerner
      supprimerLivre(btn.dataset.id);
    });
  });
};

const supprimerLivre = (id) => {
  // Affiche une boîte de confirmation pour éviter une suppression accidentelle
  if (confirm("Supprimer ?")) {
    // on parcourt tous les livres de la base de donnees
    for (let z = 0; z < dataBase.length; z++) {
      // on verifie si lidentifiant correspond au livre a supprimer
      if (dataBase[z].uid == id) {
        // soft delete
        dataBase[z].isDead = true;
      }
    }
    sauvegarderLeTout();
    afficherTableau();
  }
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
const resetDatabase = () => {
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
