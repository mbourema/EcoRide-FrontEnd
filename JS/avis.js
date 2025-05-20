import { apiUrl, getToken, getId, sanitizeHtml } from "./index.js";



// Fonction pour récupérer les covoiturages via les paiements de l'utilisateur
async function getCovoiturages() {
    const token = getToken();
    const utilisateurId = getId();

    if (!token || !utilisateurId) {
        return;
    }

    try {
        // Récupération des paiements
        const response = await fetch(`${apiUrl}/paiements`, {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": token
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur récupération des paiements : ${response.status}`);
        }

        const paiements = await response.json();
        
        // Filtrage des paiements pour n'afficher que ceux de l'utilisateur connecté
        const paiementsUtilisateur = paiements.filter(paiement => paiement.utilisateur_id === Number(utilisateurId));
        console.log("Liste des paiements de l'utilisateur :", paiementsUtilisateur);

        // Passer les paiements filtrés à la fonction populateCovoiturageSelect
        populateCovoiturageSelect(paiementsUtilisateur);
    } catch (error) {
        Swal.fire({
            text: "Erreur lors de la récupération des paiements",
            icon: "error",
            position: "center",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false
        });
    }
}

// Fonction pour remplir la liste déroulante des covoiturages avec la date de paiement
function populateCovoiturageSelect(paiementsUtilisateur) {
    const select = document.getElementById("covoiturageSelect");

    // Assurez-vous qu'il y ait des paiements à afficher
    if (paiementsUtilisateur.length === 0) {
        select.innerHTML = `<option value="">Aucun covoiturage disponible</option>`;
        return;
    }

    // Ajouter chaque date de paiement dans le select
    paiementsUtilisateur.forEach(paiement => {
        const option = document.createElement("option");
        option.value = paiement.covoiturage_id; // Garder l'id du covoiturage comme valeur
        option.textContent = `Covoiturage ID: ${paiement.covoiturage_id} - Date du paiement : ${paiement.date_paiement}`; // Affiche la date de paiement
        select.appendChild(option);
    });
}




// Gérer l'affichage ou non du champ justification en fonction de la case à cocher
document.getElementById("signaler").addEventListener("change", function() {
    const justificationContainer = document.getElementById("justificationContainer");
    if (this.checked) {
        justificationContainer.style.display = "block";
    } else {
        justificationContainer.style.display = "none";
    }
});

// Fonction pour soumettre l'avis
document.getElementById("avisForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const covoiturageId = document.getElementById("covoiturageSelect").value;
    const note = parseFloat(document.getElementById("note").value);
    const signaler = document.getElementById("signaler").checked;
    const commentaire = document.getElementById("commentaire").value;
    const justification = document.getElementById("justification").value || "";

    // Vérifications simples des champs
    if (!covoiturageId || !note || !commentaire) {
        Swal.fire({
            text: "Tous les champs obligatoires doivent être remplis !",
            icon: "error",
            position: "center",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false
        });
        return;
    }

    const token = getToken();
    const utilisateurId = getId();

    if (!token || !utilisateurId) {
        return;
    }

    const body = {
        "utilisateur_id_passager": utilisateurId,
        "covoiturage_id": parseInt(covoiturageId),
        "note": sanitizeHtml(note),
        "signale": signaler,
        "commentaire": sanitizeHtml(commentaire),
        "justification": sanitizeHtml(justification)
    };

    // Soumettre l'avis
    fetch(`${apiUrl}/avis/add`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-AUTH-TOKEN": token
        },
        body: JSON.stringify(body)
    })
    .then(response => {
        if (response.ok) {
            Swal.fire({
                text: "Avis soumis avec succès !",
                icon: "success",
                position: "center",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: false
            }).then(() => window.location.replace("/")); 
        } else {
            Swal.fire({
                text: "Erreur lors de la soumission de l'avis.",
                icon: "error",
                position: "center",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: false
            });
        }
    })
    .catch(error => {
        Swal.fire({
            text: "Une erreur est survenue.",
            icon: "error",
            position: "center",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: false
        });
    });
});

setTimeout(function() {
    getCovoiturages(); 
}, 100);  




