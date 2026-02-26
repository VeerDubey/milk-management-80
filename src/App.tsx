
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';
import LoginLayout from '@/components/layout/LoginLayout';
import { DataProvider } from '@/contexts/data/DataContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import CustomerList from '@/pages/CustomerList';
import Orders from '@/pages/Orders';
import Products from '@/pages/Products';
import Payments from '@/pages/Payments';
import TrackSheet from '@/pages/TrackSheet';
import DeliverySheet from '@/pages/DeliverySheet';
import Invoices from '@/pages/Invoices';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Master from '@/pages/Master';

// Customer pages
import CustomerDirectory from '@/pages/CustomerDirectory';
import CustomerLedger from '@/pages/CustomerLedger';
import CustomerRates from '@/pages/CustomerRates';
import CustomerReport from '@/pages/CustomerReport';
import OutstandingDues from '@/pages/OutstandingDues';
import OutstandingAmounts from '@/pages/OutstandingAmounts';

// Product/Inventory pages
import ProductList from '@/pages/ProductList';
import ProductRates from '@/pages/ProductRates';
import StockManagement from '@/pages/StockManagement';
import StockSettings from '@/pages/StockSettings';
import ProductCategories from '@/pages/ProductCategories';
import BulkRates from '@/pages/BulkRates';

// Order pages
import OrderList from '@/pages/OrderList';
import OrderEntry from '@/pages/OrderEntry';
import OrderHistory from '@/pages/OrderHistory';

// Payment pages
import PaymentList from '@/pages/PaymentListView';
import PaymentCreate from '@/pages/PaymentCreate';
import Outstanding from '@/pages/Outstanding';

// Invoice pages
import InvoiceHistory from '@/pages/InvoiceHistory';
import InvoiceCreate from '@/pages/InvoiceCreate';
import InvoiceTemplates from '@/pages/InvoiceTemplates';

// Delivery pages
import DeliverySheetManager from '@/pages/DeliverySheetManager';
import DeliverySheetBulk from '@/pages/DeliverySheetBulk';
import TrackSheetAdvanced from '@/pages/TrackSheetAdvanced';
import TrackSheetHistory from '@/pages/TrackSheetHistory';
import VehicleTracking from '@/pages/VehicleTracking';
import VehicleSalesmanCreate from '@/pages/VehicleSalesmanCreate';

// Supplier pages
import SupplierDirectory from '@/pages/SupplierDirectory';
import SupplierLedger from '@/pages/SupplierLedger';
import SupplierPayments from '@/pages/SupplierPayments';
import SupplierRates from '@/pages/SupplierRates';
import PurchaseManagement from '@/pages/PurchaseManagement';
import PurchaseHistory from '@/pages/PurchaseHistory';

// Communication pages
import Messaging from '@/pages/Messaging';
import EmailTemplates from '@/pages/EmailTemplates';
import SmsTemplates from '@/pages/SmsTemplates';
import BulkCommunication from '@/pages/BulkCommunication';

// Reports & Analytics pages
import SalesReport from '@/pages/SalesReport';
import Analytics from '@/pages/Analytics';
import AIAnalytics from '@/pages/AIAnalytics';
import SmartInventory from '@/pages/SmartInventory';

// Settings & Config pages
import CompanyProfile from '@/pages/CompanyProfile';
import AreaManagement from '@/pages/AreaManagement';
import FinancialYear from '@/pages/FinancialYear';
import TaxSettings from '@/pages/TaxSettings';
import UISettings from '@/pages/UISettings';
import UserAccess from '@/pages/UserAccess';
import RoleManagementPage from '@/pages/RoleManagementPage';
import Expenses from '@/pages/Expenses';
import AdvancedFeatures from '@/pages/AdvancedFeatures';
import NotificationsPage from '@/pages/NotificationsPage';

