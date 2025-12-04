// DIHIA:


// variables globales Modernité JS :
let DATA_BASE = [];
let x = 0; // compteur
const EST_DEBUG = true; // mode debug on (const car ça ne change pas)




// fonction de lancement  Modernité JS :
const lancerApplication = () => {
  // recupere le localStorage
  const savedData = localStorage.getItem("biblio_db_final");

  if (savedData) {
    try {
      // Utilisation de JSON.parse a la place de eval
      const parsedData = JSON.parse(savedData);

      if (Array.isArray(parsedData) && parsedData.length > 0) {
        DATA_BASE = parsedData;
        x = DATA_BASE[DATA_BASE.length - 1].uid;
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du localStorage :", error);
    }
  }

  // Affichage
  Display(); 
};






// fonction principale d'enregistrement (camelCase + arrow function)
const executeSaveDataToMemory = () => {
  // recuperer les valeurs des inputs
  const v1 = document.getElementById("inp_A").value.trim(); // titre
  const v2 = document.getElementById("inp_B").value.trim(); // auteur
  const v3 = document.getElementById("sel_X").value;        // categorie
  const v4 = document.getElementById("inp_C").value.trim(); // ISBN

  // validations simples
  if (!v1) {
    alert("Erreur Titre");
    return;
  }

  if (!v2) {
    alert("Erreur Auteur");
    return;
  }

  if (v4.length <= 3) {
    alert("Erreur ISBN");
    return;
  }

  // incremente le compteur
  x += 1;

  // gestion de la date
  const today = new Date();
  const dateString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  // logique categorie
  let label = "Roman";
  if (v3 === "1") {
    label = "Science-Fiction";
  } else if (v3 === "2") {
    label = "Documentaire";
  }

  // objet a sauvegarder (on garde les memes cles que notre ancien code)
  const Thing = {
    uid: x,
    Name: v1,
    auteur_name: v2,
    k: label,
    stuff: `${v4} | ${dateString}`,
    is_dead: false
  };

  DATA_BASE.push(Thing);
  sauvegarderLeTout(); // nouveau nom camelCase

  Display();

  // vider les champs
  document.getElementById("inp_A").value = "";
  document.getElementById("inp_B").value = "";
  document.getElementById("inp_C").value = "";

  alert_user("C'est bon !");
};



//sauvegarderLeTout
const sauvegarderLeTout = () => {
  localStorage.setItem("biblio_db_final", JSON.stringify(DATA_BASE));
};



//MASSI :


function Display() {
    var el = document.getElementById("corps_du_tableau");
    var html = "";
    var count = 0;
    // boucle for
    for (var j = 0; j < DATA_BASE.length; j++) {
        var o = DATA_BASE[j];
        // check si mort
        if (o.is_dead == false) {
        count++;
        // concatenation html
        html +=
            "<tr>" +
            "<td>#" +
            o.uid +
            "</td>" +
            "<td><b>" +
            o.Name.toUpperCase() +
            "</b><br><i>" +
            o.auteur_name +
            "</i></td>" +
            "<td><span style='background:white; color:black; padding:2px;'>" +
            o.k +
            "</span></td>" +
            "<td>" +
            o.stuff +
            "</td>" +
            "<td><button class='btn-del' onclick='del(" +
            o.uid +
            ")'>X</button></td>" +
            "</tr>";
        }
    }
    el.innerHTML = html;
    document.getElementById("cpt").innerHTML = count;
    }


function del(id) {
    // demande confirmation
    if (confirm("Supprimer ?")) {
        for (var z = 0; z < DATA_BASE.length; z++) {
        if (DATA_BASE[z].uid == id) {
            // soft delete
            DATA_BASE[z].is_dead = true;
        }
        }
        sauvegarder_le_tout();
        Display();
    }
}


function regarder(val) {
    var t = document.getElementById("tab");
    var rows = t.getElementsByTagName("tr");
    var f = val.toUpperCase();
    // boucle sur les tr
    for (var i = 1; i < rows.length; i++) {
        var col = rows[i].getElementsByTagName("td")[1];
        if (col) {
        var txt = col.textContent || col.innerText;
        if (txt.toUpperCase().indexOf(f) > -1) {
            rows[i].style.display = ""; // montre
        } else {
            rows[i].style.display = "none"; // cache
        }
        }
    }
}


// fonction pour tuer la base
function kill() {
    localStorage.clear();
    location.reload();
}


function alert_user(msg) {
    var z = document.getElementById("zone_m");
    z.innerText = msg;
    // attend 3 secondes
    setTimeout(function () {
        z.innerText = "";
    }, 3000);
}