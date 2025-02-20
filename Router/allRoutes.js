import Route from "./route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/Pages/accueil.html", []),
    new Route("/administrateur", "Espace administrateur", "/Pages/administrateur.html", ["ROLE_ADMIN"], "/JS/administrateur.js"),
    new Route("/conducteur", "Espace conducteur", "/Pages/conducteur.html", ["ROLE_CONDUCTEUR"], "/JS/conducteur.js"),
    new Route("/covoiturage", "Ajouter Covoiturages", "/Pages/covoiturage.html", ["ROLE_CONDUCTEUR"], "/JS/covoiturage.js"),
    new Route("/covoiturages", "Covoiturages", "/Pages/covoiturages.html", ["ROLE_PASSAGER", "ROLE_CONDUCTEUR"], "/JS/covoiturages.js"),
    new Route("/detail", "Details Conducteur", "/Pages/detail.html", ["ROLE_PASSAGER", "ROLE_CONDUCTEUR"], "/JS/detail.js"),
    new Route("/avis", "Ajouter un avis", "/Pages/avis.html", ["ROLE_EMPLOYE", "ROLE_ADMIN", "ROLE_PASSAGER", "ROLE_CONDUCTEUR"], "/JS/avis.js"),
    new Route("/inscription", "Espace Inscription", "/Pages/inscription.html", [], "/JS/inscription.js"),
    new Route("/connexion", "Espace Connexion", "/Pages/connexion.html", [], "/JS/connexion.js"),
    new Route("/mentions", "Mentions Légales", "/Pages/mentions.html", []),
    new Route("/voiture", "Ajouter Voiture", "/Pages/voiture.html", ["ROLE_CONDUCTEUR", "ROLE_ADMIN"], "/JS/voiture.js")
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";