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
            <h2>Nombre total de crédits récupérés par la plateforme : ${totalCredits}€</h2>
        `;
    }
}

setTimeout(function() {
    getTotalCredits(); 
}, 100);  