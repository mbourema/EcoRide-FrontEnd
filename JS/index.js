const signOutBtn = document.getElementById("SignoutBtn");
export const tokenCookieName = "accesstoken";
export const pseudoCookieName = "pseudo";
export const roleCookieName = "role";
export const nbCreditsCookieName = "crédits";
export const idConnected = "id";
export const apiUrl = "https://obscure-stream-41149-67f60faa3f9f.herokuapp.com";
const inputVilleDepart = document.getElementById("VilleDepart");
const inputVilleArrivee = document.getElementById("VilleArrivee");
const inputDateDepart = document.getElementById("DateDepart");
const buttonRechercher = document.getElementById("Rechercher");

inputVilleDepart.addEventListener("input", validateVilleDepart);
inputVilleArrivee.addEventListener("input", validateVilleArrivee);
inputDateDepart.addEventListener("input", validateDateDepart);

// Fonction pour valider la ville de départ
function validateVilleDepart() {
    const isValid = villeDepart(inputVilleDepart);
    toggleSubmitButton();  // Vérifier si le bouton doit être activé ou non
}

// Fonction pour valider la ville d'arrivée
function validateVilleArrivee() {
    const isValid = villeArrivee(inputVilleArrivee);
    toggleSubmitButton();  // Vérifier si le bouton doit être activé ou non
}

// Fonction pour valider la date de départ
function validateDateDepart() {
    const isValid = validateDate(inputDateDepart);
    toggleSubmitButton();  // Vérifier si le bouton doit être activé ou non
}

// Fonction qui vérifie si tous les champs sont valides
function toggleSubmitButton() {
    const isVilleDepartValid = inputVilleDepart.classList.contains("is-valid");
    const isVilleArriveeValid = inputVilleArrivee.classList.contains("is-valid");
    const isDateDepartValid = inputDateDepart.classList.contains("is-valid");

    if (isVilleDepartValid && isVilleArriveeValid && isDateDepartValid) {
        buttonRechercher.disabled = false;
    } else {
        buttonRechercher.disabled = true;
    }
}

