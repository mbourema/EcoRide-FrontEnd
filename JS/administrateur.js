import { apiUrl, getToken } from "./index.js";

// Fonction pour récupérer le total des crédits récupérés par la plateforme
async function getTotalCredits() {
    const token = getToken();  // Récupère le token d'authentification
    if (!token) {
        return;
    }

    try {
        // Requête pour récupérer tous les paiements
        const response = await fetch(`${apiUrl}/paiements`, {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": token
            }
        });

        if (!response.ok) {
            Swal.fire({
                text: "Aucun paiement n'a été effectué sur la plateforme",
                icon: "error",
                position: "center",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: false
            });
        }

        const paiements = await response.json();

        function calculnbcredit(paiements){
            let totalCreditsPlateforme = 0;
            paiements.forEach((paiement) => totalCreditsPlateforme += paiement.credit_total_plateforme);
            return totalCreditsPlateforme;
        }

        const totalCreditsPlateforme = calculnbcredit(paiements);
        
        // Affichage du total des crédits dans la page
        displayTotalCredits(totalCreditsPlateforme);

    } catch (error) {
        console.error("Erreur lors de la récupération des paiements :", error);
    }
}

// Fonction pour afficher le total des crédits dans la page
function displayTotalCredits(totalCredits) {
    const creditTotalElement = document.getElementById("creditTotal");

    if (!creditTotalElement) {
        console.error("L'élément avec l'ID 'creditTotal' n'a pas été trouvé !");
        return;
    }

    if (totalCredits === 0) {
        creditTotalElement.innerHTML = `
            <h2>Nombre total de crédits récupérés par la plateforme : 0</h2>
        `;
    } else {
        creditTotalElement.innerHTML = `
            <h2>Nombre total de crédits récupérés par la plateforme : ${totalCredits}</h2>
        `;
    }
}

// Fonction pour récupérer les utilisateurs et les employés du site
async function getUsers() {
    const token = getToken();

    if (!token) {
        return;
    }

    try {
        // Récupération des paiements
        const response = await fetch(`${apiUrl}/api/utilisateurs/liste`, {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": token
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur récupération des utilisateurs du site : ${response.status}`);
        }

        const utilisateurs = await response.json();
        
        // Filtrage des paiements pour n'afficher que ceux qui concernent le conducteur
        const utilisateursEmploye = utilisateurs.filter(utilisateur => utilisateur.roles.includes("ROLE_EMPLOYE"));
        const utilisateursUsers = utilisateurs.filter(utilisateur => !utilisateur.roles.includes("ROLE_EMPLOYE") && !utilisateur.roles.includes("ROLE_ADMIN"));

        // Passer les paiements filtrés à la fonction populateCovoiturageSelect
        populateUtilisateurEmployeSelect(utilisateursEmploye);
        populateUtilisateurUsersSelect(utilisateursUsers);

    } catch (error) {
        Swal.fire({
            text: "Erreur lors de la récupération des utilisateurs",
            icon: "error",
            position: "center",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false
        });
    }
}

// Fonction pour remplir la liste déroulante des employés du site
function populateUtilisateurEmployeSelect(utilisateurs) {
    const select = document.getElementById("employeSelect");

    // On s'assure qu'il y a des employés à afficher
    if (utilisateurs.length === 0) {
        select.innerHTML = `<option value="">Aucun employé présent dans le site</option>`;
        return;
    }

    utilisateurs.forEach(utilisateur => {
        const option = document.createElement("option");
        option.value = utilisateur.id; // Garder l'id de l'employé comme valeur
        option.textContent = `Employe ID: ${utilisateur.id} - Pseudo : ${utilisateur.pseudo} - Email : ${utilisateur.email}`;
        select.appendChild(option);
    });
}

// Fonction pour remplir la liste déroulante des utilisateurs du site
function populateUtilisateurUsersSelect(utilisateurs) {
    const select = document.getElementById("utilisateurSelect");

    // On s'assure qu'il y a des utilisateurs à afficher
    if (utilisateurs.length === 0) {
        select.innerHTML = `<option value="">Aucun utilisateur présent dans le site</option>`;
        return;
    }

    utilisateurs.forEach(utilisateur => {
        const option = document.createElement("option");
        option.value = utilisateur.id; // Garder l'id de l'utilisateur comme valeur
        option.textContent = `Utilisateur ID: ${utilisateur.id} - Pseudo : ${utilisateur.pseudo} - Email : ${utilisateur.email}`;
        select.appendChild(option);
    });
}

getTotalCredits();
getUsers(); 

function generateRandomString(length) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function suspendreUtilisateur(type) {
    let ID;

    if (type === 1) {
        ID = document.getElementById("employeSelect").value;
    } else if (type === 2) {
        ID = document.getElementById("utilisateurSelect").value;
    }

    const token = getToken();

    if (!token || !ID) {
        console.error("Le jeton d'authentification ou l'ID de l'utilisateur est manquant.");
        return;
    }

    // Générer email et mot de passe aléatoires
    const emailAleatoire = `${generateRandomString(10)}@suspendu.local`;
    const mdpAleatoire = generateRandomString(16);

    try {
        const response = await fetch(`${apiUrl}/api/utilisateurs/modifier/${ID}`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": token
            },
            body: JSON.stringify({
                email: emailAleatoire,
                mdp: mdpAleatoire
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la suspension du compte : ${response.status} - ${errorText}`);
        }

        Swal.fire({
            text: "Compte suspendu avec succès !",
            icon: "success",
            position: "center",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: false
        }).then(() => {
            window.location.reload();
        });

    } catch (error) {
        console.error("Erreur lors de la suspension du compte :", error);
        Swal.fire({
            text: "Erreur lors de la suspension du compte",
            icon: "error",
            position: "center",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false
        });
    }
}


const suspendreEmployeButton = document.getElementById("suspendreEmployeButton");
if (suspendreEmployeButton) {
    suspendreEmployeButton.addEventListener("click", () => suspendreUtilisateur(1));
} else {
    console.error("Le bouton de suspension d'employé est introuvable.");
}

const suspendreUtilisateurButton = document.getElementById("suspendreUtilisateurButton");
if (suspendreUtilisateurButton) {
    suspendreUtilisateurButton.addEventListener("click", () => suspendreUtilisateur(2));
} else {
    console.error("Le bouton de suspension d'utilisateur est introuvable.");
}



  

