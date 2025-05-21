import { apiUrl, getId, getToken, eraseCookie, nbCreditsCookieName } from "./index.js";

// Fonction pour effectuer le paiement
export async function effectuerPaiement(covoiturageId) {
    const token = getToken();
    const utilisateurId = getId();
    if (!token || !utilisateurId) {
        return;
    }

    try {
        const response = await fetch(apiUrl + "/paiement/add", {
            method: "POST",
            credentials: "include",
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
                Swal.fire({
                    text: "Erreur : Crédits insuffisants pour effectuer le paiement.",
                    icon: "error",
                    position: "center",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: false
                });
            } 
            return;
        }

        const paiement = await response.json();

        Swal.fire({
            text: "Paiement réussi !",
            icon: "success",
            position: "center",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false
        });
        eraseCookie(nbCreditsCookieName);
        afficherDetailsPaiement(paiement.paiement_id);  
    } catch (error) {
        Swal.fire({
            text: "Une erreur est survenue lors du paiement. Veuillez réessayer.",
            icon: "error",
            position: "center",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false
        });
    }
}

// Fonction pour afficher les détails du paiement dans la page passager
async function afficherDetailsPaiement(paiementId) {
    const token = getToken(); 

    if (!token) {
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/paiement/${paiementId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": token  
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur récupération paiement : ${response.status}`);
        }

        const paiement = await response.json();

        
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
    }
}

// Fonction pour récupérer et afficher tous les paiements de l'utilisateur
export async function afficherTousLesPaiements() {
    const token = getToken();  
    const utilisateurId = getId();
    
    if (!token || !utilisateurId) {
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/paiements`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": token  
            }
        });

        if (!response.ok) {
            Swal.fire({
                text: "Vous n'avez pas encore effectué de paiements.",
                icon: "error",
                position: "center",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: false
            });
        }

        const paiements = await response.json();
        

        // Filtrer les paiements pour n'afficher que ceux de l'utilisateur connecté
        const paiementsUtilisateur = paiements.filter(paiement => paiement.utilisateur_id === Number(utilisateurId));
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








