import { getRole, isConnected, showAndHideElementsForRoles } from "../JS/index.js";
import Route from "./route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
const connexion = new Route("connexion", "Veuillez vous connecter pour accéder a cette page", "/Pages/connectezvous.html");

const getRouteByUrl = (url) => {
  // Vérifier si l'URL correspond exactement à une route existante
  let currentRoute = allRoutes.find(route => route.url === url);
  if (currentRoute) {
    return currentRoute; // Retourner la route valide
  }

  // Nettoyer les segments de l'URL (enlever les vides)
  const urlParts = url.split("/").filter(part => part !== "");

  // Vérifier si une route correspond à la base (1er segment)
  const baseRouteExists = allRoutes.some(route => {
    const routeParts = route.url.split("/").filter(part => part !== "");
    return routeParts[0] === urlParts[0]; // Vérifie uniquement le premier segment
  });

  // 🔹 Si l'URL contient plusieurs segments et ne correspond à aucune route, rediriger vers connexion
  if (urlParts.length > 1 || !baseRouteExists) {
    return connexion;
  }

  // 🔹 Si seul le premier segment existe mais que le reste est inconnu, rediriger vers connexion
  return connexion;
};

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