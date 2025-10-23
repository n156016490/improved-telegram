# 🚀 Script de Déploiement Louaab

Ce script automatise le déploiement de l'application Louaab sur le serveur Ubuntu.

## 📋 Prérequis

- Serveur Ubuntu avec Node.js installé
- PM2 installé globalement (`npm install -g pm2`)
- Accès SSH au serveur
- Application clonée dans `/var/www/louaab`

## 🎯 Utilisation

### Sur le serveur Ubuntu :

```bash
# 1. Aller dans le répertoire de l'application
cd /var/www/louaab

# 2. Rendre le script exécutable (une seule fois)
chmod +x deploy.sh

# 3. Lancer le déploiement
./deploy.sh
```

## ✨ Ce que fait le script

1. ✅ Vérifie qu'il y a de nouveaux changements sur GitHub
2. 📥 Télécharge les derniers changements (`git pull`)
3. 📦 Installe/met à jour les dépendances npm
4. 🧹 Nettoie le cache Next.js (`.next/` et `out/`)
5. 🔨 Rebuild l'application (`npm run build`)
6. 🔄 Redémarre PM2 avec les nouvelles variables
7. 🩺 Effectue un test de santé de l'application
8. 📊 Affiche les logs récents

## 🎨 Messages colorés

- 🟢 **Vert** : Succès
- 🔵 **Bleu** : Information
- 🔴 **Rouge** : Erreur
- 🟡 **Jaune** : Avertissement

## 🛡️ Sécurité

Le script :
- Vérifie qu'il est exécuté dans le bon répertoire
- S'arrête en cas d'erreur critique
- Sauvegarde l'état actuel avant de mettre à jour
- Propose de continuer si aucun changement détecté

## 📝 Exemple de sortie

```
🚀 Démarrage du déploiement de Louaab...
========================================
ℹ Répertoire actuel: /var/www/louaab
ℹ Commit actuel: 8518fc2
ℹ Récupération des changements depuis GitHub...
✓ Nouveaux changements détectés !
✓ Code mis à jour avec succès
ℹ Nouveau commit: a1b2c3d
✓ Dépendances installées
✓ Cache nettoyé
✓ Build réussi !
✓ Application redémarrée
✓ L'application répond correctement !
✓ Déploiement terminé avec succès ! 🎉
```

## 🔧 Dépannage

### Le script n'est pas exécutable
```bash
chmod +x deploy.sh
```

### Erreur "package.json non trouvé"
Assurez-vous d'être dans `/var/www/louaab`

### Erreur lors du build
Vérifiez les logs affichés et corrigez les erreurs TypeScript/ESLint

### L'application ne répond pas
```bash
pm2 logs louaab --lines 50
```

## 🔄 Workflow recommandé

### En local (Windows) :
```powershell
# 1. Faire vos modifications
# 2. Tester localement
npm run dev

# 3. Committer et pusher
git add .
git commit -m "Description des changements"
git push origin master
```

### Sur le serveur (Ubuntu) :
```bash
# 4. Déployer automatiquement
cd /var/www/louaab
./deploy.sh
```

## 💡 Astuces

- Pensez à vider le cache du navigateur après un déploiement (`Ctrl + Shift + R`)
- Surveillez les logs PM2 : `pm2 logs louaab`
- Vérifiez le statut : `pm2 status`
- Redémarrez manuellement si besoin : `pm2 restart louaab`

## 📞 Support

En cas de problème, vérifiez :
1. Les logs du build (affichés par le script)
2. Les logs PM2 : `pm2 logs louaab --lines 100`
3. Le statut Nginx : `sudo systemctl status nginx`
4. Les logs Nginx : `sudo tail -f /var/log/nginx/error.log`
