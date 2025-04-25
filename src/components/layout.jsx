import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { storage } from "@/lib/local-storage";

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(() =>
    // Initialize from localStorage with a default of false
    storage.get("sidebar-collapsed", false)
  );

  // Save to localStorage whenever isCollapsed changes
  useEffect(() => {
    storage.set("sidebar-collapsed", isCollapsed);
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="flex min-h-screen min-w-screen">
          <AppSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
          <main className="flex flex-col flex-1 overflow-auto">{children}</main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
