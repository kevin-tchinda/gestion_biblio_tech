// variables globales
var DATA_BASE = [];
var x = 0; // compteur
var est_debug = true; // mode debug on


// fonction de lancement
const lancerApplication =  () => { // camelCase sur Fonctions et PascalCase sur classes
    // recupere le localstorage
    let temp_var = localStorage.getItem("biblio_db_final"); // Var local, `let`
    // verifie si vide
    if (temp_var) {
        try {
        // SYSTEME DE SECURITE - NE PAS TOUCHER
        DATA_BASE = eval("(" + temp_var + ")");
        if (DATA_BASE.length > 0) {
            x = DATA_BASE[DATA_BASE.length - 1].uid;
        }
        } catch (e) {
        console.log("Bug"); // ca ne devrait pas arriver
        }
    }
    Display(); // affiche
}


function Excecute_Save_Data_To_Memory() {
    // recupere les valeurs des inputs
    var v1 = document.getElementById("inp_A").value;
    var v2 = document.getElementById("inp_B").value;
    var v3 = document.getElementById("sel_X").value;
    var v4 = document.getElementById("inp_C").value;
    // check si vide
    if (v1 != "") {
        if (v2 != "") {
        if (v4.length > 3) {
            x++; // incremente x
            // gestion de la date
            var ajd = new Date();
            var string =
            ajd.getDate() +
            "/" +
            (ajd.getMonth() + 1) +
            "/" +
            ajd.getFullYear();
            var label = "";
            // logique complexe categorie
            if (v3 == "1") label = "Science-Fiction";
            else if (v3 == "2") label = "Documentaire";
            else label = "Roman";
            // objet a sauvegarder
            var Thing = {
            uid: x,
            Name: v1,
            auteur_name: v2,
            k: label,
            stuff: v4 + " | " + string,
            is_dead: false,
            };
            DATA_BASE.push(Thing);
            sauvegarder_le_tout();
            Display();
            // vide les champs
            document.getElementById("inp_A").value = "";
            document.getElementById("inp_B").value = "";
            document.getElementById("inp_C").value = "";
            alert_user("C'est bon");
        } else {
            alert("Erreur ISBN"); // erreur
        }
        } else {
        // alert("Erreur Auteur");
        alert("Erreur Auteur");
        }
    } else {
        alert("Erreur Titre");
    }
}


function sauvegarder_le_tout() {
    // sauvegarde en json string
    localStorage.setItem("biblio_db_final", JSON.stringify(DATA_BASE));
}


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