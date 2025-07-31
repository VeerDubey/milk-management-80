
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/data/DataContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import FuturisticLogin from '@/components/auth/FuturisticLogin';
import { AppSidebar } from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';

// Dashboard and Main Pages
import Dashboard from '@/pages/Dashboard';
import Master from '@/pages/Master';

// Customer Pages
import CustomerList from '@/pages/CustomerList';
import CustomerDirectory from '@/pages/CustomerDirectory';
import CustomerLedger from '@/pages/CustomerLedger';
import CustomerRates from '@/pages/CustomerRates';
import CustomerReport from '@/pages/CustomerReport';
import OutstandingDues from '@/pages/OutstandingDues';
import OutstandingAmounts from '@/pages/OutstandingAmounts';

// Product Pages
import ProductList from '@/pages/ProductList';
import ProductRates from '@/pages/ProductRates';
import StockManagement from '@/pages/StockManagement';
import StockSettings from '@/pages/StockSettings';
import ProductCategories from '@/pages/ProductCategories';
import BulkRates from '@/pages/BulkRates';

// Order Pages
import OrderList from '@/pages/OrderList';
import OrderEntry from '@/pages/OrderEntry';
import OrderHistory from '@/pages/OrderHistory';

// Payment Pages
import PaymentList from '@/pages/PaymentList';
import PaymentCreate from '@/pages/PaymentCreate';

// Invoice Pages
import InvoiceHistory from '@/pages/InvoiceHistory';
import InvoiceCreate from '@/pages/InvoiceCreate';
import InvoiceTemplates from '@/pages/InvoiceTemplates';

// Communication Pages
import Messaging from '@/pages/Messaging';
import EmailTemplates from '@/pages/EmailTemplates';
import SmsTemplates from '@/pages/SmsTemplates';
import BulkCommunication from '@/pages/BulkCommunication';

// Delivery Pages
import TrackSheetAdvanced from '@/pages/TrackSheetAdvanced';
import TrackSheet from '@/pages/TrackSheet';
import TrackSheetHistory from '@/pages/TrackSheetHistory';
import VehicleTracking from '@/pages/VehicleTracking';
import VehicleSalesmanCreate from '@/pages/VehicleSalesmanCreate';

// Supplier Pages
import SupplierDirectory from '@/pages/SupplierDirectory';
import SupplierLedger from '@/pages/SupplierLedger';
import SupplierPayments from '@/pages/SupplierPayments';
import SupplierRates from '@/pages/SupplierRates';
import PurchaseManagement from '@/pages/PurchaseManagement';
import PurchaseHistory from '@/pages/PurchaseHistory';

// Report Pages
import Reports from '@/pages/Reports';
import SalesReport from '@/pages/SalesReport';
import Analytics from '@/pages/Analytics';
import AIAnalytics from '@/pages/AIAnalytics';
import SmartInventory from '@/pages/SmartInventory';

// Settings Pages
import Settings from '@/pages/Settings';
import CompanyProfile from '@/pages/CompanyProfile';
import AreaManagement from '@/pages/AreaManagement';
import FinancialYear from '@/pages/FinancialYear';
import TaxSettings from '@/pages/TaxSettings';
import UISettings from '@/pages/UISettings';
import UserAccess from '@/pages/UserAccess';
import Expenses from '@/pages/Expenses';

// Enhanced Pages
import EnhancedDeliverySheet from '@/pages/EnhancedDeliverySheet';
import DeliverySheetGenerator from '@/components/delivery/DeliverySheetGenerator';
import DeliverySheetTracker from '@/pages/DeliverySheetTracker';
import DeliverySheetBulk from '@/pages/DeliverySheetBulk';
import DeliverySheetManager from '@/pages/DeliverySheetManager';
import EnhancedInvoiceGenerator from '@/components/invoice/EnhancedInvoiceGenerator';

