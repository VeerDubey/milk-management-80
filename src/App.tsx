
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';
import { DataProvider } from '@/contexts/data/DataContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ProtectedRoute } from '@/components/ProtectedRoute';

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
import NotFound from '@/pages/NotFound';

// Layout
import AppLayout from '@/components/layout/AppLayout';

function App() {
  console.log('🔵 App component rendering');
  
  try {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vmc-theme">
        <EnhancedAuthProvider>
          <DataProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="customers" element={<CustomerList />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="products" element={<Products />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="track-sheet" element={<TrackSheet />} />
                    <Route path="delivery-sheet" element={<DeliverySheet />} />
                    <Route path="invoices" element={<Invoices />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
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
  } catch (error) {
    console.error('🚨 App rendering error:', error);
    return <div>Error loading app: {error.message}</div>;
  }
}

export default App;
