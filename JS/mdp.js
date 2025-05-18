import { apiUrl} from "./index.js";

const inputMDPReinitialiser = document.getElementById("MDPreinitialiser");
const inputMDPReinitialiserConfirm = document.getElementById("MDPreinitialiserConfirm");
const buttonReinitialiserMDP = document.getElementById("changerMDP");
const formulaireReinitialisationMDP = document.getElementById("MDPForm");

inputMDPReinitialiser.addEventListener("input", validateMotDePasseReinitialiser);
inputMDPReinitialiserConfirm.addEventListener("input", validateMdpConfirmReinitialiser);

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

function validateMotDePasseReinitialiser() {
    const mdpRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const isValid = mdpRegex.test(inputMDPReinitialiser.value.trim());
    toggleInputValidation(inputMDPReinitialiser, isValid);
}

function validateMdpConfirmReinitialiser() {
    const isValid = inputMDPReinitialiser.value === inputMDPReinitialiserConfirm.value;
    toggleInputValidation(inputMDPReinitialiserConfirm, isValid);
}

function toggleSubmitButton() {
    const isMdpValid = inputMDPReinitialiser.classList.contains("is-valid");
    const isMdpConfirmValid = inputMDPReinitialiserConfirm.classList.contains("is-valid");

    if (isMdpValid && isMdpConfirmValid) {
        buttonReinitialiserMDP.disabled = false;
    } else {
        buttonReinitialiserMDP.disabled = true;
    }
}

buttonReinitialiserMDP.addEventListener("click", function(event) {
    event.preventDefault();
    changeMDP();
});


function changeMDP(){
    let dataForm = new FormData(formulaireReinitialisationMDP);
    let token = window.location.search.substring(1);
    let raw = JSON.stringify({
        "mdp": dataForm.get("MDPreinitialiser"),
    });
    let requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: raw,
        redirect: 'follow'
    };
    fetch(apiUrl + `/api/utilisateurs/reset-password/${token}`, requestOptions)
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    text: "Votre mot de passe a été modifié !",
                    icon: "success",
                    position: "center",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: false
                }).then(()=> {document.location.href = "/connexion";});
            } else if (response.status === 400) {
                Swal.fire({
                    text: "Lien de réinitialisation expiré !",
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

