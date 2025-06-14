import {apiUrl, sanitizeHtml} from "./index.js";


let selectedRole = null;
const formInscription = document.getElementById("inscriptionForm");
const fumeurCheckbox = document.getElementById("fumeur");
const animauxCheckbox = document.getElementById("animaux");

function setupInscriptionPage() {
    const roleButtons = document.querySelectorAll("#roleSelection button");
    const conducteurFields = document.getElementById("conducteurFields");
    const inputPhoto = document.getElementById("Photo");

    roleButtons.forEach(button => {
        button.addEventListener("click", function () {
            roleButtons.forEach(btn => btn.classList.remove("btn-success", "text-white"));
            this.classList.add("btn-success", "text-white");

            if (this.getAttribute("data-role") === "conducteur") {
                conducteurFields.classList.remove("d-none");
                inputPhoto.setAttribute("required", true); // Photo obligatoire pour Conducteur
                selectedRole = [3]; // Rôle conducteur
            } else if (this.getAttribute("data-role") === "les_deux") {
                conducteurFields.classList.remove("d-none");
                inputPhoto.setAttribute("required", true); // Photo obligatoire pour Conducteur ou les deux
                selectedRole = [3, 4]; // Rôle conducteur + passager (les deux)
            } else {
                conducteurFields.classList.add("d-none");
                inputPhoto.removeAttribute("required"); // Désactive la photo pour Passager
                selectedRole = [4]; // Rôle passager
            }            
        });
    });
}

// Attendre que le contenu soit injecté avant d’exécuter le script
const checkPageLoaded = setInterval(() => {
    if (document.getElementById("roleSelection")) {
        clearInterval(checkPageLoaded);
        setupInscriptionPage();
    }
}, 100);

const inputNom = document.getElementById("Nom");
const inputPrenom = document.getElementById("Prenom");
const inputEmail = document.getElementById("Email");
const inputMdp = document.getElementById("Mdp");
const inputMdpConfirm = document.getElementById("MdpConfirm");
const inputTelephone = document.getElementById("Telephone");
const inputPseudo = document.getElementById("Pseudo");
const inputAdresse = document.getElementById("Adresse");
const inputNaissance = document.getElementById("Naissance");
const inputPhoto = document.getElementById("Photo");
const buttonInscription = document.getElementById("inscription");
const inputRoleSelection = document.querySelectorAll("#roleSelection button");

// Ajout des événements de validation
inputNom.addEventListener("input", validateNom);
inputPrenom.addEventListener("input", validatePrenom);
inputEmail.addEventListener("input", validateEmail);
inputMdp.addEventListener("input", validateMotDePasse);
inputMdpConfirm.addEventListener("input", validateMdpConfirm);
inputTelephone.addEventListener("input", validateTelephone);
inputPseudo.addEventListener("input", validatePseudo);
inputAdresse.addEventListener("input", validateAdresse);
inputNaissance.addEventListener("input", validateNaissance);
inputPhoto.addEventListener("input", validatePhoto);

// Ajout de l'événement pour la sélection de rôle
inputRoleSelection.forEach(button => {
    button.addEventListener("click", selectRole);
});

// Ajout de l'événement pour la soumission du formulaire
buttonInscription.addEventListener("click", function(event) {
    event.preventDefault(); // Empêcher l'envoi du formulaire par défaut
    InscrireUtilisateur();
});

function validateNom() {
    const isValid = inputNom.value.trim() !== "";
    toggleInputValidation(inputNom, isValid);
}

function validatePrenom() {
    const isValid = inputPrenom.value.trim() !== "";
    toggleInputValidation(inputPrenom, isValid);
}

function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    fetch(apiUrl + "/api/utilisateurs/liste", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json()) 
    .then(users => {
        const inputValue = inputEmail.value.trim();
        const emailExists = users.some(user => user.email === inputValue);

        const isValid = emailRegex.test(inputEmail.value.trim()) && !emailExists;
        toggleInputValidation(inputEmail, isValid);
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
    });
}

function validateMotDePasse() {
    const mdpRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const isValid = mdpRegex.test(inputMdp.value.trim());
    toggleInputValidation(inputMdp, isValid);
}

function validateMdpConfirm() {
    const isValid = inputMdp.value === inputMdpConfirm.value;
    toggleInputValidation(inputMdpConfirm, isValid);
}

function validateTelephone() {
    const telRegex = /^[0-9]{10}$/;
    const isValid = telRegex.test(inputTelephone.value.trim());
    toggleInputValidation(inputTelephone, isValid);
}

function validatePseudo() {
    fetch(apiUrl + "/api/utilisateurs/liste", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())  // Convertit la réponse en JSON
    .then(users => {
        const inputValue = inputPseudo.value.trim();
        const pseudoExists = users.some(user => user.pseudo === inputValue);

        const isValid = inputValue !== "" && !pseudoExists;
        toggleInputValidation(inputPseudo, isValid);
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
    });
}

