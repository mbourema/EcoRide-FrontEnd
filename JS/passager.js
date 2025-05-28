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
        }).then(() => {
            eraseCookie(nbCreditsCookieName);
            window.location.replace("/");
        });
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

export async function afficherTousLesPaiements() {
    const token = getToken();  
    const utilisateurId = getId();

    if (!token || !utilisateurId) return;

    const paiementContainer = document.querySelector("#paiement_details");
    if (!paiementContainer) {
        console.warn("Élément #paiement_details introuvable dans le DOM.");
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
                timer: 3000
            });
            return;
        }

        const paiements = await response.json();
        const paiementsUtilisateur = paiements.filter(
            paiement => paiement.utilisateur_id === Number(utilisateurId) && paiement.avancement === "En cours"
        );

        if (paiementsUtilisateur.length === 0) return;

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
                        <button data-id="${paiement.paiement_id}" class="btn btn-secondary mt-2 btn-annuler">Annuler le voyage</button>
                    </div>
                </div>
            `;
        });

        paiementContainer.innerHTML = paiementHtml;

        document.querySelectorAll(".btn-annuler").forEach(button => {
            button.addEventListener("click", async () => {
                const paiementId = button.dataset.id;

                const validation = await fetch(`${apiUrl}/paiement/${paiementId}`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "X-AUTH-TOKEN": token,
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({ avancement: "Annule par passager" })
                });

                if (validation.ok) {
                    Swal.fire({
                        text: "Paiement annulé avec succès",
                        icon: "success",
                        position: "center",
                        showConfirmButton: false,
                        timer: 3000
                    }).then(() => {
                        eraseCookie(nbCreditsCookieName);
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        text: "Erreur lors de l'annulation du paiement",
                        icon: "error",
                        position: "center",
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
            });
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des paiements :", error);
        Swal.fire({
            text: "Erreur serveur lors de la récupération des paiements.",
            icon: "error",
            position: "center",
            showConfirmButton: false,
            timer: 3000
        });
    }
}

afficherTousLesPaiements();








