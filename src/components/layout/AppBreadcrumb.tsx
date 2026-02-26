import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  master: "Master Control",
  "customer-list": "Customer List",
  customers: "Customers",
  "customer-directory": "Customer Directory",
  "customer-ledger": "Customer Ledger",
  "customer-rates": "Customer Rates",
  "customer-report": "Customer Report",
  "outstanding-dues": "Outstanding Dues",
  "outstanding-amounts": "Outstanding Amounts",
  "product-list": "Product List",
  products: "Products",
  "product-rates": "Product Rates",
  "stock-management": "Stock Management",
  "stock-settings": "Stock Settings",
  "product-categories": "Product Categories",
  "bulk-rates": "Bulk Rate Update",
  "order-list": "Order List",
  orders: "Orders",
  "order-entry": "Order Entry",
  "order-history": "Order History",
  "payment-list": "Payment List",
  payments: "Payments",
  "payment-create": "Create Payment",
  outstanding: "Outstanding",
  invoices: "Invoices",
  "invoice-history": "Invoice History",
  "invoice-create": "Create Invoice",
  "invoice-templates": "Invoice Templates",
  "delivery-sheet": "Delivery Sheet",
  "delivery-sheet-manager": "Delivery Manager",
  "delivery-sheet-bulk": "Bulk Delivery",
  "track-sheet": "Track Sheet",
  "track-sheet-advanced": "Advanced Track Sheet",
  "track-sheet-history": "Track Sheet History",
  "vehicle-tracking": "Vehicle Tracking",
  "vehicle-salesman-create": "Vehicle/Salesman",
  "supplier-directory": "Supplier Directory",
  "supplier-ledger": "Supplier Ledger",
  "supplier-payments": "Supplier Payments",
  "supplier-rates": "Supplier Rates",
  "purchase-management": "Purchase Management",
  "purchase-history": "Purchase History",
  messaging: "Messaging",
  "email-templates": "Email Templates",
  "sms-templates": "SMS Templates",
  "bulk-communication": "Bulk Communication",
  reports: "Reports",
  "sales-report": "Sales Report",
  analytics: "Analytics",
  "ai-analytics": "AI Analytics",
  "smart-inventory": "Smart Inventory",
  settings: "Settings",
  "company-profile": "Company Profile",
  "area-management": "Area Management",
  "financial-year": "Financial Year",
  "tax-settings": "Tax Settings",
  "ui-settings": "UI Settings",
  "user-access": "User Access",
  "role-management": "Role Management",
  expenses: "Expenses",
  "advanced-features": "Advanced Features",
  notifications: "Notifications",
  "business-intelligence": "Business Intelligence",
  "advanced-reports": "Advanced Reports",
  "testing-report": "Testing Report",
  "inventory-dashboard": "Inventory Dashboard",
};

export function AppBreadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === "dashboard")) {
    return null;
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>
      {pathSegments.map((segment, index) => {
        const path = "/" + pathSegments.slice(0, index + 1).join("/");
        const label = routeLabels[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        const isLast = index === pathSegments.length - 1;

        return (
          <span key={path} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            {isLast ? (
              <span className="text-foreground font-medium">{label}</span>
            ) : (
              <Link to={path} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
