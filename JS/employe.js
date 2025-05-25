import { apiUrl, getToken } from "./index.js";

// Fonction pour charger les voitures de l'utilisateur
function loadAvis() {
    const token = getToken();
    if (!token) {
        return;
    }

    fetch(apiUrl + "/paiements", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'X-AUTH-TOKEN': token,
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const userAvis = data.filter(paiement => paiement.avancement === "En cours");
        
        const avisTitle = document.querySelector('#AvisSection h2');
        const avisListContainer = document.getElementById('AvisList');

        avisListContainer.innerHTML = ''; // Vider la liste avant d'ajouter les nouveaux avis
        
        if (userAvis.length > 0) {
            avisTitle.style.display = 'block'; // Afficher le titre au moment du chargement des données
            
            userAvis.forEach(paiement => {
                const avisElement = document.createElement('div');
                avisElement.classList.add('col');
                avisElement.innerHTML = `
                    <div class="card p-3 d-flex flex-column align-items-start rounded-3 shadow-sm mb-3 bg-ecogreen_light">
                        <p><strong>ID du paiement : </strong>${paiement.paiement_id}</p>
                        <p><strong>Pseudo du passager : </strong>${paiement.pseudo_utilisateur}</p>
                        <p><strong>ID du covoiturage : </strong>${paiement.covoiturage_id}</p>
                        <p><strong>Pseudo du conducteur : </strong>${paiement.pseudo_conducteur_id}</p>
                        <p><strong>Montant : </strong>${paiement.montant}</p>
                        <p><strong>Date du paiement : </strong>${paiement.date_paiement}</p>
                    </div>
                `;
                avisListContainer.appendChild(avisElement);
            });
        }
    })
    .catch(error => console.error('Erreur lors de la récupération des paiements :', error));
}

document.addEventListener("DOMContentLoaded", () => {
    loadAvis();
});