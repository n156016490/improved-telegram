export interface OrderItem {
  toyName: string;
  duration: string;
  startDate: string;
  startTime: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

// Pas de données fictives - seules les vraies commandes seront affichées
const sampleOrders: Order[] = [];

export class OrderManager {
  private static STORAGE_KEY = 'louaab-orders';

  static generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }

  // Cette fonction ne charge plus de données fictives
  static initializeSampleData(): void {
    // Ne fait rien - seules les vraies commandes seront affichées
  }

  static saveOrder(order: Order): void {
    const orders = this.getAllOrders();
    orders.push(order);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
  }

  static getAllOrders(): Order[] {
    try {
      const orders = localStorage.getItem(this.STORAGE_KEY);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      return [];
    }
  }

  static updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getAllOrders();
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedOrders));
  }

  static getOrderById(orderId: string): Order | null {
    const orders = this.getAllOrders();
    return orders.find(order => order.id === orderId) || null;
  }

  static getOrdersByStatus(status: Order['status']): Order[] {
    const orders = this.getAllOrders();
    return orders.filter(order => order.status === status);
  }

  static getPendingOrders(): Order[] {
    return this.getOrdersByStatus('pending');
  }

  static getOrdersCount(): number {
    return this.getAllOrders().length;
  }

  static getPendingOrdersCount(): number {
    return this.getPendingOrders().length;
  }

  static getTotalRevenue(): number {
    const orders = this.getAllOrders();
    return orders.reduce((sum, order) => sum + order.totalPrice, 0);
  }
}