// Fonction pour valider la ville de départ
function villeDepart() {
    const resultsContainer = document.getElementById("autocomplete-results-depart");
    const VilleRegex = /^[A-Z][a-z]*([ -']?[a-z]+)*$/;  // Ville doit commencer par une majuscule suivi de minuscules, espaces et apostrophes permis
    const VilleUser = inputVilleDepart.value.trim(); 
    const query = inputVilleDepart.value.trim(); 

    if (query.length >= 3) { 
        fetch(`https://geo.api.gouv.fr/communes?nom=${query}&fields=nom,code&boost=population&limit=5`)
            .then(response => response.json())
            .then(data => {
                displayResults(data, resultsContainer, inputVilleDepart);
            })
            .catch(error => console.error("Erreur API:", error));
    } else {
        resultsContainer.innerHTML = "";
    } 
    if (query === "") {
        inputVilleDepart.classList.remove("is-invalid");
        inputVilleDepart.classList.remove("is-valid");
        return false; 
    }

    if (VilleUser.match(VilleRegex)) {
        inputVilleDepart.classList.add("is-valid");
        inputVilleDepart.classList.remove("is-invalid");
        return true; 
    } else {
        inputVilleDepart.classList.remove("is-valid");
        inputVilleDepart.classList.add("is-invalid");
        return false; 
    }
}

// Fonction pour valider la ville d'arrivée
function villeArrivee() {
    const resultsContainer = document.getElementById("autocomplete-results-arrivee");
    const VilleRegex = /^[A-Z][a-z]*([ -']?[a-z]+)*$/;  // Ville doit commencer par une majuscule suivi de minuscules, espaces et apostrophes permis
    const VilleUser = inputVilleArrivee.value.trim(); 
    const query = inputVilleArrivee.value.trim(); 

    if (query.length >= 3) { 
        fetch(`https://geo.api.gouv.fr/communes?nom=${query}&fields=nom,code&boost=population&limit=5`)
            .then(response => response.json())
            .then(data => {
                displayResults(data, resultsContainer, inputVilleArrivee);
            })
            .catch(error => console.error("Erreur API:", error));
    } else {
        resultsContainer.innerHTML = "";
    } 
    if (query === "") {
        inputVilleArrivee.classList.remove("is-invalid");
        inputVilleArrivee.classList.remove("is-valid");
        return false; 
    }

    if (VilleUser.match(VilleRegex)) {
        inputVilleArrivee.classList.add("is-valid");
        inputVilleArrivee.classList.remove("is-invalid");
        return true; 
    } else {
        inputVilleArrivee.classList.remove("is-valid");
        inputVilleArrivee.classList.add("is-invalid");
        return false; 
    }
}

function displayResults(villes, resultsContainer, inputField) {
    resultsContainer.innerHTML = ""; 

    villes.forEach(ville => {
        let li = document.createElement("li");
        li.textContent = `${ville.nom}`;
        li.classList.add("autocomplete-item");
        li.addEventListener("click", () => {
            inputField.value = ville.nom;
            resultsContainer.innerHTML = ""; 
            inputField.classList.add("is-valid");
            inputField.classList.remove("is-invalid");
        });
        document.addEventListener("click", function(event) {
        if (!resultsContainer.contains(event.target) && event.target !== inputField) {
            resultsContainer.innerHTML = ""; // Effacer les résultats si on clique en dehors
        }
    });
        resultsContainer.appendChild(li);
    });
}

// Fonction pour valider la date
function validateDate(input) {
    const DateUser = input.value.trim();

    if (DateUser === "") {
        input.classList.remove("is-invalid");
        input.classList.remove("is-valid");
        return false; 
    }

    if (DateUser) {
        const userDate = new Date(DateUser);
        const currentDate = new Date();

        userDate.setHours(0, 0, 0, 0);  // Réinitialiser l'heure à 00:00:00
        currentDate.setHours(0, 0, 0, 0);  // Réinitialiser l'heure à 00:00:00

        if (userDate < currentDate) {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
            return false;  // La date est dans le passé
        } else {
            input.classList.add("is-valid");
            input.classList.remove("is-invalid");
            return true;  // La date est valide et dans le futur
        }
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;  // La date est invalide
    }
}

// Ajouter un événement sur le bouton de recherche
buttonRechercher.addEventListener("click", function(event) {
    event.preventDefault(); // Empêcher la soumission du formulaire par défaut

    // Vérification des valeurs
    let villeDepart = inputVilleDepart.value.trim();
    let villeArrivee = inputVilleArrivee.value.trim();
    const dateDepart = inputDateDepart.value.trim();

    villeDepart = sanitizeHtml(villeDepart);
    villeArrivee = sanitizeHtml(villeArrivee);

    if (villeDepart && villeArrivee && dateDepart) {
        // Construire l'URL avec les paramètres de la recherche
        const url = `/covoiturages?ville_depart=${encodeURIComponent(villeDepart)}&ville_arrivee=${encodeURIComponent(villeArrivee)}&date_depart=${encodeURIComponent(dateDepart)}`;
        // Rediriger vers la page des covoiturages
        window.location.href = url;
    }
});

// Fonction pour récupérer les paramètres de l'URL
function getSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        villeDepart: urlParams.get('ville_depart'),
        villeArrivee: urlParams.get('ville_arrivee'),
        dateDepart: urlParams.get('date_depart')
    };
}

// Fonction pour récupérer la note moyenne d'un conducteur
async function getMoyenneNote(pseudo) {
    const urlAvis = `${apiUrl}/avis/fulllist/conducteur/${pseudo}`;

    try {
        const response = await fetch(urlAvis, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json'}
        });
        // Vérification AVANT d'essayer d'analyser la réponse en JSON
        if (response.status === 404) {
            return "Pas de note pour le moment !";
        }

        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des avis: ${response.status}`);
        }

        // Vérification si la réponse contient bien du JSON avant de parser
        const allAvis = await response.json();
        const avis = allAvis.filter(avis => avis.avancement === "OK");
        if (!Array.isArray(avis) || avis.length === 0) {
            return "Pas de note pour le moment !";
        }

        // Calcul de la moyenne des notes
        const totalNotes = avis.reduce((sum, avis) => sum + (avis.note || 0), 0);
        return (totalNotes / avis.length).toFixed(1);

    } catch (error) {
        return "Pas d'avis pour le moment !";
    }
}


// Fonction pour récupérer l'énergie de la voiture
async function getEnergieVoiture(voitureId) {
    const urlVoiture = `${apiUrl}/api/voitures/details/${voitureId}`;

    try {
        const response = await fetch(urlVoiture, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération de l'énergie: ${response.status}`);
        }
        const voiture = await response.json();
        return voiture.energie || "Non spécifié"; // Retourne l'énergie ou un message par défaut
    } catch (error) {
        console.error("Erreur lors de la récupération de l'énergie de la voiture :", error);
        return "Non spécifié";
    }
}

function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const checkElement = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkElement);
                resolve(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(checkElement);
                reject(new Error(`Timeout: L'élément ${selector} n'a pas été trouvé`));
            }
        }, 100);
    });
}

