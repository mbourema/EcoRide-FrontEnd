import { setCookie, roleCookieName, pseudoCookieName, nbCreditsCookieName, apiUrl, setToken, idConnected, sanitizeHtml } from "./index.js";

const inputEmail = document.getElementById("Email");
const inputMotDePasse = document.getElementById("Mdp");
const buttonConnection = document.getElementById("connexion");
const formulaireConnexion = document.getElementById("connexionForm");

inputEmail.addEventListener("input", validateEmail);
inputMotDePasse.addEventListener("input", validateMotDePasse);


function validateEmail() {
    const isValid = validateEmailRegex(inputEmail);
    toggleSubmitButton(); 
}


function validateMotDePasse() {
    const isValid = validateMotDePasseRegex(inputMotDePasse);
    toggleSubmitButton(); 
}


function toggleSubmitButton() {
    const isEmailValid = inputEmail.classList.contains("is-valid");
    const isMotDePasseValid = inputMotDePasse.classList.contains("is-valid");

    if (isEmailValid && isMotDePasseValid) {
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

function validateMotDePasseRegex(input) {
    const MDPRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const MDPUser = input.value.trim();  

    if (MDPUser === "") {
        input.classList.remove("is-invalid");
        input.classList.remove("is-valid");
        return false; 
    }

    if (MDPUser.match(MDPRegex)) {
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
        "email": sanitizeHtml(dataForm.get("Email")),
        "mdp": dataForm.get("Mdp")
    });
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(apiUrl + "/api/utilisateurs/connexion", requestOptions)
    .then(response => {
        if (response.ok) {
            alert("Connexion réussie !")
            return response.json();
        } 
        else if (response.status === 429) {
            alert("Trop de tentatives ! Veuillez réessayer plus tard.");
            location.reload(); 

        } 
        else {
            inputEmail.classList.add("is-invalid");
            inputMotDePasse.classList.add("is-invalid");
        
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
    .then(result => {
        const token = result.api_token;
        setToken(token);

        setCookie(roleCookieName, result.roles, 7);

        setCookie(pseudoCookieName, result.pseudo, 7);

        setCookie(nbCreditsCookieName, result.nbCredit, 7);

        setCookie(idConnected, result.id, 7);
        window.location.replace("/");
    })
    .catch(error => console.log('error', error));   
}