// Advanced pages
import BusinessIntelligence from '@/pages/BusinessIntelligence';
import AdvancedReports from '@/pages/AdvancedReports';
import TestingReport from '@/pages/TestingReport';
import InventoryDashboard from '@/pages/InventoryDashboard';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vmc-theme">
      <EnhancedAuthProvider>
        <DataProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginLayout><Login /></LoginLayout>} />
              
              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="master" element={<Master />} />
                  
                  {/* Customer */}
                  <Route path="customers" element={<CustomerList />} />
                  <Route path="customer-list" element={<CustomerList />} />
                  <Route path="customer-directory" element={<CustomerDirectory />} />
                  <Route path="customer-ledger" element={<CustomerLedger />} />
                  <Route path="customer-rates" element={<CustomerRates />} />
                  <Route path="customer-report" element={<CustomerReport />} />
                  <Route path="outstanding-dues" element={<OutstandingDues />} />
                  <Route path="outstanding-amounts" element={<OutstandingAmounts />} />
                  
                  {/* Inventory */}
                  <Route path="products" element={<Products />} />
                  <Route path="product-list" element={<ProductList />} />
                  <Route path="product-rates" element={<ProductRates />} />
                  <Route path="stock-management" element={<StockManagement />} />
                  <Route path="stock-settings" element={<StockSettings />} />
                  <Route path="product-categories" element={<ProductCategories />} />
                  <Route path="bulk-rates" element={<BulkRates />} />
                  
                  {/* Orders */}
                  <Route path="orders" element={<Orders />} />
                  <Route path="order-list" element={<OrderList />} />
                  <Route path="order-entry" element={<OrderEntry />} />
                  <Route path="order-history" element={<OrderHistory />} />
                  
                  {/* Payments */}
                  <Route path="payments" element={<Payments />} />
                  <Route path="payment-list" element={<PaymentList />} />
                  <Route path="payment-create" element={<PaymentCreate />} />
                  <Route path="outstanding" element={<Outstanding />} />
                  
                  {/* Invoices */}
                  <Route path="invoices" element={<Invoices />} />
                  <Route path="invoice-history" element={<InvoiceHistory />} />
                  <Route path="invoice-create" element={<InvoiceCreate />} />
                  <Route path="invoice-templates" element={<InvoiceTemplates />} />
                  
                  {/* Delivery */}
                  <Route path="delivery-sheet" element={<DeliverySheet />} />
                  <Route path="delivery-sheet-manager" element={<DeliverySheetManager />} />
                  <Route path="delivery-sheet-bulk" element={<DeliverySheetBulk />} />
                  <Route path="track-sheet" element={<TrackSheet />} />
                  <Route path="track-sheet-advanced" element={<TrackSheetAdvanced />} />
                  <Route path="track-sheet-history" element={<TrackSheetHistory />} />
                  <Route path="vehicle-tracking" element={<VehicleTracking />} />
                  <Route path="vehicle-salesman-create" element={<VehicleSalesmanCreate />} />
                  
                  {/* Suppliers */}
                  <Route path="supplier-directory" element={<SupplierDirectory />} />
                  <Route path="supplier-ledger" element={<SupplierLedger />} />
                  <Route path="supplier-payments" element={<SupplierPayments />} />
                  <Route path="supplier-rates" element={<SupplierRates />} />
                  <Route path="purchase-management" element={<PurchaseManagement />} />
                  <Route path="purchase-history" element={<PurchaseHistory />} />
                  
                  {/* Communication */}
                  <Route path="messaging" element={<Messaging />} />
                  <Route path="email-templates" element={<EmailTemplates />} />
                  <Route path="sms-templates" element={<SmsTemplates />} />
                  <Route path="bulk-communication" element={<BulkCommunication />} />
                  
                  {/* Reports */}
                  <Route path="reports" element={<Reports />} />
                  <Route path="sales-report" element={<SalesReport />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="ai-analytics" element={<AIAnalytics />} />
                  <Route path="smart-inventory" element={<SmartInventory />} />
                  
                  {/* Settings */}
                  <Route path="settings" element={<Settings />} />
                  <Route path="company-profile" element={<CompanyProfile />} />
                  <Route path="area-management" element={<AreaManagement />} />
                  <Route path="financial-year" element={<FinancialYear />} />
                  <Route path="tax-settings" element={<TaxSettings />} />
                  <Route path="ui-settings" element={<UISettings />} />
                  <Route path="user-access" element={<UserAccess />} />
                  <Route path="role-management" element={<RoleManagementPage />} />
                  <Route path="expenses" element={<Expenses />} />
                  <Route path="advanced-features" element={<AdvancedFeatures />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  
                  {/* Advanced */}
                  <Route path="business-intelligence" element={<BusinessIntelligence />} />
                  <Route path="advanced-reports" element={<AdvancedReports />} />
                  <Route path="testing-report" element={<TestingReport />} />
                  <Route path="inventory-dashboard" element={<InventoryDashboard />} />
                </Route>
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </DataProvider>
      </EnhancedAuthProvider>
    </ThemeProvider>
  );
}

export default App;
