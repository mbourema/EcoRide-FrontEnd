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
                        <p>Marque: ${car.marque.nom}</p>
                        <p>Modèle: ${car.modele}</p>
                        <p>Plaque d'immatriculation: ${car.immatriculation}</p>
                        <p>Énergie: ${car.energie}</p>
                        <p>Couleur: ${car.couleur}</p>
                        <p>Date de première immatriculation: ${car.date_premiere_immatriculation}</p>
                        <p>Nombre de places: ${car.nb_places}</p>
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
                        <h5>Covoiturage ID: ${carpool.id}</h5>
                        <p>Montant: ${carpool.prix_personne}€</p>
                        <p>Date de départ: ${new Date(carpool.date_depart).toLocaleString()}</p>
                        <p>Lieu de départ: ${carpool.lieu_depart}</p>
                        <p>Date d'arrivée: ${new Date(carpool.date_arrivee).toLocaleString()}</p>
                        <p>Lieu d'arrivée: ${carpool.lieu_arrivee}</p>
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

// Fonction pour gérer l'affichage des boutons "Démarrer" et "Arrivée"
function boutonDemarrerArriver() {
    const demarrerDiv = document.getElementById("demarrer");
    const arriveeDiv = document.getElementById("arrivee");

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
    startButton.addEventListener("click", boutonDemarrerArriver);
} else {
    console.error("Le bouton 'Démarrer votre covoiturage' est introuvable.");
}


