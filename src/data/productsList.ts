import { Product } from '@/types';

export const productsList: Omit<Product, 'id'>[] = [
  { name: "Whole Milk", code: "WM001", price: 45, category: "Dairy", unit: "Liter", description: "Fresh whole milk", gstRate: 5, stock: 100, minStock: 20, costPrice: 40, isActive: true },
  { name: "Toned Milk", code: "TM002", price: 42, category: "Dairy", unit: "Liter", description: "Toned milk with reduced fat content", gstRate: 5, stock: 80, minStock: 15, costPrice: 38, isActive: true },
  { name: "Butter", code: "BT003", price: 250, category: "Dairy", unit: "500g", description: "Fresh butter", gstRate: 12, stock: 50, minStock: 10, costPrice: 220, isActive: true },
  { name: "Cheese", code: "CH004", price: 300, category: "Dairy", unit: "200g", description: "Fresh cheese", gstRate: 12, stock: 30, minStock: 8, costPrice: 260, isActive: true },
  { name: "Yogurt", code: "YG005", price: 60, category: "Dairy", unit: "500g", description: "Fresh yogurt", gstRate: 5, stock: 70, minStock: 12, costPrice: 50, isActive: true },
  { name: "Paneer", code: "PN006", price: 350, category: "Dairy", unit: "250g", description: "Fresh paneer", gstRate: 5, stock: 25, minStock: 5, costPrice: 320, isActive: true },
  { name: "Ghee", code: "GH007", price: 450, category: "Dairy", unit: "500ml", description: "Pure ghee", gstRate: 5, stock: 40, minStock: 8, costPrice: 400, isActive: true },
  { name: "Cream", code: "CR008", price: 80, category: "Dairy", unit: "200ml", description: "Fresh cream", gstRate: 12, stock: 35, minStock: 7, costPrice: 70, isActive: true },
  { name: "Buttermilk", code: "BM009", price: 25, category: "Dairy", unit: "500ml", description: "Fresh buttermilk", gstRate: 5, stock: 60, minStock: 15, costPrice: 20, isActive: true },
  { name: "Lassi", code: "LS010", price: 40, category: "Dairy", unit: "300ml", description: "Sweet lassi", gstRate: 5, stock: 45, minStock: 10, costPrice: 32, isActive: true },
  { name: "Ice Cream", code: "IC011", price: 120, category: "Dairy", unit: "500ml", description: "Vanilla ice cream", gstRate: 18, stock: 20, minStock: 5, costPrice: 100, isActive: true },
  { name: "Condensed Milk", code: "CM012", price: 85, category: "Dairy", unit: "400g", description: "Sweetened condensed milk", gstRate: 12, stock: 30, minStock: 6, costPrice: 75, isActive: true },
  { name: "Milk Powder", code: "MP013", price: 350, category: "Dairy", unit: "500g", description: "Full cream milk powder", gstRate: 5, stock: 25, minStock: 5, costPrice: 320, isActive: true },
  { name: "Curd", code: "CD014", price: 50, category: "Dairy", unit: "400g", description: "Fresh curd", gstRate: 5, stock: 55, minStock: 12, costPrice: 42, isActive: true },
  { name: "Mozzarella", code: "MZ015", price: 400, category: "Dairy", unit: "200g", description: "Mozzarella cheese", gstRate: 12, stock: 15, minStock: 3, costPrice: 360, isActive: true },
  { name: "Cottage Cheese", code: "CC016", price: 280, category: "Dairy", unit: "200g", description: "Cottage cheese", gstRate: 5, stock: 20, minStock: 4, costPrice: 250, isActive: true },
  { name: "Whipped Cream", code: "WC017", price: 120, category: "Dairy", unit: "250ml", description: "Ready to use whipped cream", gstRate: 12, stock: 25, minStock: 5, costPrice: 100, isActive: true },
  { name: "Sour Cream", code: "SC018", price: 90, category: "Dairy", unit: "200ml", description: "Fresh sour cream", gstRate: 12, stock: 18, minStock: 4, costPrice: 78, isActive: true },
  { name: "Flavored Milk", code: "FM019", price: 35, category: "Dairy", unit: "200ml", description: "Chocolate flavored milk", gstRate: 12, stock: 50, minStock: 12, costPrice: 28, isActive: true },
  { name: "Probiotic Drink", code: "PD020", price: 45, category: "Dairy", unit: "150ml", description: "Probiotic yogurt drink", gstRate: 12, stock: 40, minStock: 8, costPrice: 38, isActive: true }
];
