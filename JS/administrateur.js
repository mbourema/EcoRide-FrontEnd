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

        // Additionner toutes les valeurs de la colonne credit_total_platefome en convertissant en nombre
        const totalCredits = paiements.reduce((total, paiement) => {
            // Convertir credit_total_plateforme en nombre (0 si la conversion échoue)
            const credit = parseFloat(paiement.credit_total_platefome) || 0; // Si ce n'est pas un nombre, on prend 0
            
            return total + credit;
        }, 0);
        
        // Affichage du total des crédits dans la page
        displayTotalCredits(totalCredits);
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
            <h2>Nombre total de crédits récupérés par la plateforme : ${totalCredits}€</h2>
        `;
    }
}

setTimeout(function() {
    getTotalCredits(); 
}, 100);  