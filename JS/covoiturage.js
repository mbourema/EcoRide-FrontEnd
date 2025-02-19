import { apiUrl, getId, getToken } from "./index.js";

const inputDateDepart = document.getElementById("date_depart");
const inputDateArrivee = document.getElementById("date_arrivee");
const inputLieuDepart = document.getElementById("lieu_depart");
const inputLieuArrivee = document.getElementById("lieu_arrivee");
const inputPlacesDisponibles = document.getElementById("places_disponibles");
const inputPrixPersonne = document.getElementById("prix_personne");
const inputVoiture = document.getElementById("voiture");
const inputPseudoConducteur = document.getElementById("pseudo_conducteur");
const inputEmailConducteur = document.getElementById("email_conducteur");
const buttonProposerTrajet = document.querySelector("button[type='submit']");
const formulaireCovoiturage = document.getElementById("covoiturageForm");

// Ajout des événements pour la validation des champs
inputDateDepart.addEventListener("input", validateDateDepart);
inputDateArrivee.addEventListener("input", validateDateArrivee);
inputLieuDepart.addEventListener("input", validateLieuDepart);
inputLieuArrivee.addEventListener("input", validateLieuArrivee);
inputPlacesDisponibles.addEventListener("input", validatePlacesDisponibles);
inputPrixPersonne.addEventListener("input", validatePrixPersonne);
inputVoiture.addEventListener("input", validateVoiture);
inputPseudoConducteur.addEventListener("input", validatePseudoConducteur);
inputEmailConducteur.addEventListener("input", validateEmailConducteur);

