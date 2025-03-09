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