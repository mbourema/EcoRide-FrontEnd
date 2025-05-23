import { apiUrl, getId, getToken } from "./index.js";

// Fonction pour charger les voitures de l'utilisateur
function loadCars() {
    const token = getToken();
    if (!token) {
        console.error('Le jeton d\'authentification est manquant.');
        return;
    }

    fetch(apiUrl + "/api/voitures/liste", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'X-AUTH-TOKEN': token,
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const userId = getId();
        const userCars = data.filter(car => car.utilisateur.id === Number(userId));
        
        const carsTitle = document.querySelector('#carsSection h2');
        const carsListContainer = document.getElementById('carsList');

        carsListContainer.innerHTML = ''; // Vider la liste avant d'ajouter les nouvelles voitures
        
        if (userCars.length > 0) {
            carsTitle.style.display = 'block'; // Afficher le titre au moment du chargement des données
            
            userCars.forEach(car => {
                const carElement = document.createElement('div');
                carElement.classList.add('col');
                carElement.innerHTML = `
                    <div class="card p-3 d-flex flex-column align-items-start rounded-3 shadow-sm mb-3 bg-ecogreen_light">
                        <p><strong>Marque : </strong>${car.marque.nom}</p>
                        <p><strong>Modèle : </strong>${car.modele}</p>
                        <p><strong>Plaque d'immatriculation : </strong>${car.immatriculation}</p>
                        <p><strong>Énergie : </strong>${car.energie}</p>
                        <p><strong>Couleur : </strong>${car.couleur}</p>
                        <p><strong>Date de première immatriculation : </strong>${car.date_premiere_immatriculation}</p>
                        <p><strong>Nombre de places : </strong>${car.nb_places}</p>
                    </div>
                `;
                carsListContainer.appendChild(carElement);
            });
        }
    })
    .catch(error => console.error('Erreur lors de la récupération des voitures :', error));
}


// Fonction pour charger les covoiturages de l'utilisateur
function loadCarpools() {
    const token = getToken();
    if (!token) {
        console.error('Le jeton d\'authentification est manquant.');
        return;
    }

    fetch(apiUrl + "/covoiturage/list", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'X-AUTH-TOKEN': token,
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const userId = getId();
        const userCarpools = data.filter(carpool => carpool.conducteur_id === Number(userId));
        
        const carpoolsTitle = document.querySelector('#carpoolsSection h2');
        const carpoolsListContainer = document.getElementById('carpoolsList');

        carpoolsListContainer.innerHTML = ''; // Vider la liste avant d'ajouter les nouveaux covoiturages
        
        if (userCarpools.length > 0) {
            carpoolsTitle.style.display = 'block'; // Afficher le titre juste avant l'ajout des données
            
            userCarpools.forEach(carpool => {
                const carpoolElement = document.createElement('div');
                carpoolElement.classList.add('col');
                carpoolElement.innerHTML = `
                    <div class="card p-3 d-flex flex-column align-items-start rounded-3 shadow-sm mb-3 bg-ecogreen_light">
                        <p><strong>Covoiturage ID : </strong>${carpool.id}</p>
                        <p><strong>Montant : </strong>${carpool.prix_personne}€</p>
                        <p><strong>Date de départ : </strong>${new Date(carpool.date_depart).toLocaleString()}</p>
                        <p><strong>Lieu de départ : </strong>${carpool.lieu_depart}</p>
                        <p><strong>Date d'arrivée : </strong>${new Date(carpool.date_arrivee).toLocaleString()}</p>
                        <p><strong>Lieu d'arrivée : </strong>${carpool.lieu_arrivee}</p>
                        <p><strong>Statut : </strong>${carpool.statut}</p>
                    </div>
                `;
                carpoolsListContainer.appendChild(carpoolElement);
            });
        }
    })
    .catch(error => console.error('Erreur lors de la récupération des covoiturages :', error));
}

loadCars();
loadCarpools();

// Fonction pour récupérer les covoiturages du conducteur ayant fais l'objet de paiements
async function getPayedCovoiturages() {
    const token = getToken();
    const utilisateurId = getId();

    if (!token || !utilisateurId) {
        return;
    }

    try {
        // Récupération des paiements
        const response = await fetch(`${apiUrl}/paiements`, {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": token
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur récupération des paiements : ${response.status}`);
        }

        const paiements = await response.json();
        
        // Filtrage des paiements pour n'afficher que ceux qui concernent le conducteur
        const paiementsConducteur = paiements.filter(paiement => paiement.conducteur_id === Number(utilisateurId));

        // Passer les paiements filtrés à la fonction populateCovoiturageSelect
        populatePayedCovoiturageSelect(paiementsConducteur);
    } catch (error) {
        Swal.fire({
            text: "Erreur lors de la récupération des paiements",
            icon: "error",
            position: "center",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false
        });
    }
}

// Fonction pour remplir la liste déroulante des covoiturages avec la date de paiement
function populatePayedCovoiturageSelect(paiementsUtilisateur) {
    const select = document.getElementById("paiementSelect");

    // On s'assure qu'il y a des paiements à afficher
    if (paiementsUtilisateur.length === 0) {
        select.innerHTML = `<option value="">Aucun covoiturage payé</option>`;
        return;
    }

    paiementsUtilisateur.forEach(paiement => {
        const option = document.createElement("option");
        option.value = paiement.covoiturage_id; // Garder l'id du covoiturage comme valeur
        option.textContent = `Covoiturage ID: ${paiement.covoiturage_id} - Passager : ${paiement.pseudo_utilisateur} - Montant : ${paiement.montant}`;
        select.appendChild(option);
    });
}

getPayedCovoiturages(); 


const demarrerDiv = document.getElementById("demarrer");
const arriveeDiv = document.getElementById("arrivee");

function boutonDemarrer() {

    if (!demarrerDiv || !arriveeDiv) {
        console.error("Les éléments nécessaires ne sont pas trouvés dans le DOM.");
        return;
    }

    demarrerDiv.style.display = "none";  // Cache la première div
    arriveeDiv.style.display = "block";  // Affiche la deuxième div
}

// Récupération du bouton et ajout de l'événement au clic
const startButton = document.getElementById("startButton");
if (startButton) {
    startButton.addEventListener("click", boutonDemarrer);
} else {
    console.error("Le bouton 'Démarrer votre covoiturage' est introuvable.");
}

function boutonArriver() {
    
}