// Validation de la date de départ
function validateDateDepart() {
    if (inputDateDepart.value.trim() === "") {
        inputDateDepart.classList.remove("is-valid");
        inputDateDepart.classList.add("is-invalid");
    } else {
        inputDateDepart.classList.add("is-valid");
        inputDateDepart.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

function validateDateArrivee() {
    if (inputDateArrivee.value.trim() === "" || new Date(inputDateArrivee.value) <= new Date(inputDateDepart.value)) {
        inputDateArrivee.classList.remove("is-valid");
        inputDateArrivee.classList.add("is-invalid");
    } else {
        inputDateArrivee.classList.add("is-valid");
        inputDateArrivee.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}


// Validation du lieu de départ
function validateLieuDepart() {
    const LieuDepartRegex = /^[A-Z][a-z]*([ -']?[a-z]+)*$/; 

    if (inputLieuDepart.value.trim() === "" || !LieuDepartRegex.test(inputLieuDepart.value.trim())) {
        inputLieuDepart.classList.remove("is-valid");
        inputLieuDepart.classList.add("is-invalid");
    } else {
        inputLieuDepart.classList.add("is-valid");
        inputLieuDepart.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

// Validation du lieu d'arrivée
function validateLieuArrivee() {
    const LieuArriveeRegex = /^[A-Z][a-z]*([ -']?[a-z]+)*$/; 

    if (inputLieuArrivee.value.trim() === "" || !LieuArriveeRegex.test(inputLieuArrivee.value.trim())) {
        inputLieuArrivee.classList.remove("is-valid");
        inputLieuArrivee.classList.add("is-invalid");
    } else {
        inputLieuArrivee.classList.add("is-valid");
        inputLieuArrivee.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

// Validation du nombre de places disponibles
function validatePlacesDisponibles() {
    if (inputPlacesDisponibles.value.trim() === "" || inputPlacesDisponibles.value <= 0) {
        inputPlacesDisponibles.classList.remove("is-valid");
        inputPlacesDisponibles.classList.add("is-invalid");
    } else {
        inputPlacesDisponibles.classList.add("is-valid");
        inputPlacesDisponibles.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

// Validation du prix par personne
function validatePrixPersonne() {
    if (inputPrixPersonne.value.trim() === "" || inputPrixPersonne.value <= 0) {
        inputPrixPersonne.classList.remove("is-valid");
        inputPrixPersonne.classList.add("is-invalid");
    } else {
        inputPrixPersonne.classList.add("is-valid");
        inputPrixPersonne.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

// Validation de la voiture choisie
function validateVoiture() {
    if (inputVoiture.value.trim() === "") {
        inputVoiture.classList.remove("is-valid");
        inputVoiture.classList.add("is-invalid");
    } else {
        inputVoiture.classList.add("is-valid");
        inputVoiture.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

// Validation du pseudo du conducteur
function validatePseudoConducteur() {
    if (inputPseudoConducteur.value.trim() === "") {
        inputPseudoConducteur.classList.remove("is-valid");
        inputPseudoConducteur.classList.add("is-invalid");
    } else {
        inputPseudoConducteur.classList.add("is-valid");
        inputPseudoConducteur.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

// Validation de l'email du conducteur
function validateEmailConducteur() {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (inputEmailConducteur.value.trim() === "" || !inputEmailConducteur.value.match(emailRegex)) {
        inputEmailConducteur.classList.remove("is-valid");
        inputEmailConducteur.classList.add("is-invalid");
    } else {
        inputEmailConducteur.classList.add("is-valid");
        inputEmailConducteur.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

// Fonction pour activer/désactiver le bouton de soumission
function toggleSubmitButton() {
    const isDateDepartValid = inputDateDepart.classList.contains("is-valid");
    const isDateArriveeValid = inputDateArrivee.classList.contains("is-valid");
    const isLieuDepartValid = inputLieuDepart.classList.contains("is-valid");
    const isLieuArriveeValid = inputLieuArrivee.classList.contains("is-valid");
    const isPlacesDisponiblesValid = inputPlacesDisponibles.classList.contains("is-valid");
    const isPrixPersonneValid = inputPrixPersonne.classList.contains("is-valid");
    const isVoitureValid = inputVoiture.classList.contains("is-valid");
    const isPseudoConducteurValid = inputPseudoConducteur.classList.contains("is-valid");
    const isEmailConducteurValid = inputEmailConducteur.classList.contains("is-valid");

    // Si tous les champs sont valides, on active le bouton
    if (isDateDepartValid && isDateArriveeValid && isLieuDepartValid && isLieuArriveeValid && isPlacesDisponiblesValid && isPrixPersonneValid && isVoitureValid && isPseudoConducteurValid && isEmailConducteurValid) {
        buttonProposerTrajet.disabled = false;
    } else {
        buttonProposerTrajet.disabled = true;
    }
}

// Fonction pour charger dynamiquement les voitures de l'utilisateur
function loadCars() {
    let token = getToken();
    if (!token) {
        console.error('Le jeton d\'authentification est manquant.');
        return;
    }

    // Récupérer les voitures via l'API
    fetch(apiUrl + "/api/voitures/liste", {
        method: 'GET',
        headers: {
            'X-AUTH-TOKEN': token,
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => { 
        // Filtrer les voitures de l'utilisateur connecté
        const userId = getId();
        const userCars = data.filter(car => car.utilisateur.id === Number(getId()));

        inputVoiture.innerHTML = '<option value="" disabled selected>Choisir une voiture</option>';

        // Ajouter une option pour chaque voiture de l'utilisateur
        userCars.forEach(car => {
            const option = document.createElement("option");
            option.value = car.id; 
            option.textContent = `${car.modele} (${car.marque.nom})`; 
            inputVoiture.appendChild(option);          
        });
        if (userCars.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.disabled = true;
            option.textContent = "Aucune voiture disponible";
            inputVoiture.appendChild(option);
        } 
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des voitures :', error);
    });
}

// Appeler la fonction pour charger les voitures dès que le script est chargé
loadCars();

formulaireCovoiturage.addEventListener("submit", function(event) {
    event.preventDefault(); // Empêcher l'envoi du formulaire par défaut
    ProposerTrajet();
});

function ProposerTrajet() {
    let dataForm = new FormData(formulaireCovoiturage);

    let dateDepart = dataForm.get("date_depart");
    let dateArrivee = dataForm.get("date_arrivee");
    let lieuDepart = dataForm.get("lieu_depart");
    let lieuArrivee = dataForm.get("lieu_arrivee");
    let placesDisponibles = dataForm.get("places_disponibles");
    let prixPersonne = dataForm.get("prix_personne");
    let voiture = dataForm.get("voiture");
    let pseudoConducteur = dataForm.get("pseudo_conducteur");
    let emailConducteur = dataForm.get("email_conducteur");

    // Création des en-têtes et de la requête
    let token = getToken();
    if (!token) {
        console.error('Le jeton d\'authentification est manquant.');
        return;
    }

    let myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", token);
    myHeaders.append("Accept", "application/json");

    let raw = JSON.stringify({
        "date_depart": dateDepart,
        "date_arrivee": dateArrivee,
        "lieu_depart": lieuDepart,
        "lieu_arrivee": lieuArrivee,
        "nb_places": placesDisponibles,
        "prix_personne": prixPersonne,
        "voiture_id": voiture,
        "conducteur_id": getId(),
        "pseudo_conducteur": pseudoConducteur,
        "email_conducteur": emailConducteur
    });

    let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    // Envoi de la requête
    fetch(apiUrl + "/covoiturage/add", requestOptions)
    .then(response => {
        if (response.ok) {
            alert("Félicitations, vous avez proposé un nouveau trajet.");
            return response.json();
        } else {
            alert("Erreur lors de la proposition du trajet");
        }
    })
    .then(result => {
        document.location.reload();
    })
    .catch(error => {
        alert('Erreur');
    });
}
