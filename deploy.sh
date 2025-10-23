#!/bin/bash

# Script de déploiement automatique pour Louaab
# Usage: ./deploy.sh

echo "🚀 Démarrage du déploiement de Louaab..."
echo "========================================"

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

error() {
    echo -e "${RED}✗ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    error "Erreur: package.json non trouvé. Exécutez ce script depuis /var/www/louaab"
    exit 1
fi

info "Répertoire actuel: $(pwd)"

# 1. Sauvegarder le commit actuel
CURRENT_COMMIT=$(git rev-parse --short HEAD)
info "Commit actuel: $CURRENT_COMMIT"

# 2. Récupérer les derniers changements
info "Récupération des changements depuis GitHub..."
git fetch origin master

# Vérifier s'il y a des changements
UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    warning "Aucun changement détecté. Le code est déjà à jour."
    read -p "Voulez-vous rebuilder quand même ? (o/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        exit 0
    fi
else
    success "Nouveaux changements détectés !"
fi

# 3. Pull les changements
info "Téléchargement des changements..."
if git pull origin master; then
    success "Code mis à jour avec succès"
    NEW_COMMIT=$(git rev-parse --short HEAD)
    info "Nouveau commit: $NEW_COMMIT"
else
    error "Erreur lors du git pull"
    exit 1
fi

# 4. Vérifier les dépendances
info "Vérification des dépendances npm..."
if npm ci --production=false; then
    success "Dépendances installées"
else
    warning "Erreur avec npm ci, tentative avec npm install..."
    npm install
fi

# 5. Nettoyer le cache Next.js
info "Nettoyage du cache Next.js..."
rm -rf .next
rm -rf out
success "Cache nettoyé"

# 6. Rebuild de l'application
info "Construction de l'application Next.js..."
if npm run build; then
    success "Build réussi !"
    
    # Afficher quelques infos sur le build
    if [ -d ".next" ]; then
        BUILD_SIZE=$(du -sh .next | cut -f1)
        info "Taille du build: $BUILD_SIZE"
    fi
else
    error "Erreur lors du build"
    error "Vérifiez les logs ci-dessus pour plus de détails"
    exit 1
fi

# 7. Redémarrer PM2
info "Redémarrage de l'application avec PM2..."
if pm2 restart louaab --update-env; then
    success "Application redémarrée"
else
    error "Erreur lors du redémarrage PM2"
    exit 1
fi

# 8. Attendre que l'app soit prête
info "Attente du démarrage de l'application..."
sleep 3

# 9. Vérifier le statut PM2
info "Statut de l'application:"
pm2 status louaab

# 10. Test de santé
info "Test de l'application sur localhost:3000..."
if curl -f -s http://localhost:3000 > /dev/null; then
    success "L'application répond correctement !"
else
    warning "L'application ne répond pas encore, vérifiez les logs PM2"
fi

# 11. Afficher les logs récents
info "Logs récents de l'application:"
pm2 logs louaab --lines 20 --nostream

echo ""
echo "========================================"
success "Déploiement terminé avec succès ! 🎉"
echo ""
info "Prochaines étapes:"
echo "  • Testez le site: https://louaab.ma"
echo "  • Vérifiez les logs: pm2 logs louaab"
echo "  • Videz le cache du navigateur (Ctrl+Shift+R)"
echo ""
