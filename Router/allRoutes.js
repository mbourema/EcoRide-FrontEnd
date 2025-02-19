import Route from "./route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/Pages/accueil.html", []),
    new Route("/administrateur", "Espace administrateur", "/Pages/administrateur.html", ["ROLE_ADMIN"]),
    new Route("/conducteur", "Espace conducteur", "/Pages/conducteur.html", ["ROLE_CONDUCTEUR"], "/JS/conducteur.js"),
    new Route("/covoiturage", "Ajouter Covoiturages", "/Pages/covoiturage.html", ["ROLE_CONDUCTEUR"], "/JS/covoiturage.js"),
    new Route("/covoiturages", "Covoiturages", "/Pages/covoiturages.html", [], "/JS/covoiturages.js"),
    new Route("/detail", "Details Conducteur", "/Pages/detail.html", []),
    new Route("/employe", "Espace Employe", "/Pages/employe.html", ["ROLE_EMPLOYE", "ROLE_ADMIN"]),
    new Route("/inscription", "Espace Inscription", "/Pages/inscription.html", [], "/JS/inscription.js"),
    new Route("/connexion", "Espace Connexion", "/Pages/connexion.html", [], "/JS/connexion.js"),
    new Route("/mentions", "Mentions Légales", "/Pages/mentions.html", []),
    new Route("/passager", "Espace Passager", "/Pages/passager.html", ["ROLE_PASSAGER", "ROLE_CONDUCTEUR", "ROLE_EMPLOYE", "ROLE_ADMIN"]),
    new Route("/voiture", "Ajouter Voiture", "/Pages/voiture.html", ["ROLE_CONDUCTEUR", "ROLE_ADMIN"], "/JS/voiture.js")
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";