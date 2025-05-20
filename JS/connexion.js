import { setCookie, tokenCookieName, roleCookieName, pseudoCookieName, nbCreditsCookieName, apiUrl, idConnected, sanitizeHtml, getRole } from "./index.js";

const inputEmail = document.getElementById("Email");
const inputMotDePasse = document.getElementById("Mdp");
const buttonConnection = document.getElementById("connexion");
const formulaireConnexion = document.getElementById("connexionForm");
const reinitialiser = document.getElementById("reinistialiser");

inputEmail.addEventListener("input", validateEmail);


function validateEmail() {
    const isValid = validateEmailRegex(inputEmail);
    toggleSubmitButton(); 
}

function toggleSubmitButton() {
    const isEmailValid = inputEmail.classList.contains("is-valid");

    if (isEmailValid) {
        buttonConnection.disabled = false;
    } else {
        buttonConnection.disabled = true;
    }
}


function validateEmailRegex(input) {
    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const EmailUser = input.value.trim();  

    if (EmailUser === "") {
        input.classList.remove("is-invalid");
        input.classList.remove("is-valid");
        return false; 
    }

    if (EmailUser.match(EmailRegex)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false; 
    }
}


buttonConnection.addEventListener("click", function(event) {
    event.preventDefault(); // Empêcher l'envoi du formulaire par défaut
    checkCredentials();
});

// Fonction pour gérer la connexion pour la page de connexion
function checkCredentials(){
    let dataForm = new FormData(formulaireConnexion);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
        "email": dataForm.get("Email"),
        "mdp": dataForm.get("Mdp")
    });
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        credentials: 'include',
        redirect: 'follow'
    };
    fetch(apiUrl + "/api/utilisateurs/connexion", requestOptions)
    .then(response => {
        if (response.ok) {
            return response.json().then(result => {
                Swal.fire({
                    text: "Connexion réussie !",
                    icon: "success",
                    position: "center",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: false
                }).then(() => {
                    setCookie(tokenCookieName, result.api_token, 7)
                    setCookie(roleCookieName, result.roles, 7);
                    setCookie(pseudoCookieName, result.pseudo, 7);
                    setCookie(nbCreditsCookieName, result.nbCredit, 7);
                    setCookie(idConnected, result.id, 7);                    
                    window.location.replace("/");
                });
            });
        } else if (response.status === 429) {
            Swal.fire({
                text: "Trop de tentatives ! Attendre avant de réessayer",
                icon: "warning",
                position: "center",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: false
            }).then(() => {
                location.reload();
            }); 
        } else {
            inputEmail.classList.add("is-invalid");
            inputMotDePasse.classList.add("is-invalid");
            reinitialiser.classList.remove("d-none");

            inputEmail.addEventListener("input", function() {
                if (inputEmail.value !== "") {
                    inputEmail.classList.remove("is-invalid");
                }
            });

            inputMotDePasse.addEventListener("input", function() {
                if (inputMotDePasse.value !== "") {
                    inputMotDePasse.classList.remove("is-invalid");
                }
            });
        }        
    })
    .catch(error => console.log('error', error));      
}

document.addEventListener("DOMContentLoaded", function() {
    reinitialiser.classList.add("d-none"); // S'assurer qu'elle est bien cachée au début
});

