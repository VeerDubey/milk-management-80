import { db } from './OfflineDatabase';
import { ElectronService } from '../ElectronService';

export class DataMigrationService {
  private readonly DATA_VERSION = '1.0.0';
  private readonly STORAGE_KEY = 'app_data_version';

  async initializeDefaultData() {
    console.log('🔄 Initializing default data for offline use...');

    try {
      // Check if data already exists
      const existingCustomers = await db.customers.count();
      const existingProducts = await db.products.count();

      if (existingCustomers === 0) {
        await this.seedCustomers();
      }

      if (existingProducts === 0) {
        await this.seedProducts();
      }

      // Set data version
      localStorage.setItem(this.STORAGE_KEY, this.DATA_VERSION);
      console.log('✅ Default data initialization complete');

    } catch (error) {
      console.error('❌ Failed to initialize default data:', error);
      throw error;
    }
  }

  private async seedCustomers() {
    const defaultCustomers = [
      {
        name: 'Sample Customer 1',
        phone: '9876543210',
        area: 'Main Market',
        address: 'Sample Address 1',
        gstNumber: '',
        centerId: 'default',
        balance: 0,
        creditLimit: 10000,
        isActive: true
      },
      {
        name: 'Sample Customer 2', 
        phone: '9876543211',
        area: 'Commercial Zone',
        address: 'Sample Address 2',
        gstNumber: '',
        centerId: 'default',
        balance: 0,
        creditLimit: 15000,
        isActive: true
      }
    ];

    for (const customer of defaultCustomers) {
      await db.addWithSync(db.customers, customer);
    }

    console.log('✅ Default customers seeded');
  }

  private async seedProducts() {
    const defaultProducts = [
      {
        name: 'Full Cream Milk',
        code: 'FCM001',
        price: 50,
        category: 'Dairy',
        unit: 'Liter',
        centerId: 'default',
        description: 'Fresh full cream milk',
        gstRate: 0,
        isActive: true,
        stock: 100,
        minStock: 10
      },
      {
        name: 'Toned Milk',
        code: 'TM001',
        price: 45,
        category: 'Dairy', 
        unit: 'Liter',
        centerId: 'default',
        description: 'Fresh toned milk',
        gstRate: 0,
        isActive: true,
        stock: 100,
        minStock: 10
      },
      {
        name: 'Paneer',
        code: 'PNR001',
        price: 300,
        category: 'Dairy',
        unit: 'Kg',
        centerId: 'default',
        description: 'Fresh cottage cheese',
        gstRate: 5,
        isActive: true,
        stock: 20,
        minStock: 5
      },
      {
        name: 'Curd',
        code: 'CRD001',
        price: 60,
        category: 'Dairy',
        unit: 'Kg',
        centerId: 'default',
        description: 'Fresh curd',
        gstRate: 0,
        isActive: true,
        stock: 50,
        minStock: 10
      }
    ];

    for (const product of defaultProducts) {
      await db.addWithSync(db.products, product);
    }

    console.log('✅ Default products seeded');
  }

  async exportAllData() {
    try {
      console.log('📤 Exporting all data...');

      const data = {
        version: this.DATA_VERSION,
        timestamp: new Date().toISOString(),
        customers: await db.customers.toArray(),
        products: await db.products.toArray(),
        orders: await db.orders.toArray(),
        invoices: await db.invoices.toArray(),
        payments: await db.payments.toArray(),
        trackSheets: await db.trackSheets.toArray()
      };

      const exportData = JSON.stringify(data, null, 2);
      const filename = `vikas-milk-center-backup-${new Date().toISOString().split('T')[0]}.json`;

      const result = await ElectronService.exportData(exportData, filename) as any;
      
      if (result.success) {
        console.log('✅ Data exported successfully');
        return { success: true, message: 'Data exported successfully' };
      } else {
        throw new Error(result.error || 'Export failed');
      }

    } catch (error) {
      console.error('❌ Export failed:', error);
      return { success: false, error: error.message };
    }
  }

  async importAllData() {
    try {
      console.log('📥 Importing data...');

      const result = await ElectronService.importData() as any;
      
      if (!result.success) {
        throw new Error(result.error || 'Import failed');
      }

      const importedData = JSON.parse(result.data);

      // Clear existing data
      await db.transaction('rw', [
        db.customers, db.products, db.orders, 
        db.invoices, db.payments, db.trackSheets
      ], async () => {
        await db.customers.clear();
        await db.products.clear();
        await db.orders.clear();
        await db.invoices.clear();
        await db.payments.clear();
        await db.trackSheets.clear();
      });

      // Import new data
      if (importedData.customers) await db.customers.bulkAdd(importedData.customers);
      if (importedData.products) await db.products.bulkAdd(importedData.products);
      if (importedData.orders) await db.orders.bulkAdd(importedData.orders);
      if (importedData.invoices) await db.invoices.bulkAdd(importedData.invoices);
      if (importedData.payments) await db.payments.bulkAdd(importedData.payments);
      if (importedData.trackSheets) await db.trackSheets.bulkAdd(importedData.trackSheets);

      console.log('✅ Data imported successfully');
      return { success: true, message: 'Data imported successfully' };

    } catch (error) {
      console.error('❌ Import failed:', error);
      return { success: false, error: error.message };
    }
  }

  async checkDataIntegrity() {
    try {
      const counts = {
        customers: await db.customers.count(),
        products: await db.products.count(),
        orders: await db.orders.count(),
        invoices: await db.invoices.count(),
        payments: await db.payments.count(),
        trackSheets: await db.trackSheets.count()
      };

      console.log('📊 Data integrity check:', counts);
      return counts;

    } catch (error) {
      console.error('❌ Data integrity check failed:', error);
      throw error;
    }
  }
}

export const dataMigration = new DataMigrationService();