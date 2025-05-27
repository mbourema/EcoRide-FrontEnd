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
            return;
        }

        const paiements = await response.json();

        const paiementsUtilisateur = paiements.filter(paiement => paiement.utilisateur_id === Number(utilisateurId) && paiement.avancement !== "OK");

        const checkElementInterval = setInterval(() => {
            const paiementContainer = document.querySelector("#paiement_details");
            if (paiementContainer) {
                if (paiementsUtilisateur.length > 0) {
                    let paiementHtml = `<h2 class="text-center mb-3">Commandes</h2>`;
                    
                    paiementsUtilisateur.forEach(paiement => {
                        paiementHtml += `
                            <div class="card p-3 d-flex flex-row align-items-center rounded-3 bg-ecogreen shadow-sm mb-3">
                                <div class="paiement-info flex-grow-1">
                                    <p><strong>Montant :</strong> ${paiement.montant}€</p>
                                    <p><strong>Date :</strong> ${paiement.date_paiement}</p>
                                    <p><strong>Avancement :</strong> ${paiement.avancement}</p>
                                </div>
                                <div class="text-center">
                                    <button id="annule-${paiement.paiement_id}" class="btn btn-secondary mt-2">Annuler le voyage</button>
                                </div>
                            </div>
                        `;
                    });

                    paiementContainer.innerHTML = paiementHtml;

                    paiementsUtilisateur.forEach(paiement => {
                        const btn = document.getElementById(`annule-${paiement.paiement_id}`);
                        if (btn) {
                            btn.addEventListener("click", async function () {
                                const ID = paiement.paiement_id;
                                const validation = await fetch(`${apiUrl}/paiement/${ID}`, {
                                    method: 'PATCH',
                                    credentials: 'include',
                                    headers: {
                                        'X-AUTH-TOKEN': token,
                                        'Accept': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        avancement: "Annule par passager"
                                    })
                                });
                                if (validation.ok) {
                                    Swal.fire({
                                        text: "Paiement annulé avec succès",
                                        icon: "success",
                                        position: "center",
                                        showConfirmButton: false,
                                        timer: 3000,
                                        timerProgressBar: false
                                    }).then(() => {
                                        window.location.reload();
                                    });
                                } else {
                                    Swal.fire({
                                        text: "Erreur lors de l'annulation du paiement",
                                        icon: "error",
                                        position: "center",
                                        showConfirmButton: false,
                                        timer: 3000,
                                        timerProgressBar: false
                                    });
                                }
                            });
                        }
                    });

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








