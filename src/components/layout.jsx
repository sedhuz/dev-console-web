import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider

export default function Layout({ children }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1 p-6">
            <SidebarTrigger className="mb-4" />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
