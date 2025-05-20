import { apiUrl, getId, getToken, sanitizeHtml } from "./index.js";

const inputDateDepart = document.getElementById("date_depart");
const inputDateArrivee = document.getElementById("date_arrivee");
const inputLieuDepart = document.getElementById("lieu_depart");
const inputLieuArrivee = document.getElementById("lieu_arrivee");
const inputPlacesDisponibles = document.getElementById("places_disponibles");
const inputPrixPersonne = document.getElementById("prix_personne");
const inputVoiture = document.getElementById("voiture");
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

function validateLieuDepart() {
    const resultsContainer = document.getElementById("autocomplete-results-1");
    const LieuDepartRegex = /^[A-Z][a-z]*([ -']?[a-z]+)*$/;
    let query = inputLieuDepart.value.trim();

    if (query.length >= 2) { 
        fetch(`https://geo.api.gouv.fr/communes?nom=${query}&fields=nom,code&boost=population&limit=5`)
            .then(response => response.json())
            .then(data => {
                displayResults(data, resultsContainer, inputLieuDepart);
            })
            .catch(error => console.error("Erreur API:", error));
    } else {
        resultsContainer.innerHTML = "";
    }

    if (query === "" || !LieuDepartRegex.test(query)) {
        inputLieuDepart.classList.remove("is-valid");
        inputLieuDepart.classList.add("is-invalid");
    } else {
        inputLieuDepart.classList.add("is-valid");
        inputLieuDepart.classList.remove("is-invalid");
    }

    toggleSubmitButton();
}

function validateLieuArrivee() {
    const resultsContainer = document.getElementById("autocomplete-results-2");
    const LieuArriveeRegex = /^[A-Z][a-z]*([ -']?[a-z]+)*$/;
    let query = inputLieuArrivee.value.trim();

    if (query.length >= 2) { 
        fetch(`https://geo.api.gouv.fr/communes?nom=${query}&fields=nom,code&boost=population&limit=5`)
            .then(response => response.json())
            .then(data => {
                displayResults(data, resultsContainer, inputLieuArrivee);
            })
            .catch(error => console.error("Erreur API:", error));
    } else {
        resultsContainer.innerHTML = "";
    } 

    if (query === "" || !LieuArriveeRegex.test(inputLieuArrivee.value.trim())) {
        inputLieuArrivee.classList.remove("is-valid");
        inputLieuArrivee.classList.add("is-invalid");
    } else {
        inputLieuArrivee.classList.add("is-valid");
        inputLieuArrivee.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

function displayResults(villes, resultsContainer, inputField) {
    resultsContainer.innerHTML = ""; 

    villes.forEach(ville => {
        let li = document.createElement("li");
        li.textContent = `${ville.nom}`;
        li.classList.add("autocomplete-item");
        li.addEventListener("click", () => {
            inputField.value = ville.nom;
            resultsContainer.innerHTML = ""; 
            inputField.classList.add("is-valid");
            inputField.classList.remove("is-invalid");
        });
        resultsContainer.appendChild(li);
    });
}

// Validation du nombre de places disponibles
function validatePlacesDisponibles() {
    if (inputPlacesDisponibles.value.trim() === "" || inputPlacesDisponibles.value <= 0 || inputPlacesDisponibles.value > 7) {
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

// Fonction pour activer/désactiver le bouton de soumission
function toggleSubmitButton() {
    const isDateDepartValid = inputDateDepart.classList.contains("is-valid");
    const isDateArriveeValid = inputDateArrivee.classList.contains("is-valid");
    const isLieuDepartValid = inputLieuDepart.classList.contains("is-valid");
    const isLieuArriveeValid = inputLieuArrivee.classList.contains("is-valid");
    const isPlacesDisponiblesValid = inputPlacesDisponibles.classList.contains("is-valid");
    const isPrixPersonneValid = inputPrixPersonne.classList.contains("is-valid");
    const isVoitureValid = inputVoiture.classList.contains("is-valid");

    // Si tous les champs sont valides, on active le bouton
    if (isDateDepartValid && isDateArriveeValid && isLieuDepartValid && isLieuArriveeValid && isPlacesDisponiblesValid && isPrixPersonneValid) {
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
        credentials: 'include',
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
    const id = getId();
    const response = fetch(`${apiUrl}/api/utilisateurs/details/${id}`, {
        method: "GET",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json", 
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des détails de l'utilisateur : ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        let email = data.email;
        let pseudo = data.pseudo;

        let dataForm = new FormData(formulaireCovoiturage);
        let dateDepart = sanitizeHtml(dataForm.get("date_depart"));
        let dateArrivee = sanitizeHtml(dataForm.get("date_arrivee"));
        let lieuDepart = sanitizeHtml(dataForm.get("lieu_depart"));
        let lieuArrivee = sanitizeHtml(dataForm.get("lieu_arrivee"));
        let placesDisponibles = sanitizeHtml(dataForm.get("places_disponibles"));
        let prixPersonne = sanitizeHtml(dataForm.get("prix_personne"));
        let voiture = dataForm.get("voiture");
        let pseudoConducteur = pseudo;
        let emailConducteur = email;

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
            credentials: 'include',
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        // Envoi de la requête
        fetch(apiUrl + "/covoiturage/add", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json().then(result => {
                Swal.fire({
                    text: "Félicitations, vous avez proposé un nouveau trajet.",
                    icon: "success",
                    position: "center",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: false
                }).then (() => {
                    window.location.href= `/conducteur`;
                });
            });
            } else {
                Swal.fire({
                    text: "Erreur lors de la proposition du trajet.",
                    icon: "error",
                    position: "center",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: false
                })
            }
        })
        .catch(error => {
            Swal.fire({
                    text: "Erreur lors de la proposition du trajet.",
                    icon: "error",
                    position: "center",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: false
                })
        });
        })
    .catch(error => {
        console.error("Une erreur est survenue :", error.message);
    });
}
