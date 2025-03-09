import { getRole, isConnected, showAndHideElementsForRoles } from "../JS/index.js";
import Route from "./route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
const connexion = new Route("connexion", "Veuillez vous connecter pour accéder a cette page", "/Pages/connectezvous.html");

const getRouteByUrl = (url) => {
  let currentRoute = null;

  // Vérifier si l'URL correspond exactement à une route existante
  currentRoute = allRoutes.find(route => route.url === url);
  
  // Si route trouvée, ne pas faire de redirection, retourner la route
  if (currentRoute) {
    return currentRoute;
  }

  // Nettoyer l'URL et récupérer les segments
  const urlParts = url.split("/").filter(part => part !== "");

  // Si l'URL contient plusieurs segments, ou que la route de base n'existe pas, rediriger vers connexion
  if (urlParts.length > 1 || !allRoutes.some(route => route.url === "/" + urlParts[0])) {
    history.pushState({}, "Connexion", "/Pages/connectezvous.html");  // Change l'URL sans recharger la page
    return connexion; // Retourner la page de connexion
  }

  return connexion;
};

// Ajouter un écouteur pour l'événement popstate
window.addEventListener('popstate', (event) => {
  // Cette fonction sera appelée à chaque fois que l'utilisateur utilise les boutons de retour/avant
  getRouteByUrl(window.location.pathname);
});


const LoadContentPage = async () => {
  const path = window.location.pathname;
  const actualRoute = getRouteByUrl(path);

  if (!actualRoute) { 
    console.error(`Aucune route trouvée pour le chemin : ${path}`);
    window.location.replace("/accueil"); // Redirige vers l'accueil si la route n'existe pas
    return;
  }

  const allRolesArray = actualRoute.authorize || []; // Assure que c'est un tableau

  if (allRolesArray.length > 0) {
    if (allRolesArray.includes("disconnected")) {
      if (isConnected()) {
        window.location.replace("/accueil");
        return;
      }
    } else {
      const roleUser = getRole();
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