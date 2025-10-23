README - Déploiement Louaab
===========================

Ce document explique comment préparer un serveur Ubuntu (DigitalOcean) et utiliser le script de déploiement fourni.

Prérequis serveur
- Ubuntu 22.04+ (Ubuntu 25.04 recommandé par l'utilisateur)
- Node.js LTS (ex: 20.x ou 18.x) via NodeSource or nvm
- npm
- git
- nginx
- pm2 (globally)

Initial server setup (exécuté une seule fois)

1. Installer Node, npm et PM2

   sudo apt update; sudo apt install -y curl git nginx
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -; sudo apt-get install -y nodejs
   sudo npm install -g pm2

2. Créer l'utilisateur de déploiement (optionnel)

   sudo adduser deploy; sudo usermod -aG sudo deploy

3. Cloner le dépôt

   cd /var/www; sudo git clone https://github.com/n156016490/improved-telegram louaab
   cd louaab

4. Créer un fichier `.env` local (ne pas committer)

   cp .env.example .env
   # Editer .env pour définir variables (DATABASE_URL, JWT_SECRET, etc.)

5. Configurer PM2 au démarrage

   sudo pm2 startup systemd -u $(whoami) --hp $(eval echo ~$(whoami))

6. Configurer Nginx (exemple minimal)

   # /etc/nginx/sites-available/louaab
   server {
     listen 80;
     server_name your-domain.tld;

     location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }

   sudo ln -s /etc/nginx/sites-available/louaab /etc/nginx/sites-enabled/
   sudo nginx -t; sudo systemctl reload nginx

Utiliser le script de déploiement

1. Récupérer la dernière version depuis GitHub et déployer (sur le serveur):

   cd /var/www/louaab
   # rendre le script exécutable (une seule fois)
   chmod +x ./scripts/deploy.sh
   ./scripts/deploy.sh main

2. Vérifier PM2

   pm2 status
   pm2 logs louaab --lines 200

Notes et dépannage
- Si le build Next échoue côté serveur, vérifiez la version de Node et installez les dépendances de dev si nécessaire (npm ci).
- Si PM2 ne redémarre pas le processus, lancez `pm2 start ecosystem.config.js --env production` manuellement.
- Assurez-vous que `server.js` démarre bien l'application sur le port configuré (3000 par défaut).
 
Checklist post-push (rapide)

- Sur votre machine locale: corrigez l'erreur TypeScript, commit & push sur `main` (ou la branche choisie).
- Sur le serveur, via SSH:

   cd /var/www/louaab; git fetch origin; git checkout main; git pull origin main
   chmod +x ./scripts/deploy.sh; ./scripts/deploy.sh main

- Vérifiez PM2: `pm2 status` et `pm2 logs louaab --lines 200`.

Si vous préférez automatiser via un webhook (GitHub Actions / deploy key), vous pouvez exécuter automatiquement le script après push — je peux fournir un exemple si vous voulez.
