import {
  Gitlab,
  Home,
  ListTodo,
  SearchCheck,
  Settings,
  PanelLeftClose,
  PenTool,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { API_CONFIG } from "@/config";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Gitlab",
    url: "/gitlab",
    icon: Gitlab,
  },
  {
    title: "Detective",
    url: "/detective",
    icon: SearchCheck,
  },
  {
    title: "Notes",
    url: "/notes",
    icon: ListTodo,
  },
  {
    title: "Diagrams",
    url: "/diagrams",
    icon: PenTool,
  },
];

export function AppSidebar({
  isCollapsed: collapsed,
  onToggle,
  className,
  ...rest
}) {
  const location = useLocation();

  const dataCollapsed = collapsed ? "true" : "false";

  // Check backend connection whenever the location changes
  useEffect(() => {
    checkBackendConnection();
  }, [location]); // Add location as a dependency

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Backend is down");
      }
    } catch (error) {
      console.error("Error checking backend connection:", error); // Log the error for debugging
      toast.error("Connection error: Backend is down."); // Show the toast
    }
  };

  return (
    <div
      data-collapsed={dataCollapsed}
      className={`transition-all duration-300 ease-in-out border-r border-border
      ${collapsed ? "w-14" : "w-48"} ${className || ""}`}
      {...rest}
    >
      <div className="h-full flex flex-col justify-between">
        <SidebarContent className={`overflow-x-hidden overflow-y-auto`}>
          <SidebarGroup>
            <SidebarGroupLabel
              className={`transition-opacity duration-300 ${
                collapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              Applications
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex w-full items-center gap-2 p-3 ${
                          location.pathname === item.url
                            ? "bg-backround-800"
                            : ""
                        }`}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className={collapsed ? "hidden" : "block"}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup className="p-0 pb-0.5 border-b border-border">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/settings"
                      className={`flex w-full items-center gap-2 p-3 mb-2 ${
                        location.pathname === "/settings"
                          ? "bg-background-800"
                          : ""
                      }`}
                    >
                      <Settings className="h-4 w-4 shrink-0" />
                      <span className={collapsed ? "hidden" : "block"}>
                        Settings
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                onClick={onToggle}
                className="w-full p-3 flex items-center justify-center"
              >
                <button>
                  <PanelLeftClose
                    className={`transition-transform ${
                      collapsed ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </div>
  );
}
