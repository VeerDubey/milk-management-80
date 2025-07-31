import { ECommerceStore } from '@/types/pro';
import { ProLicenseService } from './ProLicenseService';

export class ECommerceService {
  private static stores: ECommerceStore[] = [];
  private static products: any[] = [];
  private static orders: any[] = [];

  static async createStore(storeData: Omit<ECommerceStore, 'id' | 'createdAt'>): Promise<ECommerceStore> {
    if (!ProLicenseService.hasFeature('ecommerce')) {
      throw new Error('E-commerce feature not available in current license');
    }

    const store: ECommerceStore = {
      id: `store_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...storeData,
      createdAt: new Date().toISOString()
    };

    this.stores.push(store);
    localStorage.setItem('ecommerce_stores', JSON.stringify(this.stores));

    return store;
  }

  static getStores(): ECommerceStore[] {
    const stored = localStorage.getItem('ecommerce_stores');
    if (stored) {
      this.stores = JSON.parse(stored);
    }
    return this.stores;
  }

  static getStore(storeId: string): ECommerceStore | undefined {
    return this.stores.find(s => s.id === storeId);
  }

  static async updateStore(storeId: string, updates: Partial<ECommerceStore>): Promise<void> {
    const storeIndex = this.stores.findIndex(s => s.id === storeId);
    if (storeIndex >= 0) {
      this.stores[storeIndex] = { ...this.stores[storeIndex], ...updates };
      localStorage.setItem('ecommerce_stores', JSON.stringify(this.stores));
    }
  }

  static async addProduct(storeId: string, productData: any): Promise<any> {
    const product = {
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      storeId,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.products.push(product);
    localStorage.setItem('ecommerce_products', JSON.stringify(this.products));

    return product;
  }

  static getProducts(storeId?: string): any[] {
    const stored = localStorage.getItem('ecommerce_products');
    if (stored) {
      this.products = JSON.parse(stored);
    }

    return storeId ? this.products.filter(p => p.storeId === storeId) : this.products;
  }

  static async updateProduct(productId: string, updates: any): Promise<void> {
    const productIndex = this.products.findIndex(p => p.id === productId);
    if (productIndex >= 0) {
      this.products[productIndex] = { 
        ...this.products[productIndex], 
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('ecommerce_products', JSON.stringify(this.products));
    }
  }

  static async createOrder(orderData: any): Promise<any> {
    const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.push(order);
    localStorage.setItem('ecommerce_orders', JSON.stringify(this.orders));

    return order;
  }

  static getOrders(storeId?: string): any[] {
    const stored = localStorage.getItem('ecommerce_orders');
    if (stored) {
      this.orders = JSON.parse(stored);
    }

    return storeId ? this.orders.filter(o => o.storeId === storeId) : this.orders;
  }

  static async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const orderIndex = this.orders.findIndex(o => o.id === orderId);
    if (orderIndex >= 0) {
      this.orders[orderIndex] = { 
        ...this.orders[orderIndex], 
        status,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('ecommerce_orders', JSON.stringify(this.orders));
    }
  }

  static generateStorefront(storeId: string): string {
    const store = this.getStore(storeId);
    if (!store) {
      throw new Error('Store not found');
    }

    const products = this.getProducts(storeId);
    
    // Generate basic HTML storefront
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${store.name} - Online Store</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .products { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
        .product { border: 1px solid #ddd; border-radius: 8px; padding: 15px; }
        .product img { width: 100%; height: 200px; object-fit: cover; }
        .price { font-size: 18px; font-weight: bold; color: #007bff; }
        .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${store.name}</h1>
        <p>Fresh dairy products delivered to your door</p>
    </div>
    
    <div class="products">
        ${products.map(product => `
            <div class="product">
                <img src="${product.image || '/placeholder.svg'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description || ''}</p>
                <div class="price">${store.settings.currency} ${product.price}</div>
                <button class="btn" onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
        `).join('')}
    </div>
    
    <script>
        function addToCart(productId) {
            alert('Product added to cart! (Integration pending)');
        }
    </script>
</body>
</html>
    `;

    return html;
  }

  static getAnalytics(storeId: string): any {
    const products = this.getProducts(storeId);
    const orders = this.getOrders(storeId);
    
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusDistribution = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyRevenue = this.calculateMonthlyRevenue(orders);

    return {
      totalProducts,
      totalOrders,
      totalRevenue,
      avgOrderValue,
      statusDistribution,
      monthlyRevenue
    };
  }

  private static calculateMonthlyRevenue(orders: any[]): Record<string, number> {
    return orders.reduce((acc, order) => {
      const month = new Date(order.createdAt).toISOString().substr(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + (order.total || 0);
      return acc;
    }, {} as Record<string, number>);
  }

  static async setupPaymentGateway(storeId: string, gatewayConfig: any): Promise<void> {
    const store = this.getStore(storeId);
    if (store) {
      store.settings.paymentMethods = gatewayConfig.methods || [];
      await this.updateStore(storeId, store);
    }
  }

  static async setupShipping(storeId: string, shippingConfig: any): Promise<void> {
    const store = this.getStore(storeId);
    if (store) {
      store.settings.shippingZones = shippingConfig.zones || [];
      await this.updateStore(storeId, store);
    }
  }
}