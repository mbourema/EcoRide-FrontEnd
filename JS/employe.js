import { apiUrl, getToken } from "./index.js";


async function loadPaiementsEnCours() {
    const token = getToken();
    if (!token) {
        return [];
    }
    try {
        const response = await fetch(apiUrl + "/paiements", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-AUTH-TOKEN': token,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        const userPaiements = data.filter(paiement => paiement.avancement === "En cours");

        const covoiturageIdList = userPaiements.map(p => p.covoiturage_id);

        return covoiturageIdList;

    } catch (error) {
        console.error('Erreur lors de la récupération des paiements :', error);
        return [];
    }
}


async function loadAvis() {
    const token = getToken();
    if (!token) {
        return;
    }

    const covoiturageIdList = await loadPaiementsEnCours();

    try {
        const response = await fetch(apiUrl + "/avis/fulllist", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-AUTH-TOKEN': token,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        // Vérifie si l'ID est dans la liste
        const userAvis = data.filter(avis => covoiturageIdList.includes(avis.covoiturage_id));
        const avisTitle = document.querySelector('#AvisSection h2');
        const avisListContainer = document.getElementById('AvisList');
        avisListContainer.innerHTML = '';

        if (userAvis.length > 0) {
            avisTitle.style.display = 'block';
            userAvis.forEach(avis => {
                const avisElement = document.createElement('div');
                avisElement.classList.add('col');
                avisElement.innerHTML = `
                    <div class="card p-3 d-flex flex-column align-items-start rounded-3 shadow-sm mb-3 bg-ecogreen_light">
                        <p><strong>Pseudo du passager : </strong>${avis.pseudo_passager}</p>
                        <p><strong>Email du passager : </strong>${avis.email_passager}</p>
                        <p><strong>Pseudo du conducteur : </strong>${avis.pseudo_conducteur}</p>
                        <p><strong>Email du conducteur : </strong>${avis.email_conducteur}</p>
                        <p><strong>Date de départ : </strong>${avis.date_depart}</p>
                        <p><strong>Date d'arrivée : </strong>${avis.date_arrivee}</p>
                        <p><strong>Note : </strong>${avis.note}</p>
                        <p><strong>Commentaire : </strong>${avis.commentaire ?? 'Aucun'}</p>
                        <p><strong>Signalement : </strong>${avis.signalement ?? 'Non'}</p>
                        <p><strong>Justification : </strong>${avis.justification ?? 'Aucune'}</p>
                        <div class="text-center">
                            <button id="validate-${avis.paiement_id}" class="btn btn-secondary mt-2">Valider le paiement</button>
                        </div>
                    </div>
                `;
                avisListContainer.appendChild(avisElement);

                document.getElementById(`validate-${avis.paiement_id}`).addEventListener("click", async function () {
                    const ID = avis.paiement_id;
                    const validation = await fetch(`${apiUrl}/paiement/${ID}`, {
                        method: 'PATCH',
                        credentials: 'include',
                        headers: {
                            'X-AUTH-TOKEN': token,
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            avancement: "OK"
                        })
                    });
                    if (validation.ok) {
                        Swal.fire({
                            text: "Paiement validé",
                            icon: "success",
                            position: "center",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: false
                        });
                        window.location.href = "/employe";
                    } else {
                        Swal.fire({
                            text: "Erreur lors de la validation du paiement",
                            icon: "error",
                            position: "center",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: false
                        });
                    }
                });
            });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des avis :', error);
    }
}

// Appel de la fonction
loadAvis();
