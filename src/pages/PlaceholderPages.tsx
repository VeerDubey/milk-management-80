
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Generic placeholder component
export function PlaceholderPage({ 
  title, 
  description, 
  features = [] 
}: { 
  title: string; 
  description: string; 
  features?: string[] 
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            This page is under development. Features will be available soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {features.length > 0 && (
            <>
              <p className="text-muted-foreground mb-2">Features coming soon:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Individual placeholder pages
export const CustomerLedger = () => (
  <PlaceholderPage
    title="Customer Ledger"
    description="View detailed customer account statements and transaction history"
    features={[
      'Individual customer account statements',
      'Transaction history tracking',
      'Balance calculations',
      'Payment history'
    ]}
  />
);

export const CustomerRates = () => (
  <PlaceholderPage
    title="Customer Rates"
    description="Manage customer-specific pricing and rate cards"
    features={[
      'Customer-specific pricing',
      'Bulk rate updates',
      'Rate card management',
      'Price history tracking'
    ]}
  />
);

export const CustomerReport = () => (
  <PlaceholderPage
    title="Customer Report"
    description="Generate comprehensive customer reports and analytics"
    features={[
      'Customer performance reports',
      'Sales analytics by customer',
      'Payment behavior analysis',
      'Export functionality'
    ]}
  />
);

export const StockManagement = () => (
  <PlaceholderPage
    title="Stock Management"
    description="Comprehensive inventory and stock management system"
    features={[
      'Real-time stock tracking',
      'Stock adjustments',
      'Inventory reports',
      'Stock alerts and notifications'
    ]}
  />
);

export const StockSettings = () => (
  <PlaceholderPage
    title="Stock Settings"
    description="Configure stock management preferences and settings"
    features={[
      'Minimum stock level settings',
      'Stock alert configurations',
      'Inventory calculation methods',
      'Stock movement tracking'
    ]}
  />
);

export const ProductCategories = () => (
  <PlaceholderPage
    title="Product Categories"
    description="Manage product categories and classification system"
    features={[
      'Category hierarchy management',
      'Product classification',
      'Category-wise reporting',
      'Bulk category assignments'
    ]}
  />
);

export const BulkRates = () => (
  <PlaceholderPage
    title="Bulk Rate Update"
    description="Update product rates in bulk with various criteria"
    features={[
      'Bulk price updates',
      'Category-wise rate changes',
      'Percentage-based adjustments',
      'Rate change history'
    ]}
  />
);

export const OrderEntry = () => (
  <PlaceholderPage
    title="Order Entry"
    description="Create and manage customer orders efficiently"
    features={[
      'Quick order creation',
      'Product selection with search',
      'Real-time pricing',
      'Order validation'
    ]}
  />
);

export const PaymentCreate = () => (
  <PlaceholderPage
    title="Create Payment"
    description="Record and manage customer payments"
    features={[
      'Multiple payment methods',
      'Payment allocation',
      'Receipt generation',
      'Payment tracking'
    ]}
  />
);

export const InvoiceHistory = () => (
  <PlaceholderPage
    title="Invoice History"
    description="View and manage all generated invoices"
    features={[
      'Invoice search and filtering',
      'Status tracking',
      'Payment reconciliation',
      'Invoice reprinting'
    ]}
  />
);

export const InvoiceCreate = () => (
  <PlaceholderPage
    title="Create Invoice"
    description="Generate professional invoices for customers"
    features={[
      'Customizable invoice templates',
      'Tax calculations',
      'Multiple formats',
      'Automatic numbering'
    ]}
  />
);

export const InvoiceTemplates = () => (
  <PlaceholderPage
    title="Invoice Templates"
    description="Manage invoice templates and layouts"
    features={[
      'Custom template design',
      'Company branding',
      'Multiple formats',
      'Template preview'
    ]}
  />
);

export const Messaging = () => (
  <PlaceholderPage
    title="Messaging"
    description="Internal messaging and communication system"
    features={[
      'Team messaging',
      'Customer communication',
      'Message templates',
      'Communication history'
    ]}
  />
);

export const EmailTemplates = () => (
  <PlaceholderPage
    title="Email Templates"
    description="Create and manage email templates for customer communication"
    features={[
      'Professional email templates',
      'Variable placeholders',
      'HTML email support',
      'Template categories'
    ]}
  />
);

export const BulkCommunication = () => (
  <PlaceholderPage
    title="Bulk Communication"
    description="Send bulk messages to customers via SMS and email"
    features={[
      'Bulk SMS sending',
      'Email campaigns',
      'Customer segmentation',
      'Delivery tracking'
    ]}
  />
);

export const TrackSheetAdvanced = () => (
  <PlaceholderPage
    title="Advanced Track Sheet"
    description="Advanced delivery tracking and route management"
    features={[
      'Route optimization',
      'Real-time tracking',
      'Delivery confirmations',
      'Performance analytics'
    ]}
  />
);

export const TrackSheet = () => (
  <PlaceholderPage
    title="Track Sheet"
    description="Basic delivery tracking and management"
    features={[
      'Delivery scheduling',
      'Order tracking',
      'Driver assignments',
      'Status updates'
    ]}
  />
);

export const TrackSheetHistory = () => (
  <PlaceholderPage
    title="Track Sheet History"
    description="View historical delivery data and performance"
    features={[
      'Historical delivery records',
      'Performance metrics',
      'Route analysis',
      'Delivery reports'
    ]}
  />
);

export const VehicleTracking = () => (
  <PlaceholderPage
    title="Vehicle Tracking"
    description="Track vehicles and monitor delivery fleet"
    features={[
      'Real-time vehicle tracking',
      'Fleet management',
      'Route monitoring',
      'Vehicle maintenance'
    ]}
  />
);

export const VehicleSalesmanCreate = () => (
  <PlaceholderPage
    title="Vehicle/Salesman Management"
    description="Manage vehicles and sales team assignments"
    features={[
      'Vehicle registration',
      'Driver/salesman assignments',
      'Route allocations',
      'Performance tracking'
    ]}
  />
);

// Export all placeholder pages
export default {
  CustomerLedger,
  CustomerRates,
  CustomerReport,
  StockManagement,
  StockSettings,
  ProductCategories,
  BulkRates,
  OrderEntry,
  PaymentCreate,
  InvoiceHistory,
  InvoiceCreate,
  InvoiceTemplates,
  Messaging,
  EmailTemplates,
  BulkCommunication,
  TrackSheetAdvanced,
  TrackSheet,
  TrackSheetHistory,
  VehicleTracking,
  VehicleSalesmanCreate
};
