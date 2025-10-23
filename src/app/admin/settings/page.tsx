"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthManager, AdminUser } from "@/lib/auth";
import { useNotifications } from "@/components/notification-toast";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  Shield,
  User,
  Calendar,
  Clock,
  ArrowLeft
} from "lucide-react";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminUser | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useNotifications();

  useEffect(() => {
    // Vérifier l'authentification
    if (!AuthManager.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    // Charger les informations admin
    const admin = AuthManager.getAdminInfo();
    setAdminInfo(admin);
    if (admin) {
      setNewUsername(admin.username);
    }
  }, [router]);

  const handleUsernameChange = () => {
    if (!newUsername || newUsername.trim().length < 3) {
      showError("Nom invalide", "Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }

    const success = AuthManager.changeUsername(newUsername.trim());
    if (success) {
      showSuccess("Nom modifié", "Votre nom d'utilisateur a été mis à jour !");
      setAdminInfo(prev => prev ? { ...prev, username: newUsername.trim() } : null);
      setIsEditingUsername(false);
    } else {
      showError("Erreur", "Impossible de modifier le nom d'utilisateur");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation des mots de passe
      if (newPassword !== confirmPassword) {
        showError("Erreur de validation", "Les nouveaux mots de passe ne correspondent pas");
        setIsLoading(false);
        return;
      }

      const passwordValidation = AuthManager.validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        showError("Mot de passe invalide", "Le mot de passe ne respecte pas les critères de sécurité");
        passwordValidation.errors.forEach(error => showWarning("Critère non respecté", error));
        setIsLoading(false);
        return;
      }

      const success = await AuthManager.changePassword(currentPassword, newPassword);
      
      if (success) {
        showSuccess("Mot de passe modifié", "Votre mot de passe a été mis à jour avec succès !");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showError("Échec de modification", "Mot de passe actuel incorrect");
      }
    } catch (error) {
      showError("Erreur système", "Une erreur s'est produite lors du changement de mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    return {
      score,
      level: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong',
      color: score < 2 ? 'text-coral' : score < 4 ? 'text-sunshine-yellow' : 'text-mint'
    };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  if (!adminInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint mx-auto"></div>
          <p className="mt-4 text-slate">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-mint transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au dashboard
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-bold text-charcoal">Paramètres Admin</h1>
                <p className="text-sm text-gray-600">Gestion de la sécurité et des accès</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Admin Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-mint/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-mint" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-charcoal">Informations Admin</h2>
                  <p className="text-sm text-slate">Compte administrateur</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-slate" />
                      <p className="text-sm font-medium text-charcoal">Nom d'utilisateur</p>
                    </div>
                    {!isEditingUsername && (
                      <button
                        onClick={() => setIsEditingUsername(true)}
                        className="text-xs text-mint hover:text-fresh-green transition-colors"
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                  {isEditingUsername ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint focus:border-mint"
                        placeholder="Nouveau nom"
                      />
                      <button
                        onClick={handleUsernameChange}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-mint rounded-lg hover:bg-fresh-green transition-colors"
                      >
                        OK
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingUsername(false);
                          setNewUsername(adminInfo.username);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate">{adminInfo.username}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">Compte créé</p>
                    <p className="text-sm text-slate">
                      {new Date(adminInfo.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {adminInfo.lastLogin && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate" />
                    <div>
                      <p className="text-sm font-medium text-charcoal">Dernière connexion</p>
                      <p className="text-sm text-slate">
                        {new Date(adminInfo.lastLogin).toLocaleDateString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-slate" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">Statut</p>
                    <span className="inline-flex items-center gap-1 text-sm text-mint">
                      <CheckCircle className="w-4 h-4" />
                      Actif
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-sky-blue/20 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-sky-blue" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-charcoal">Changer le mot de passe</h2>
                  <p className="text-sm text-slate">Mettez à jour votre mot de passe pour plus de sécurité</p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-charcoal mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate" />
                    </div>
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="block w-full pl-10 pr-12 py-3 border border-mist rounded-xl focus:ring-2 focus:ring-mint focus:border-mint transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-slate hover:text-charcoal transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate hover:text-charcoal transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-charcoal mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate" />
                    </div>
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full pl-10 pr-12 py-3 border border-mist rounded-xl focus:ring-2 focus:ring-mint focus:border-mint transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-slate hover:text-charcoal transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate hover:text-charcoal transition-colors" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate">Force du mot de passe:</span>
                        <span className={`text-xs font-medium ${passwordStrength.color}`}>
                          {passwordStrength.level === 'weak' ? 'Faible' : 
                           passwordStrength.level === 'medium' ? 'Moyen' : 'Fort'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full ${
                              level <= passwordStrength.score
                                ? passwordStrength.level === 'weak' ? 'bg-coral' :
                                  passwordStrength.level === 'medium' ? 'bg-sunshine-yellow' : 'bg-mint'
                                : 'bg-mist'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-12 py-3 border border-mist rounded-xl focus:ring-2 focus:ring-mint focus:border-mint transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-slate hover:text-charcoal transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate hover:text-charcoal transition-colors" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {confirmPassword && (
                    <div className="mt-2 flex items-center gap-2">
                      {newPassword === confirmPassword ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-mint" />
                          <span className="text-xs text-mint">Les mots de passe correspondent</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-coral" />
                          <span className="text-xs text-coral">Les mots de passe ne correspondent pas</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  className="w-full bg-mint text-white py-3 px-4 rounded-xl font-medium hover:bg-mint/90 focus:ring-2 focus:ring-mint focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Modification...
                    </div>
                  ) : (
                    "Modifier le mot de passe"
                  )}
                </button>
              </form>

              {/* Security Requirements */}
              <div className="mt-6 p-4 bg-sky-blue/10 rounded-xl border border-sky-blue/20">
                <h3 className="text-sm font-medium text-charcoal mb-3">Critères de sécurité</h3>
                <ul className="text-xs text-slate space-y-1">
                  <li>• Au moins 8 caractères</li>
                  <li>• Une majuscule et une minuscule</li>
                  <li>• Au moins un chiffre</li>
                  <li>• Au moins un caractère spécial</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
