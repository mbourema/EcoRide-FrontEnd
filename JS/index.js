const tokenCookieName = "accesstoken";
const signOutBtn = document.getElementById("SignoutBtn");
export const roleCookieName = "role";
export const pseudoCookieName = "pseudo";
export const nbCreditsCookieName = "crédits";
export const idConnected = "id";
export const apiUrl = "http://127.0.0.1:8000";
const inputVilleDepart = document.getElementById("VilleDepart");
const inputVilleArrivee = document.getElementById("VilleArrivee");
const inputDateDepart = document.getElementById("DateDepart");
const buttonRechercher = document.getElementById("Rechercher");

inputVilleDepart.addEventListener("input", validateVilleDepart);
inputVilleArrivee.addEventListener("input", validateVilleArrivee);
inputDateDepart.addEventListener("input", validateDateDepart);

// Fonction pour valider la ville de départ
function validateVilleDepart() {
    const isValid = validateVille(inputVilleDepart);
    toggleSubmitButton();  // Vérifier si le bouton doit être activé ou non
}

// Fonction pour valider la ville d'arrivée
function validateVilleArrivee() {
    const isValid = validateVille(inputVilleArrivee);
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

// Fonction pour valider la ville
function validateVille(input) {
    const VilleRegex = /^[A-Z][a-z]*([ -']?[a-z]+)*$/;  // Ville doit commencer par une majuscule suivi de minuscules, espaces et apostrophes permis
    const VilleUser = input.value.trim(); 

    if (VilleUser === "") {
        input.classList.remove("is-invalid");
        input.classList.remove("is-valid");
        return false; 
    }

    if (VilleUser.match(VilleRegex)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true; 
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false; 
    }
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

//Création du cookie jeton
export function setToken(token){
    setCookie(tokenCookieName, token, 7);
}

//Obtenir la valeur du jeton de connexion
export function getToken(){
    return getCookie(tokenCookieName);
}

//Obtenir la valeur du cookie role
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

// Fonction pour gérer la déconnexion à l'aide de la suppression du cookie token et du cookie role
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
    if(getToken() == null || getToken == undefined){
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
            case 'disconnected': 
                if(userConnected){
                    element.classList.add("d-none");
                }
                break;
            case 'connected': 
                if(!userConnected){
                    element.classList.add("d-none");
                }
                break;
            case 'admin': 
                if(!userConnected || !role.includes("ROLE_ADMIN")){
                    element.classList.add("d-none");
                }
                break;
            case 'employe': 
                if(!userConnected || !role.includes("ROLE_EMPLOYE")){
                    element.classList.add("d-none");
                }
                break;
            case 'conducteur':
                if(!userConnected || !role.includes("ROLE_CONDUCTEUR")){
                    element.classList.add("d-none");
                }
            case 'passager':
                if(!userConnected || !role.includes("ROLE_PASSAGER")){
                    element.classList.add("d-none");
                }
                
        }
    })
}

//Fonction pour transformer le codes HTML en texte pour éviter l'injection de code HTML via failles XSS
export function sanitizeHtml(text){
    const tempHtml = document.createElement('div');
    
    tempHtml.textContent = text;
    
    return tempHtml.innerHTML;
}

//Fonction pour récupérer les informations de l'utilisateur
export function getInfoUser() {
    let token = getToken();
    console.log(token);
    if (!token) {
        console.error('Le jeton d\'authentification est manquant.');
        return;
    }

    let myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", token);
    myHeaders.append("Accept", "application/json");  // En-tête Accept

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(apiUrl + "/api/utilisateurs/details/2", requestOptions)
        .then(response => {
            if (response.ok) {
                alert("les infos ont été récupérées !")
                return response.json();
            } else {
                throw new Error("Impossible de récupérer les informations utilisateurs");
            }
        })
        .catch(error => {
            console.log('Erreur lors de la récupération des données utilisateurs', error);
            throw error; // Re-propage l'erreur pour permettre une gestion en amont
        });
}


document.addEventListener("DOMContentLoaded", function() {
    // Récupérer les informations des cookies
    const pseudo = getCookie(pseudoCookieName);
    const nbCredit = getCookie(nbCreditsCookieName);

    // Vérifier si les cookies sont présents
    if (pseudo && nbCredit) {
        // Afficher les informations dans la navbar
        document.getElementById("pseudo_presentation").innerHTML = `Bienvenue <span class="text-danger">${pseudo}</span> !`;
        document.getElementById('nbcredit').innerHTML = `Votre nombre de crédits : <span class="text-danger">${nbCredit}</span>`;
    }
});






    