// Fonction pour afficher les covoiturages dans la page
async function afficherCovoiturages(covoiturages) {
    const containerCovoiturages = await waitForElement('.covoiturages .row'); // Sélecteur pour les éléments de covoiturages

    containerCovoiturages.innerHTML = '';

    // Récupérer la date de départ entrée par l'utilisateur
    const searchParams = getSearchParams();
    const dateDepartUser = new Date(searchParams.dateDepart);


    for (const covoiturage of covoiturages) {
        const dateDepartCovoiturage = new Date(covoiturage.date_depart);
        const dateArriveeCovoiturage = new Date(covoiturage.date_arrivee);

        // Fonction pour normaliser les chaînes de texte (enlever les espaces superflus et ignorer la casse)
        function formateText(text) {
            return text.trim().toLowerCase().replace(/\s+/g, ' ');
        }
        
        // Fonction pour vérifier si les dates sont proches
        
        function isCloseEnough(date1, date2, toleranceDays = 2) {
            const diffTime = Math.abs(date1 - date2); // Différence en millisecondes
            const diffDays = diffTime / (1000 * 3600 * 24); // Convertir en jours
            return diffDays <= toleranceDays; // Si la différence est inférieure ou égale à la tolérance
        }
        
        // Comparer les lieux et la date avec plus de souplesse
        if (
            formateText(covoiturage.lieu_depart) === formateText(searchParams.villeDepart) &&
            formateText(covoiturage.lieu_arrivee) === formateText(searchParams.villeArrivee) &&
            isCloseEnough(dateDepartCovoiturage, dateDepartUser) &&
            covoiturage.nb_places > 0
        ) {
            // Récupérer la note moyenne du conducteur
            const moyenneNote = await getMoyenneNote(covoiturage.pseudo_conducteur);

            // Récupérer l'énergie de la voiture
            const energieVoiture = await getEnergieVoiture(covoiturage.voiture_id);

            // Calcul de la durée du trajet en minutes
            const dureeMinutes = Math.round((dateArriveeCovoiturage - dateDepartCovoiturage) / (1000 * 60));

            // Créer la structure HTML du covoiturage
            const card = document.createElement('div');
            card.classList.add('col');
            card.innerHTML = `
                <div class="card p-3 d-flex flex-column flex-md-row align-items-center rounded-3 bg-ecogreen shadow-sm mb-3">
                    <div class="covoit-info flex-grow-1">
                        <p><strong>Pseudo :</strong> <span>${covoiturage.pseudo_conducteur}</span></p>
                        <p><strong>Note moyenne :</strong> <span>${moyenneNote}</span></p>
                        <p><strong>Prix :</strong> ${covoiturage.prix_personne}</p>
                        <p><strong>Places disponibles :</strong> ${covoiturage.nb_places}</p>
                        <p><strong>Type véhicule :</strong> ${energieVoiture}</p>
                        <p><strong>Durée du trajet :</strong> ${dureeMinutes} min</p>
                        <p><strong>Départ :</strong> ${new Date(covoiturage.date_depart).toLocaleString()}</p>
                        <p><strong>Arrivée :</strong> ${new Date(covoiturage.date_arrivee).toLocaleString()}</p>
                        <p><strong>Voyage :</strong> <span class="badge bg-success">${covoiturage.statut}</span></p>
                    </div>
                    <div class="text-center">
                        <img src="${covoiturage.photo_conducteur}" class="rounded-circle" alt="Conducteur" style="width: 100%; max-width: 250px; height: 250px; object-fit: cover;">
                        <br>
                        <button id="detail-${covoiturage.id}" class="btn btn-secondary mt-2">Détails</button>
                    </div>
                </div>
            `;

            // Ajouter la carte au conteneur
            containerCovoiturages.appendChild(card);

            // Ajouter un événement au bouton "Détails"
            document.getElementById(`detail-${covoiturage.id}`).addEventListener("click", function () {
                const url = `/detail?conducteur_id=${covoiturage.conducteur_id}&voiture_id=${covoiturage.voiture_id}&pseudo=${covoiturage.pseudo_conducteur}&covoiturage_id=${covoiturage.id}`;
                window.location.href = url;
            });
        }
    }

    if (containerCovoiturages.innerHTML === '') {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'Aucun covoiturage disponible pour ces critères !';


        noResultsMessage.style.cssText = `
            color: red;
            font-weight: bold;
            text-align: center;
            margin-top: 20px;
            font-size: 1.2rem;
        `;

        containerCovoiturages.appendChild(noResultsMessage);
    }
}