// Missing Pages - Creating for full ERP functionality
import PaymentListView from '@/pages/PaymentListView';
import AdvancedReports from '@/pages/AdvancedReports';
import BusinessIntelligence from '@/pages/BusinessIntelligence';
import NotificationsPage from '@/pages/NotificationsPage';
import ExpensesRevamped from '@/pages/ExpensesRevamped';
import InventoryDashboard from '@/pages/InventoryDashboard';
import TestingReport from '@/pages/TestingReport';
import AdvancedFeatures from '@/pages/AdvancedFeatures';
import ProMode from '@/pages/ProMode';
import RoleManagementPage from '@/pages/RoleManagementPage';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-300 animate-pulse">Initializing Futuristic System...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <FuturisticLogin />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 bg-gradient-to-br from-background/90 via-background/80 to-muted/20 backdrop-blur-sm">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/master" element={<Master />} />
              
              {/* Customer Routes */}
              <Route path="/customer-list" element={<CustomerList />} />
              <Route path="/customer-directory" element={<CustomerDirectory />} />
              <Route path="/customer-ledger" element={<CustomerLedger />} />
              <Route path="/customer-rates" element={<CustomerRates />} />
              <Route path="/customer-report" element={<CustomerReport />} />
              <Route path="/outstanding-dues" element={<OutstandingDues />} />
              <Route path="/outstanding-amounts" element={<OutstandingAmounts />} />
              <Route path="/outstanding" element={<OutstandingAmounts />} />
              
              {/* Product Routes */}
              <Route path="/product-list" element={<ProductList />} />
              <Route path="/product-rates" element={<ProductRates />} />
              <Route path="/stock-management" element={<StockManagement />} />
              <Route path="/stock-settings" element={<StockSettings />} />
              <Route path="/product-categories" element={<ProductCategories />} />
              <Route path="/bulk-rates" element={<BulkRates />} />
              
              {/* Order Routes */}
              <Route path="/order-list" element={<OrderList />} />
              <Route path="/order-entry" element={<OrderEntry />} />
              <Route path="/order-history" element={<OrderHistory />} />
              
              {/* Payment Routes */}
              <Route path="/payment-list" element={<PaymentList />} />
              <Route path="/payment-list-view" element={<PaymentListView />} />
              <Route path="/payment-create" element={<PaymentCreate />} />
              
              {/* Invoice Routes */}
              <Route path="/invoices" element={<EnhancedInvoiceGenerator />} />
              <Route path="/invoice-history" element={<InvoiceHistory />} />
              <Route path="/invoice-create" element={<InvoiceCreate />} />
              <Route path="/invoice-templates" element={<InvoiceTemplates />} />
              
              {/* Communication Routes */}
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/email-templates" element={<EmailTemplates />} />
              <Route path="/sms-templates" element={<SmsTemplates />} />
              <Route path="/bulk-communication" element={<BulkCommunication />} />
              
              {/* Delivery Routes */}
              <Route path="/delivery-sheet" element={<DeliverySheetTracker />} />
              <Route path="/delivery-sheet-bulk" element={<DeliverySheetBulk />} />
              <Route path="/delivery-sheet-manager" element={<DeliverySheetManager />} />
              <Route path="/delivery-enhanced" element={<EnhancedDeliverySheet />} />
              <Route path="/delivery-generator" element={<DeliverySheetGenerator />} />
              <Route path="/track-sheet-advanced" element={<TrackSheetAdvanced />} />
              <Route path="/track-sheet" element={<TrackSheet />} />
              <Route path="/track-sheet-history" element={<TrackSheetHistory />} />
              <Route path="/vehicle-tracking" element={<VehicleTracking />} />
              <Route path="/vehicle-salesman-create" element={<VehicleSalesmanCreate />} />
              
              {/* Supplier Routes */}
              <Route path="/supplier-directory" element={<SupplierDirectory />} />
              <Route path="/supplier-ledger" element={<SupplierLedger />} />
              <Route path="/supplier-payments" element={<SupplierPayments />} />
              <Route path="/supplier-rates" element={<SupplierRates />} />
              <Route path="/purchase-management" element={<PurchaseManagement />} />
              <Route path="/purchase-history" element={<PurchaseHistory />} />
              
              {/* Report Routes */}
              <Route path="/reports" element={<Reports />} />
              <Route path="/sales-report" element={<SalesReport />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai-analytics" element={<AIAnalytics />} />
              <Route path="/smart-inventory" element={<SmartInventory />} />
              
              {/* Settings Routes */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/company-profile" element={<CompanyProfile />} />
              <Route path="/area-management" element={<AreaManagement />} />
              <Route path="/financial-year" element={<FinancialYear />} />
              <Route path="/tax-settings" element={<TaxSettings />} />
              <Route path="/ui-settings" element={<UISettings />} />
              <Route path="/user-access" element={<UserAccess />} />
              <Route path="/role-management" element={<RoleManagementPage />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/expenses-revamped" element={<ExpensesRevamped />} />
              <Route path="/inventory-dashboard" element={<InventoryDashboard />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/testing-report" element={<TestingReport />} />
              <Route path="/advanced-features" element={<AdvancedFeatures />} />
              <Route path="/pro-mode" element={<ProMode />} />
              <Route path="/business-intelligence" element={<BusinessIntelligence />} />
              <Route path="/advanced-reports" element={<AdvancedReports />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
          <Toaster position="top-right" richColors />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
