import { apiUrl, getId, getToken } from "./index.js";

// Fonction pour effectuer le paiement
export async function effectuerPaiement(covoiturageId) {
    const token = getToken();
    const utilisateurId = getId();
    console.log("Token utilisé:", token);  

    if (!token || !utilisateurId) {
        alert("Erreur : Token ou ID utilisateur manquant !");
        return;
    }

    try {
        const response = await fetch(apiUrl + "/paiement/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": token
            },
            body: JSON.stringify({
                utilisateur_id: utilisateurId,
                covoiturage_id: covoiturageId
            })
        });

        
        if (!response.ok) {
            
            if (response.status === 404) {
                alert("Erreur : Crédits insuffisants pour effectuer le paiement.");
            } else {
                alert(`Erreur lors du paiement : ${response.status}`);
            }
            return;
        }

        const paiement = await response.json();
        alert("Paiement réussi ! Veuillez vous reconnecter pour mettre à jour vos l'affichage de vos crédits.");

        
        afficherDetailsPaiement(paiement.paiement_id);  
    } catch (error) {
        console.error("Erreur lors du paiement :", error);
        alert("Une erreur est survenue lors du paiement. Veuillez réessayer.");
    }
}

// Fonction pour afficher les détails du paiement dans la page passager
async function afficherDetailsPaiement(paiementId) {
    const token = getToken(); 

    if (!token) {
        alert("Erreur : Token manquant !");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/paiement/${paiementId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": token  
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur récupération paiement : ${response.status}`);
        }

        const paiement = await response.json();
        console.log("Détails du paiement :", paiement);

        
        const checkElementInterval = setInterval(() => {
            const paiementContainer = document.querySelector("#paiement_details");
            if (paiementContainer) {
                paiementContainer.innerHTML = ` 
                    <h2 class="text-center mb-3">Commandes</h2>
                    <div class="card p-3 d-flex flex-row align-items-center rounded-3 bg-ecogreen shadow-sm mb-3">
                        <div class="paiement-info flex-grow-1">
                            <p><strong>Montant :</strong> ${paiement.montant}€</p>
                            <p><strong>Date :</strong> ${paiement.date_paiement}</p>
                            <p><strong>Avancement :</strong> ${paiement.avancement}</p>
                        </div>
                    </div>
                `;
                clearInterval(checkElementInterval);  
            } 
        }, 100);  

    } catch (error) {
        console.error("Erreur lors de la récupération des détails du paiement :", error);
        alert("Erreur lors de la récupération des détails du paiement.");
    }
}

// Fonction pour récupérer et afficher tous les paiements de l'utilisateur
export async function afficherTousLesPaiements() {
    const token = getToken();  
    const utilisateurId = getId();  

    if (!token || !utilisateurId) {
        alert("Erreur : Token ou ID utilisateur manquant !");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/paiements`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": token  
            }
        });

        if (!response.ok) {
            alert("Vous n'avez pas encore effectué de paiements.");
        }

        const paiements = await response.json();
        

        // Filtrer les paiements pour n'afficher que ceux de l'utilisateur connecté
        const paiementsUtilisateur = paiements.filter(paiement => paiement.utilisateur_id === Number(utilisateurId));
        console.log("Liste des paiements :", paiementsUtilisateur);
        const checkElementInterval = setInterval(() => {
            const paiementContainer = document.querySelector("#paiement_details");
            if (paiementContainer) {
                if (paiementsUtilisateur.length > 0) {
                    let paiementHtml = ` 
                        <h2 class="text-center mb-3">Commandes</h2>
                    `;
                    paiementsUtilisateur.forEach(paiement => {
                        paiementHtml += `
                            <div class="card p-3 d-flex flex-row align-items-center rounded-3 bg-ecogreen shadow-sm mb-3">
                                <div class="paiement-info flex-grow-1">
                                    <p><strong>Montant :</strong> ${paiement.montant}€</p>
                                    <p><strong>Date :</strong> ${paiement.date_paiement}</p>
                                    <p><strong>Avancement :</strong> ${paiement.avancement}</p>
                                </div>
                            </div>
                        `;
                    });

                    paiementContainer.innerHTML = paiementHtml;
                } else {
                    paiementContainer.innerHTML = ` 
                        <p style="color: red; text-align: center;">Aucun paiement trouvé pour cet utilisateur.</p>
                    `;
                }
                clearInterval(checkElementInterval);  
            }
        }, 100); 

    } catch (error) {
        console.error("Erreur lors de la récupération des paiements :", error);
    }
}


// Appel de la fonction lorsque le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    afficherTousLesPaiements();
});