// Exécuter la recherche des covoiturages après le chargement de la page
function rechercheCovoiturages() {
    const searchParams = getSearchParams();

    if (searchParams.villeDepart && searchParams.villeArrivee && searchParams.dateDepart) {
        const url = `${apiUrl}/covoiturage/list?ville_depart=${searchParams.villeDepart}&ville_arrivee=${searchParams.villeArrivee}&date_depart=${searchParams.dateDepart}`;

        fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json())
            .then(data => {
                afficherCovoiturages(data);
            })
            .catch(error => {
                console.error("Erreur de requête API", error);
            });
    }
};
rechercheCovoiturages();


// Créer un cookie à partir de son nom, de sa valeur et de sa durée d'expiration en jours
export function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

//Récupérer la valeur d'un cookie à partir de son nom
export function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

//Obtenir la valeur du jeton de connexion
export function getToken(){
    return getCookie(tokenCookieName);
}

export function getRole(){
    return getCookie(roleCookieName);
}

export function getPseudo(){
    return getCookie(pseudoCookieName);
}

export function getCredit(){
    return getCookie(nbCreditsCookieName);
}

export function getId(){
    return getCookie(idConnected);
}

// Supprimer un cookie à partir de son nom
export function eraseCookie(name) {  
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function signout(){
    eraseCookie(tokenCookieName);
    eraseCookie(roleCookieName);
    eraseCookie(pseudoCookieName);
    eraseCookie(nbCreditsCookieName);
    eraseCookie(idConnected);
    window.location.reload();
}

// Bouton de déconnexion
signOutBtn.addEventListener("click", signout);

// Fonction qui vérifie si on est connexté sur le site par la présence ou non du cookie jeton
export function isConnected(){
    if(getPseudo() == null || getPseudo == undefined){
        return false;
    }
    else{
        return true;
    }
}

//Afficher ou pas des éléments sur le site en fonction du role
export function showAndHideElementsForRoles(){
    const userConnected = isConnected();
    const role = getRole();

    let allElementsToEdit = document.querySelectorAll('[data-show]');
    allElementsToEdit.forEach(element =>{
        switch(element.dataset.show){
            case 'display' :
                element.classList.remove("d-none");
                break;
            case 'disconnected': 
                if(!userConnected){
                    element.classList.remove("d-none");
                }
                break;
            case 'connected': 
                if(userConnected){
                    element.classList.remove("d-none");
                }
                break;
            case 'admin': 
                if(userConnected && role.includes("ROLE_ADMIN")){
                    element.classList.remove("d-none");
                }
                break;
            case 'employe': 
                if(userConnected && role.includes("ROLE_EMPLOYE")){
                    element.classList.remove("d-none");
                }
                break;
            case 'conducteur':
                if(userConnected && role.includes("ROLE_CONDUCTEUR")){
                    element.classList.remove("d-none");
                }
                break;
            case 'passager':
                if(userConnected && role.includes("ROLE_PASSAGER")){
                    element.classList.remove("d-none");
                }
                break;
               
        }
    })
}

//Fonction pour transformer le codes HTML en texte pour éviter l'injection de code HTML via failles XSS
export function sanitizeHtml(text){
    const tempHtml = document.createElement('div');
    
    tempHtml.textContent = text;
    
    return tempHtml.innerHTML;
}

function afficherInfosUser() {
    // Récupérer les informations des cookies
    const pseudo = getCookie(pseudoCookieName);
    const nbCredit = getCookie(nbCreditsCookieName);

    // Vérifier si les cookies sont présents
    if (pseudo && nbCredit) {
        // Afficher les informations dans la navbar
        document.getElementById("pseudo_presentation").innerHTML = `Bienvenue <span class="text-danger">${pseudo}</span> !`;
        document.getElementById('nbcredit').innerHTML = `Votre nombre de crédits : <span class="text-danger">${nbCredit}</span>`;
    }
    else if (pseudo && !nbCredit){
        const api_token = getToken();
        const response = fetch(`${apiUrl}/api/utilisateurs/details/${api_token}`,{
            method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des détails de l'utilisateur : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let credit = data.nbCredit;
            setCookie(nbCreditsCookieName, credit, 7);
            const nbCreditRefresh = getCookie(nbCreditsCookieName);
            document.getElementById("pseudo_presentation").innerHTML = `Bienvenue <span class="text-danger">${pseudo}</span> !`;
            document.getElementById('nbcredit').innerHTML = `Votre nombre de crédits : <span class="text-danger">${nbCreditRefresh}</span>`;
            if (!nbCreditRefresh){
                document.getElementById("pseudo_presentation").innerHTML = `Bienvenue <span class="text-danger">${pseudo}</span> !`;
                document.getElementById('nbcredit').innerHTML = `Votre nombre de crédits : <span class="text-danger">0</span>`;
            }
        });
}}

afficherInfosUser();






    