function validateAdresse() {
    const isValid = inputAdresse.value.trim() !== "";
    toggleInputValidation(inputAdresse, isValid);
}

function validateNaissance() {
    const userDate = new Date(inputNaissance.value.trim());
    const currentDate = new Date();
    userDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0); 
    
    // Calcule la date d'anniversaire des 18 ans
    const date18 = new Date(userDate);
    date18.setFullYear(userDate.getFullYear() + 18);
    
    const isValid = currentDate >= date18;
    toggleInputValidation(inputNaissance, isValid);
}


function validatePhoto() {
    const photoURL = inputPhoto.value.trim(); 
    let isValid = false;

    if (photoURL) {
        const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/i;
        isValid = urlRegex.test(photoURL);
    }

    toggleInputValidation(inputPhoto, isValid);  
}

function toggleInputValidation(input, isValid) {
    if (isValid) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
    } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
    }
    toggleSubmitButton();
}

function toggleSubmitButton() {
    const isNomValid = inputNom.classList.contains("is-valid");
    const isPrenomValid = inputPrenom.classList.contains("is-valid");
    const isEmailValid = inputEmail.classList.contains("is-valid");
    const isMdpValid = inputMdp.classList.contains("is-valid");
    const isMdpConfirmValid = inputMdpConfirm.classList.contains("is-valid");
    const isTelephoneValid = inputTelephone.classList.contains("is-valid");
    const isPseudoValid = inputPseudo.classList.contains("is-valid");
    const isAdresseValid = inputAdresse.classList.contains("is-valid");
    const isNaissanceValid = inputNaissance.classList.contains("is-valid");
    const isPhotoValid = inputPhoto.classList.contains("is-valid");

    if (
        isNomValid && 
        isPrenomValid && 
        isEmailValid && 
        isMdpValid && 
        isMdpConfirmValid && 
        isTelephoneValid && 
        isPseudoValid && 
        isAdresseValid && 
        isNaissanceValid &&
        (inputPhoto.hasAttribute("required") ? isPhotoValid : true) 
    ) {
        buttonInscription.disabled = false;
    } else {
        buttonInscription.disabled = true;
    }
}

function selectRole(event) {
    const roleButtons = document.querySelectorAll("#roleSelection button");
    roleButtons.forEach(button => button.classList.remove("btn-success"));
    event.target.classList.add("btn-success");
}

function InscrireUtilisateur() {
    console.log("Formulaire d'inscription : ", formInscription);
    let dataForm = new FormData(formInscription);
    
    // Récupération des données via FormData
    let name = sanitizeHtml(dataForm.get("Nom")); 
    let prenom = sanitizeHtml(dataForm.get("Prenom")); 
    let email = sanitizeHtml(dataForm.get("Email")); 
    let mdp = dataForm.get("Mdp"); // Mot de passe n'a pas besoin d'être assaini
    let telephone = sanitizeHtml(dataForm.get("Telephone")); 
    let adresse = sanitizeHtml(dataForm.get("Adresse")); 
    let dateNaissance = dataForm.get("Naissance");
    let pseudo = sanitizeHtml(dataForm.get("Pseudo")); 
    let photo = inputPhoto.value.trim(); 
    let fumeur = fumeurCheckbox.checked ? true : false;
    let animal = animauxCheckbox.checked ? true : false;
    let preferencesPerso = sanitizeHtml(dataForm.get("preferences")); 

    // Vérifie l'URL de la photo si le rôle sélectionné nécessite une photo
    if ((selectedRole.includes(3)) && !photo) {
        Swal.fire({
            text: "Veuillez entrer une URL de photo de profil.",
            icon: "warning",
            position: "center",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: false
        })
    }

    // Création des en-têtes et de la requête
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "nom": name,
        "prenom": prenom,
        "email": email,
        "mdp": mdp,  
        "telephone": telephone,
        "adresse": adresse,
        "date_naissance": dateNaissance,
        "pseudo": pseudo,
        "photo": photo, 
        "roles": selectedRole,
        "fumeur": fumeur,
        "animal": animal,
        "preference": preferencesPerso
    });

    let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        credentials: 'include',
        redirect: "follow"
    };

    // Envoi de la requête
    fetch(apiUrl + "/api/utilisateurs/ajouter", requestOptions)
    .then(response => {
        if (response.ok) {
            return response.json().then(result => {
                Swal.fire({
                    text: "Félicitations " + prenom + " , vous êtes maintenant inscrit et vous pouvez vous connecter.",
                    icon: "success",
                    position: "center",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: false
                }).then(() => {                   
                    document.location.href = "/connexion";
                });
            });
        } else {
            Swal.fire({
                text: "Erreur lors de l'inscription.",
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
            text: "L'inscription a échouée.",
            icon: "error",
            position: "center",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false
        });
    });
}









