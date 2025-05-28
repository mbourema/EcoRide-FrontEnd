import { effectuerPaiement, afficherTousLesPaiements } from './passager.js';

const apiUrl = "https://obscure-stream-41149-67f60faa3f9f.herokuapp.com";

// Fonction pour récupérer les paramètres de l'URL
function getDetailParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        conducteurId: urlParams.get('conducteur_id'),
        voitureId: urlParams.get('voiture_id'),
        pseudo: urlParams.get('pseudo'),
        covoiturageId: urlParams.get('covoiturage_id')
    };
}

// Fonction pour vérifier si les paramètres sont valides
function areDetailsValid(params) {
    return params.conducteurId && params.voitureId && params.pseudo && params.covoiturageId;
}

// Fonction pour récupérer les informations du conducteur
async function getConducteurDetails(conducteurId) {
    const urlConducteur = `${apiUrl}/api/utilisateurs/details/${conducteurId}`;
    try {
        const response = await fetch(urlConducteur, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des informations du conducteur: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des infos du conducteur :", error);
        return null;
    }
}

// Fonction pour récupérer les informations du véhicule
async function getVoitureDetails(voitureId) {
    const urlVoiture = `${apiUrl}/api/voitures/details/${voitureId}`;
    try {
        const response = await fetch(urlVoiture, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des informations du véhicule: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des infos du véhicule :", error);
        return null;
    }
}

// Fonction pour récupérer la marque du véhicule
async function getMarqueDetails(voitureId) {
    const detailVoiture = await getVoitureDetails(voitureId);
    const marqueId = detailVoiture.marque.id;
    const urlMarque = `${apiUrl}/marque/${marqueId}`;
    try {
        const response = await fetch(urlMarque, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des informations de la marque: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération de la marque :", error);
        return null;
    }
}

// Fonction pour récupérer les avis du conducteur
async function getAvisConducteur(pseudo) {
    const urlAvis = `${apiUrl}/avis/fulllist/conducteur/${pseudo}`;
    try {
        const response = await fetch(urlAvis, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        });
        if (response.status === 404) {
            return null;  // Aucun avis trouvé
        }
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des avis: ${response.status}`);
        }
        const allAvis = await response.json();
        const avis = allAvis.filter(avis => avis.avancement === "OK");
        return avis;
    } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
        return null;
    }
}

// Fonction d'affichage des détails du voyage
async function afficherDetails() {
    const params = getDetailParams();

    // Si les paramètres sont valides, on affiche les détails du covoiturage
    if (areDetailsValid(params)) {
        const { conducteurId, voitureId, pseudo, covoiturageId } = params;

        const conducteurDetails = await getConducteurDetails(conducteurId);
        const voitureDetails = await getVoitureDetails(voitureId);
        const avisConducteur = await getAvisConducteur(pseudo);
        const marqueDetails = await getMarqueDetails(voitureId);

        const infoContainer = document.getElementById("info_voyage");
        infoContainer.innerHTML = "";

        const card = document.createElement('div');
        card.classList.add('col');
        card.innerHTML = `
            <div class="card p-3 d-flex flex-row align-items-center rounded-3 bg-ecogreen shadow-sm mb-3">
                <div class="voyage-info flex-grow-1">
                    <p><strong>Marque :</strong> <span>${marqueDetails.libelle}</span></p>
                    <p><strong>Modele :</strong> ${voitureDetails.modele} </p>
                    <p><strong>Type véhicule :</strong> ${voitureDetails.energie}</p>
                    <p><strong>Préférences :</strong> ${conducteurDetails.preference}</p>
                </div>
                <div class="text-center">
                    <img src="${conducteurDetails.photo}" class="rounded-circle" alt="Conducteur" style="width: 100%; max-width: 250px; height: 250px; object-fit: cover;">
                    <br>
                    <button id="participer-${covoiturageId}" class="btn btn-secondary mt-2">Participer</button>
                </div>
            </div>
        `;
        infoContainer.appendChild(card);

        const participerBtn = document.getElementById(`participer-${covoiturageId}`);
        if (participerBtn) {
            participerBtn.addEventListener("click", () => {
                const confirmationModal = new bootstrap.Modal(document.getElementById("confirmationModal"));
                confirmationModal.show();

                document.getElementById("confirmerParticipation").addEventListener("click", function () {
                    confirmationModal.hide();
                    effectuerPaiement(covoiturageId);
                });
            });
        }

        const avisContainer = document.getElementById("avisList");
        avisContainer.innerHTML = "";

        const titreAvis = document.createElement("h2");
        titreAvis.classList.add("text-center", "mb-3");
        titreAvis.textContent = "Avis pour ce conducteur";
        avisContainer.appendChild(titreAvis);

        if (avisConducteur && avisConducteur.length > 0) {
            avisConducteur.forEach(avis => {
                const avisCard = document.createElement("div");
                avisCard.classList.add("col");
                avisCard.innerHTML = `
                    <div class="card p-3 d-flex flex-row align-items-center rounded-3 bg-ecogreen shadow-sm mb-3">
                        <div class="avis flex-grow-1">
                            <p><strong>ID :</strong> <span>${avis.id}</span></p>
                            <p><strong>Pseudo du passager :</strong> ${avis.pseudo_passager} </p>
                            <p><strong>Pseudo du conducteur :</strong> ${avis.pseudo_conducteur}</p>
                            <p><strong>Note :</strong> ${avis.note}</p>
                            <p><strong>Commentaire :</strong> ${avis.commentaire}</p> 
                        </div>
                    </div>
                `;
                avisContainer.appendChild(avisCard);
            });
        } else {
            avisContainer.innerHTML += `<p class="text-center text-danger">Aucun avis pour ce conducteur pour l'instant.</p>`;
        }
    } else {
        afficherTousLesPaiements();
    }
}


afficherDetails();








