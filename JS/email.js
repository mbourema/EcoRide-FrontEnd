import { apiUrl} from "./index.js";

const inputEmailReinitialiser = document.getElementById("EmailReinitialiser");
const buttonReinitialiser = document.getElementById("reinitialiser");
const formulaireReinitialisation = document.getElementById("emailForm");

inputEmailReinitialiser.addEventListener("input", validateEmail);

function validateEmail() {
    const isValid = validateEmailRegex(inputEmailReinitialiser);
    toggleSubmitButton(); 
}

function toggleSubmitButton() {
    const isEmailValid = inputEmailReinitialiser.classList.contains("is-valid");

    if (isEmailValid) {
        buttonReinitialiser.disabled = false;
    } else {
        buttonReinitialiser.disabled = true;
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

buttonReinitialiser.addEventListener("click", function(event) {
    event.preventDefault();
    sendmail();
});

function sendmail(){
    let dataForm = new FormData(formulaireReinitialisation);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
        "email": dataForm.get("EmailReinitialiser"),
    });
    let requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(apiUrl + "/api/utilisateurs/reinistialiser-mot-de-passe", requestOptions)
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    text: "Lien de réinitialisation envoyé",
                    icon: "success",
                    position: "center",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: false
                }).then(()=> {location.reload();});
            } else if (response.status === 404) {
                inputEmailReinitialiser.classList.add("is-invalid");   
                inputEmailReinitialiser.addEventListener("input", function() {
                if (inputEmailReinitialiser.value !== "") {
                    inputEmailReinitialiser.classList.remove("is-invalid");
                }
                });
                Swal.fire({
                    text: "Email non retrouvé",
                    icon: "error",
                    position: "center",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: false
                })
            }        
        })
        .catch(error => console.log('error', error));
}