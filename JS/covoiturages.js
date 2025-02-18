const inputDureeMax = document.getElementById("Duree");
const inputPrixMax = document.getElementById("Prix");
const inputNoteMin = document.getElementById("Note");
const buttonFiltrer = document.getElementById("Filtre");

inputDureeMax.addEventListener("input", validateDureeMax);
inputPrixMax.addEventListener("input", validatePrixMax);
inputNoteMin.addEventListener("input", validateNoteMin);

// Fonction pour valider la durée max
function validateDureeMax() {
    const isValid = validateDureePrix(inputDureeMax);
}

// Fonction pour valider le prix max
function validatePrixMax() {
    const isValid = validateDureePrix(inputPrixMax);
}

// Fonction pour valider la note minimal
function validateNoteMin() {
    const isValid = validateNote(inputNoteMin);
}


// Fonction pour valider la durée
function validateDureePrix(input) {
    const DureeRegex = /^[1-9]\d*$/;
    const DureeUser = input.value.trim();  // .trim() pour éliminer les espaces superflus avant et après


    if (DureeUser === "") {
        input.classList.remove("is-invalid");
        input.classList.remove("is-valid");
        return false;  
    }

    if (DureeUser.match(DureeRegex)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;  
    }
}

// Fonction pour valider la note
function validateNote(input) {
    const NoteRegex = /^[1-5]$/;
    const NoteUser = input.value.trim();

    // Si la date est vide, ne pas afficher de message d'erreur
    if (NoteUser === "") {
        input.classList.remove("is-invalid");
        input.classList.remove("is-valid");
        return false;  // L'utilisateur n'a pas encore rempli ce champ
    }

    if (NoteUser.match(NoteRegex)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;  
    }
}