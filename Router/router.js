import { isConnected, showAndHideElementsForRoles, getToken, apiUrl } from "../JS/index.js";
import Route from "./route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

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

  if (allRolesArray.length > 0 && isConnected()) {
    if (allRolesArray.includes("disconnected")) {
      window.location.replace("/accueil");
      return;
    } else {
      const api_token = getToken();
      const vrairoles = await fetch(`${apiUrl}/api/utilisateurs/details/${api_token}`,{
                          method: 'GET',
                          credentials: 'include',
                          headers: {
                            'Content-Type': 'application/json',
                            'X-AUTH-TOKEN': api_token
                          }
                        }).then(response => {
                          if (!response.ok) {
                            throw new Error(`Erreur lors de la récupération des détails de l'utilisateur : ${response.status}`);
                          }
                          return response.json();
                        }).then(data => {
                          return data.roles;
                        });
      const roleUser = vrairoles;
      if (!roleUser) {
        window.location.replace("/accueil");
        return;
      }

      if (!roleUser.some(role => allRolesArray.includes(role))) {
        window.location.replace("/accueil");
        return;
      }
    }
  } else if (allRolesArray.length > 0 && !isConnected() && path !== "/avis") {
      window.location.replace("/connexion");
      return;
  } else if (path === "/avis" && !isConnected()) {
    // Si l'utilisateur n'est pas connecté et essaie d'accéder à la page des avis, on le redirige vers la page de connexion
    localStorage.setItem("redirectAfterLogin", "/avis");
    window.location.replace("/connexion");
    return;
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