const inputDureeMax = document.getElementById("Duree");
const inputPrixMax = document.getElementById("Prix");
const inputNoteMin = document.getElementById("Note");
const selectEnergie = document.getElementById("Energie");
const buttonFiltrer = document.getElementById("Filtre");

inputDureeMax.addEventListener("input", validateDureePrix);
inputPrixMax.addEventListener("input", validateDureePrix);
inputNoteMin.addEventListener("input", validateNoteMin);
buttonFiltrer.addEventListener("click", filtrerCovoiturages);
selectEnergie.addEventListener("change", filtrerCovoiturages);

// Fonction pour valider la durée et le prix
function validateDureePrix(event) {
    const input = event.target;
    const regex = /^[1-9]\d*$/; // Un nombre entier positif

    if (input.value.trim() === "") {
        input.classList.remove("is-invalid", "is-valid");
        return false;
    }

    if (regex.test(input.value.trim())) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

// Fonction pour valider la note minimale (0 à 5)
function validateNoteMin(event) {
    const input = event.target;
    const regex = /^[0-5](\.\d{1})?$/; // Nombre entre 0 et 5 avec une décimale facultative

    if (input.value.trim() === "") {
        input.classList.remove("is-invalid", "is-valid");
        return false;
    }

    if (regex.test(input.value.trim())) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function filtrerCovoiturages() {
    const dureeMax = parseInt(inputDureeMax.value.trim()) || null;
    const prixMax = parseFloat(inputPrixMax.value.trim()) || null;
    const noteMin = parseFloat(inputNoteMin.value.trim()) || null;
    const energieSelectionnee = selectEnergie.value; // Récupération de la valeur sélectionnée

    const covoiturages = document.querySelectorAll('.covoiturages .row .col');

    covoiturages.forEach((covoiturage) => {
        const dureeTrajet = parseInt(covoiturage.querySelector("p:nth-child(6)").textContent.match(/\d+/)) || 0;
        const prix = parseFloat(covoiturage.querySelector("p:nth-child(3)").textContent.match(/\d+(\.\d+)?/)) || 0;
        const noteMoyenne = parseFloat(covoiturage.querySelector("p:nth-child(2) span").textContent) || 0;
        const energie = covoiturage.querySelector("p:nth-child(5)").textContent.split(":")[1].trim(); // Extraction de l'énergie

        let afficher = true;

        if (dureeMax !== null && dureeTrajet > dureeMax) afficher = false;
        if (prixMax !== null && prix > prixMax) afficher = false;
        if (noteMin !== null && noteMoyenne < noteMin) afficher = false;

        if (energieSelectionnee === "ecologique" && energie.toLowerCase() !== "énergie") afficher = false;
        if (energieSelectionnee === "non_ecologique" && !["diesel", "essence"].includes(energie.toLowerCase())) afficher = false;

        covoiturage.style.display = afficher ? "block" : "none";
    });
}


buttonFiltrer.addEventListener("click", function(event) {
    event.preventDefault(); 
    filtrerCovoiturages();
});










