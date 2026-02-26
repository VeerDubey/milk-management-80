import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppNavigation } from "./AppNavigation";
import { AppBreadcrumb } from "./AppBreadcrumb";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppNavigation />
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-background to-muted/20">
            <AppBreadcrumb />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}