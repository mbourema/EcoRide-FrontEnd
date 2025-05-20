import { isConnected, showAndHideElementsForRoles } from "../JS/index.js";
import Route from "./route.js";
import { allRoutes, websiteName } from "./allRoutes.js";
import rolesfixe from "../JS/connexion.js";

// Création d'une route pour la page 404 (page introuvable)
const connexion = new Route("connexion", "Veuillez vous connecter pour accéder a cette page", "/Pages/connectezvous.html");

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  let currentRoute = null;
  // Parcours de toutes les routes pour trouver la correspondance
  allRoutes.forEach((element) => {
    if (element.url == url) {
      currentRoute = element;
    }
  });
  // Si aucune correspondance n'est trouvée, on retourne la route 404
  if (currentRoute != null) {
    return currentRoute;
  } else {
    return connexion;
  }
};

const LoadContentPage = async () => {
  const path = window.location.pathname;
  const actualRoute = getRouteByUrl(path);

  const allRolesArray = actualRoute.authorize || []; // Assure que c'est un tableau

  if (allRolesArray.length > 0) {
    if (allRolesArray.includes("disconnected")) {
      if (isConnected()) {
        window.location.replace("/accueil");
        return;
      }
    } else {
      const roleUser = rolesfixe;
      if (!roleUser) {
        window.location.replace("/accueil");
        return;
      }

      const userRoles = roleUser.split(",");
      if (!userRoles.some(role => allRolesArray.includes(role))) {
        window.location.replace("/accueil");
        return;
      }
    }
  }

  // Récupération du contenu HTML de la route
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  document.getElementById("main-page").innerHTML = html;

  // Ajout du contenu JavaScript
  if (actualRoute.pathJS !== "") {
    let scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "module");
    scriptTag.setAttribute("src", actualRoute.pathJS);
    document.querySelector("body").appendChild(scriptTag);
  }

  // Changement du titre de la page
  document.title = actualRoute.title + " - " + websiteName;
  
  // Afficher et masquer les éléments en fonction du rôle
  showAndHideElementsForRoles();
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {

  event = event || window.event;
  
  event.preventDefault();
 
  const anchor = event.currentTarget.href || event.target.closest('a');
  
  if (!anchor || !anchor.href) return; 
  window.history.pushState({}, "", anchor.href);
  
  LoadContentPage();
};
window.onpopstate = LoadContentPage;
window.route = routeEvent;
LoadContentPage();