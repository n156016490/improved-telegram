"use client";

import { useState, useEffect } from "react";
import { OrderManager, Order } from "@/lib/orders";
import { PackManager } from "@/lib/packs";
import { DashboardMetricsCalculator, DashboardMetrics } from "@/lib/dashboard-metrics";
import { MaintenanceManager } from "@/lib/maintenance";
import { useNotifications } from "@/components/notification-toast";
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Phone, 
  Calendar,
  User,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
  Star,
  Timer,
  RefreshCw,
  Truck,
  Wrench,
  Power
} from "lucide-react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [packs, setPacks] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState<string>('');
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  useEffect(() => {
    // Charger les commandes depuis le stockage (sans initialiser de données fictives)
    const loadedOrders = OrderManager.getAllOrders();
    setOrders(loadedOrders);
    
    // Charger les packs
    const loadedPacks = PackManager.getAllPacks();
    setPacks(loadedPacks);
    
    // Calculer les métriques réelles
    const calculatedMetrics = DashboardMetricsCalculator.calculateMetrics(loadedOrders, loadedPacks);
    setMetrics(calculatedMetrics);
    
    // Charger l'état du mode maintenance
    const maintenanceConfig = MaintenanceManager.getMaintenanceConfig();
    setIsMaintenanceMode(maintenanceConfig.isActive);
    setMaintenanceMessage(maintenanceConfig.message);
    
    // Obtenir les commandes récentes
    const recent = DashboardMetricsCalculator.getRecentOrders(loadedOrders);
    setRecentOrders(recent);
    
    // Obtenir les alertes importantes
    const importantAlerts = DashboardMetricsCalculator.getImportantAlerts(loadedOrders, calculatedMetrics);
    setAlerts(importantAlerts);
    
    // Afficher une notification de bienvenue
    showInfo(
      "Dashboard Admin", 
      `Bienvenue ! ${loadedOrders.length} commandes chargées.`,
      3000
    );
  }, []);

  const handleMaintenanceModeToggle = () => {
    try {
      if (isMaintenanceMode) {
        MaintenanceManager.disableMaintenance();
        setIsMaintenanceMode(false);
        showSuccess("Mode maintenance désactivé", "Le site est maintenant accessible à tous.", 3000);
      } else {
        MaintenanceManager.enableMaintenance(maintenanceMessage);
        setIsMaintenanceMode(true);
        showSuccess("Mode maintenance activé", "Le site affiche maintenant un message de maintenance.", 3000);
      }
    } catch (error) {
      showError("Erreur", "Impossible de changer le mode maintenance.", 3000);
    }
  };

  const handleMaintenanceMessageUpdate = () => {
    try {
      MaintenanceManager.updateMessage(maintenanceMessage);
      showSuccess("Message mis à jour", "Le message de maintenance a été modifié.", 3000);
    } catch (error) {
      showError("Erreur", "Impossible de mettre à jour le message.", 3000);
    }
  };

  const filteredOrders = orders.filter(order => 
    selectedStatus === 'all' || order.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    OrderManager.updateOrderStatus(orderId, newStatus as any);
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));

    // Notifications selon le statut
    switch (newStatus) {
      case 'confirmed':
        showSuccess(
          "Commande confirmée",
          `La commande ${orderId} de ${order.customerName} a été confirmée.`,
          4000
        );
        break;
      case 'completed':
        showSuccess(
          "Commande terminée",
          `La commande ${orderId} de ${order.customerName} a été marquée comme terminée.`,
          4000
        );
        break;
      case 'cancelled':
        showWarning(
          "Commande annulée",
          `La commande ${orderId} de ${order.customerName} a été annulée.`,
          4000
        );
        break;
    }
  };

  const formatDate = (dateString: string) => {
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
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a 
                href="/" 
                className="text-sm text-gray-600 hover:text-mint transition-colors"
              >
                ← Retour au site
              </a>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-bold text-charcoal">Dashboard Admin</h1>
                <p className="text-sm text-gray-600">Gérez les commandes et les réservations</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/admin/orders"
                className="flex items-center gap-2 rounded-lg bg-mint/10 px-3 py-2 text-sm font-medium text-mint hover:bg-mint/20 transition"
              >
                <ShoppingCart className="h-4 w-4" />
                Commandes
              </a>
              <a
                href="/admin/inventory"
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                <Package className="h-4 w-4" />
                Inventaire
              </a>
              <a
                href="/admin/pack-reservations"
                className="flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200 transition"
              >
                <Package className="h-4 w-4" />
                Réservations
              </a>
              <a
                href="/admin/packs"
                className="flex items-center gap-2 rounded-lg bg-orange-100 px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-200 transition"
              >
                <Package className="h-4 w-4" />
                Gérer Packs
              </a>
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Métriques réelles du dashboard */}
        {metrics && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Abonnements actifs */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate">Abonnements actifs</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {metrics.activeSubscriptions}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {metrics.subscriptionGrowth > 0 ? '+' : ''}{metrics.subscriptionGrowth}%
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Jouets en circulation */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate">Jouets en circulation</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {metrics.toysInCirculation}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {metrics.toysGrowth > 0 ? '+' : ''}{metrics.toysGrowth}%
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Livraisons du jour */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate">Livraisons du jour</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {metrics.todaysDeliveries}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {metrics.inProgressDeliveries} en cours
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-3">
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Satisfaction NPS */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate">Satisfaction (NPS)</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {metrics.npsScore}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {metrics.npsImprovement > 0 ? '+' : ''}{metrics.npsImprovement} pts
                  </p>
                </div>
                <div className="rounded-full bg-yellow-100 p-3">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Mode Maintenance */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 p-6 shadow-sm border border-orange-200">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-orange-100 p-3">
              <Wrench className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-charcoal mb-2">Mode Maintenance</h3>
              <p className="text-sm text-slate mb-4">
                Activez le mode maintenance pour afficher un message aux visiteurs pendant les mises à jour du site.
              </p>
              
              <div className="space-y-4">
                {/* Statut actuel */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-charcoal">Statut:</span>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    isMaintenanceMode 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    <Power className="h-3 w-3" />
                    {isMaintenanceMode ? 'Mode Maintenance Actif' : 'Site en Ligne'}
                  </span>
                </div>

                {/* Message de maintenance */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Message affiché aux visiteurs :
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={maintenanceMessage}
                      onChange={(e) => setMaintenanceMessage(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Site en maintenance. Nous revenons bientôt !"
                    />
                    <button
                      onClick={handleMaintenanceMessageUpdate}
                      className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
                    >
                      Mettre à jour
                    </button>
                  </div>
                </div>

                {/* Bouton toggle */}
                <button
                  onClick={handleMaintenanceModeToggle}
                  className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition ${
                    isMaintenanceMode
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  <Power className="h-4 w-4" />
                  {isMaintenanceMode ? 'Désactiver le Mode Maintenance' : 'Activer le Mode Maintenance'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Métriques secondaires */}
        {metrics && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Temps de traitement moyen */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate">Temps de traitement moyen</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {metrics.averageProcessingTime} min
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Temps moyen
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3">
                  <Timer className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Taux de renouvellement */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate">Taux de renouvellement</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {metrics.renewalRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Clients fidèles
                  </p>
                </div>
                <div className="rounded-full bg-mint/10 p-3">
                  <RefreshCw className="h-6 w-6 text-mint" />
                </div>
              </div>
            </div>

            {/* Revenu mensuel */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate">Revenu mensuel</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {metrics.monthlyRevenue.toLocaleString()} MAD
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ce mois-ci
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Commandes en attente */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate">Commandes en attente</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {orders.filter(o => o.status === 'pending').length > 0 
                      ? "⚠️ Action requise" 
                      : "✅ À jour"}
                  </p>
                </div>
                <div className="rounded-full bg-yellow-100 p-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alertes réelles calculées */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-charcoal mb-4">Alertes & Notifications</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {alerts.map((alert, index) => (
                <div 
                  key={index}
                  className={`rounded-lg border p-4 ${
                    alert.type === 'error' ? 'bg-red-50 border-red-200' :
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    alert.type === 'success' ? 'bg-green-50 border-green-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {alert.type === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                    {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                    {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {alert.type === 'info' && <Clock className="h-5 w-5 text-blue-600" />}
                    <div>
                      <h4 className={`text-sm font-semibold ${
                        alert.type === 'error' ? 'text-red-800' :
                        alert.type === 'warning' ? 'text-yellow-800' :
                        alert.type === 'success' ? 'text-green-800' :
                        'text-blue-800'
                      }`}>
                        {alert.title}
                      </h4>
                      <p className={`text-sm ${
                        alert.type === 'error' ? 'text-red-700' :
                        alert.type === 'warning' ? 'text-yellow-700' :
                        alert.type === 'success' ? 'text-green-700' :
                        'text-blue-700'
                      }`}>
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Commandes récentes */}
        {recentOrders.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-charcoal mb-4">Commandes récentes</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-mint/10 p-2">
                        <ShoppingCart className="h-4 w-4 text-mint" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-charcoal text-sm">{order.id}</h4>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status === 'pending' ? 'En attente' : 
                       order.status === 'confirmed' ? 'Confirmée' :
                       order.status === 'completed' ? 'Terminée' : 'Annulée'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{order.customerPhone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{order.items.length} article(s)</span>
                      <span className="text-sm font-semibold text-charcoal">{order.totalPrice} MAD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedStatus === 'all' 
                  ? 'bg-mint text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedStatus === 'pending' 
                  ? 'bg-mint text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setSelectedStatus('confirmed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedStatus === 'confirmed' 
                  ? 'bg-mint text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Confirmées
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedStatus === 'completed' 
                  ? 'bg-mint text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Terminées
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-mint/10 p-2">
                    <ShoppingCart className="h-5 w-5 text-mint" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">{order.id}</h3>
                    <p className="text-sm text-slate">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status === 'pending' ? 'En attente' : 
                     order.status === 'confirmed' ? 'Confirmée' :
                     order.status === 'completed' ? 'Terminée' : 'Annulée'}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200"
                  >
                    <Eye className="h-4 w-4" />
                    Voir
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-slate">Client</p>
                    <p className="text-sm font-medium text-charcoal">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-slate">Téléphone</p>
                    <p className="text-sm font-medium text-charcoal">{order.customerPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-slate">Articles</p>
                    <p className="text-sm font-medium text-charcoal">{order.items.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-slate">Total</p>
                    <p className="text-sm font-medium text-charcoal">{order.totalPrice} MAD</p>
                  </div>
                </div>
              </div>

              {order.status === 'pending' && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => updateOrderStatus(order.id, 'confirmed')}
                    className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Confirmer
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    className="flex items-center gap-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                  >
                    <XCircle className="h-4 w-4" />
                    Annuler
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-charcoal">Détails de la commande</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-slate">Client</p>
                    <p className="text-charcoal">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate">Téléphone</p>
                    <p className="text-charcoal">{selectedOrder.customerPhone}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate mb-2">Articles commandés</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="rounded-lg bg-gray-50 p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-charcoal">{item.toyName}</p>
                            <p className="text-sm text-slate">
                              {item.duration} • {item.startDate} à {item.startTime}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-charcoal">{item.price} MAD</p>
                            <p className="text-sm text-slate">x{item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-charcoal">Total</span>
                    <span className="text-lg font-bold text-mint">{selectedOrder.totalPrice} MAD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
