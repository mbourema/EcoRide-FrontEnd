# Utilisation de l'image NGINX légère
FROM nginx:stable-alpine

# Copie d'une configuration NGINX personnalisée (optionnel)
COPY nginx.conf /etc/nginx/nginx.conf

# Copie des fichiers statiques (HTML, CSS, JS compilés)
COPY . /usr/share/nginx/html

# Exposition du port HTTP
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]