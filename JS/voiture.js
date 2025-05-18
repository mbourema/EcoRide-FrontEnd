import {apiUrl, getId, sanitizeHtml} from "./index.js";

const inputMarque = document.getElementById("marque");
const inputModele = document.getElementById("modele");
const inputImmatriculation = document.getElementById("immatriculation");
const inputEnergie = document.getElementById("energie");
const inputCouleur = document.getElementById("couleur");
const inputDateImmatriculation = document.getElementById("date_immatriculation");
const inputPlaces = document.getElementById("places");
const buttonAjouterVoiture = document.querySelector("button[type='submit']");
const formulaireVoiture = document.getElementById("voitureForm");

// Ajout des événements pour la validation des champs
inputMarque.addEventListener("input", validateMarque);
inputModele.addEventListener("input", validateModele);
inputImmatriculation.addEventListener("input", validateImmatriculation);
inputEnergie.addEventListener("input", validateEnergie);
inputCouleur.addEventListener("input", validateCouleur);
inputDateImmatriculation.addEventListener("input", validateDateImmatriculation);
inputPlaces.addEventListener("input", validatePlaces);

// Validation de la marque
function validateMarque() {
    if (inputMarque.value.trim() === "") {
        inputMarque.classList.remove("is-valid");
        inputMarque.classList.add("is-invalid");
    } else {
        inputMarque.classList.add("is-valid");
        inputMarque.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

// Validation du modèle
function validateModele() {
    if (inputModele.value.trim() === "") {
        inputModele.classList.remove("is-valid");
        inputModele.classList.add("is-invalid");
    } else {
        inputModele.classList.add("is-valid");
        inputModele.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

// Validation de l'immatriculation
function validateImmatriculation() {
    const immatriculationRegex = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/; // Exemple de format: AB-123-CD
    if (inputImmatriculation.value.trim() === "") {
        inputImmatriculation.classList.remove("is-valid");
        inputImmatriculation.classList.add("is-invalid");
    } else if (inputImmatriculation.value.match(immatriculationRegex)) {
        inputImmatriculation.classList.add("is-valid");
        inputImmatriculation.classList.remove("is-invalid");
    } else {
        inputImmatriculation.classList.remove("is-valid");
        inputImmatriculation.classList.add("is-invalid");
    }
    toggleSubmitButton();
}

// Validation de l'énergie
function validateEnergie() {
    if (inputEnergie.value.trim() === "") {
        inputEnergie.classList.remove("is-valid");
        inputEnergie.classList.add("is-invalid");
    } else {
        inputEnergie.classList.add("is-valid");
        inputEnergie.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

// Validation de la couleur
function validateCouleur() {
    if (inputCouleur.value.trim() === "") {
        inputCouleur.classList.remove("is-valid");
        inputCouleur.classList.add("is-invalid");
    } else {
        inputCouleur.classList.add("is-valid");
        inputCouleur.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

// Validation de la date de première immatriculation
function validateDateImmatriculation() {
    if (inputDateImmatriculation.value.trim() === "") {
        inputDateImmatriculation.classList.remove("is-valid");
        inputDateImmatriculation.classList.add("is-invalid");
    } else {
        inputDateImmatriculation.classList.add("is-valid");
        inputDateImmatriculation.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

// Validation du nombre de places
function validatePlaces() {
    if (inputPlaces.value.trim() === "" || inputPlaces.value <= 0 || inputPlaces.value > 7) {
        inputPlaces.classList.remove("is-valid");
        inputPlaces.classList.add("is-invalid");
    } else {
        inputPlaces.classList.add("is-valid");
        inputPlaces.classList.remove("is-invalid");
    }
    toggleSubmitButton();
}

// Fonction pour activer/désactiver le bouton de soumission
function toggleSubmitButton() {
    const isMarqueValid = inputMarque.classList.contains("is-valid");
    const isModeleValid = inputModele.classList.contains("is-valid");
    const isImmatriculationValid = inputImmatriculation.classList.contains("is-valid");
    const isEnergieValid = inputEnergie.classList.contains("is-valid");
    const isCouleurValid = inputCouleur.classList.contains("is-valid");
    const isDateImmatriculationValid = inputDateImmatriculation.classList.contains("is-valid");
    const isPlacesValid = inputPlaces.classList.contains("is-valid");

    if (isMarqueValid && isModeleValid && isImmatriculationValid && isEnergieValid && isCouleurValid && isDateImmatriculationValid && isPlacesValid) {
        buttonAjouterVoiture.disabled = false;
    } else {
        buttonAjouterVoiture.disabled = true;
    }
}

// Gestion de l'envoi du formulaire
formulaireVoiture.addEventListener("submit", function(event) {
    event.preventDefault(); 
    AjouterVoiture();
});

function AjouterVoiture() {
    let dataForm = new FormData(formulaireVoiture);
    
    // Récupération des données via FormData
    let marque = dataForm.get("marque");
    let modele = dataForm.get("modele");
    let immatriculation = dataForm.get("immatriculation");
    let energie = dataForm.get("energie");
    let couleur = dataForm.get("couleur");
    let date_immatriculation = dataForm.get("date_immatriculation");
    let nb_place = dataForm.get("places");


    if (marque === "Alfa Romeo"){
        marque = 1;
    } 
    else if (marque === "Audi"){
        marque = 2;
    }
    else if (marque === "BMW"){
        marque = 3;
    }
    else if (marque === "Dacia"){
        marque = 4;
    }
    else if (marque === "Fiat"){
        marque = 5;
    }
    else if (marque === "Peugeot"){
        marque = 6;
    }
    else if (marque === "Renault"){
        marque = 7;
    }
    else if (marque === "Volkswagen"){
        marque = 8;
    }
    else if (marque === "Mercedes"){
        marque = 9;
    }
    else if (marque === "Ford"){
        marque = 10;
    }
    else if (marque === "Nissan"){
        marque = 11;
    }
    else if (marque === "Opel"){
        marque = 12;
    }
    else if (marque === "Volvo"){
        marque = 13;
    }

    if (energie == "Diesel"){
        energie = "Diesel";
    }
    else if (energie === "Essence"){
        energie = "Essence";
    }
    else if (energie === "Electrique"){
        energie = "Electrique";
    }
    
    let myHeaders = new Headers();
    myHeaders.append("Accept", "application/json"); 

    let raw = JSON.stringify({
        "utilisateur_id": getId(),
        "marque_id": marque,
        "modele": sanitizeHtml(modele),
        "immatriculation": sanitizeHtml(immatriculation),  
        "energie": sanitizeHtml(energie),
        "couleur": sanitizeHtml(couleur),
        "date_premiere_immatriculation": sanitizeHtml(date_immatriculation),
        "nb_places": sanitizeHtml(nb_place)
    });


    let requestOptions = {
        method: "POST",
        credentials: "include",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    // Envoi de la requête
    fetch(apiUrl + "/api/voitures/ajouter", requestOptions)
    .then(response => {
        if (response.ok) {
            return response.json().then(result => {
                Swal.fire({
                    text: "Félicitations, vous avez entré une nouvelle voiture.",
                    icon: "success",
                    position: "center",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: false
                }).then(() => {
                    window.location.href= `/conducteur`;
                });
            });
        } else {
            Swal.fire({
                text: "Erreur lors de l'ajout de la voiture",
                icon: "error",
                position: "center",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: false
            })
        }
    })
    .catch(error => {
        Swal.fire({
            text: "Erreur lors de l'ajout de la voiture",
            icon: "error",
            position: "center",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false
        })
    });
}
