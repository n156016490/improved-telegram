"use client";

import { useState, useEffect } from "react";
import { MaintenanceManager } from "@/lib/maintenance";
import { useNotifications } from "@/components/notification-toast";
import { Wrench, Power, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MaintenancePage() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    // Charger l'état du mode maintenance
    const maintenanceConfig = MaintenanceManager.getMaintenanceConfig();
    setIsMaintenanceMode(maintenanceConfig.isActive);
    setMaintenanceMessage(maintenanceConfig.message);
    setLastUpdated(maintenanceConfig.updatedAt);
  }, []);

  const handleMaintenanceModeToggle = () => {
    try {
      if (isMaintenanceMode) {
        MaintenanceManager.disableMaintenance();
        setIsMaintenanceMode(false);
        setLastUpdated(new Date().toISOString());
        showSuccess("Mode maintenance désactivé", "Le site est maintenant accessible à tous.");
      } else {
        MaintenanceManager.enableMaintenance(maintenanceMessage);
        setIsMaintenanceMode(true);
        setLastUpdated(new Date().toISOString());
        showSuccess("Mode maintenance activé", "Le site affiche maintenant un message de maintenance.");
      }
    } catch (error) {
      showError("Erreur", "Impossible de changer le mode maintenance.");
    }
  };

  const handleMaintenanceMessageUpdate = () => {
    if (maintenanceMessage.trim().length < 10) {
      showError("Message trop court", "Le message doit contenir au moins 10 caractères.");
      return;
    }

    try {
      MaintenanceManager.updateMessage(maintenanceMessage);
      setLastUpdated(new Date().toISOString());
      showSuccess("Message mis à jour", "Le message de maintenance a été modifié.");
    } catch (error) {
      showError("Erreur", "Impossible de mettre à jour le message.");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-charcoal transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-charcoal flex items-center gap-3">
                  <Wrench className="h-7 w-7 text-orange-600" />
                  Mode Maintenance
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Gérez l'accessibilité du site pendant les mises à jour
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Statut actuel - Grande carte */}
        <div className={`mb-8 rounded-2xl p-8 shadow-lg border-2 ${
          isMaintenanceMode
            ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300'
            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`rounded-full p-5 ${
                isMaintenanceMode ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {isMaintenanceMode ? (
                  <AlertTriangle className="h-10 w-10 text-red-600" />
                ) : (
                  <CheckCircle className="h-10 w-10 text-green-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-charcoal mb-1">
                  {isMaintenanceMode ? 'Site en Maintenance' : 'Site en Ligne'}
                </h2>
                <p className="text-sm text-gray-600">
                  Dernière mise à jour : {formatDate(lastUpdated)}
                </p>
              </div>
            </div>
            <button
              onClick={handleMaintenanceModeToggle}
              className={`inline-flex items-center gap-3 rounded-xl px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-105 ${
                isMaintenanceMode
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <Power className="h-5 w-5" />
              {isMaintenanceMode ? 'Désactiver Maintenance' : 'Activer Maintenance'}
            </button>
          </div>
        </div>

        {/* Configuration du message */}
        <div className="rounded-xl bg-white p-8 shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-charcoal mb-2">
            Message de Maintenance
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Ce message sera affiché aux visiteurs lorsque le mode maintenance est activé.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Texte du message
              </label>
              <textarea
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                placeholder="Site en maintenance. Nous revenons bientôt !"
              />
              <p className="text-xs text-gray-500 mt-2">
                Minimum 10 caractères • {maintenanceMessage.length} / 200
              </p>
            </div>

            <button
              onClick={handleMaintenanceMessageUpdate}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-bold text-white hover:bg-orange-700 transition"
            >
              Enregistrer le message
            </button>
          </div>
        </div>

        {/* Informations & Avertissements */}
        <div className="mt-8 rounded-xl bg-blue-50 p-6 border border-blue-200">
          <h4 className="font-bold text-charcoal mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            Important à savoir
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Le mode maintenance utilise le <strong>localStorage</strong> du navigateur. 
                Il fonctionne uniquement côté client.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Les administrateurs peuvent toujours accéder aux pages admin même en mode maintenance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Pensez à désactiver le mode maintenance après vos travaux pour rendre le site accessible.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                Les visiteurs qui étaient déjà sur le site devront rafraîchir la page pour voir le message.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
