/**
 * Maintenance Mode Manager
 * Gère l'activation/désactivation du mode maintenance
 */

export interface MaintenanceConfig {
  isActive: boolean;
  message: string;
  updatedAt: string;
}

export class MaintenanceManager {
  private static readonly STORAGE_KEY = 'louaab_maintenance_mode';

  /**
   * Vérifie si le mode maintenance est activé
   */
  static isMaintenanceModeActive(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const config = this.getMaintenanceConfig();
      return config.isActive;
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
      return false;
    }
  }

  /**
   * Récupère la configuration du mode maintenance
   */
  static getMaintenanceConfig(): MaintenanceConfig {
    if (typeof window === 'undefined') {
      return {
        isActive: false,
        message: 'Site en maintenance. Nous revenons bientôt !',
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading maintenance config:', error);
    }

    // Configuration par défaut
    return {
      isActive: false,
      message: 'Site en maintenance. Nous revenons bientôt !',
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Active le mode maintenance
   */
  static enableMaintenance(message?: string): void {
    const config: MaintenanceConfig = {
      isActive: true,
      message: message || 'Site en maintenance. Nous revenons bientôt !',
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error enabling maintenance mode:', error);
      throw error;
    }
  }

  /**
   * Désactive le mode maintenance
   */
  static disableMaintenance(): void {
    const config: MaintenanceConfig = {
      isActive: false,
      message: 'Site en maintenance. Nous revenons bientôt !',
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error disabling maintenance mode:', error);
      throw error;
    }
  }

  /**
   * Met à jour le message de maintenance
   */
  static updateMessage(message: string): void {
    const config = this.getMaintenanceConfig();
    config.message = message;
    config.updatedAt = new Date().toISOString();

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error updating maintenance message:', error);
      throw error;
    }
  }
}
