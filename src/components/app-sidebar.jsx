import {
  Gitlab,
  Home,
  ListTodo,
  SearchCheck,
  Settings,
  PanelLeftClose,
} from "lucide-react";
import { useState } from "react";

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
    url: "#",
    icon: Home,
  },
  {
    title: "Gitlab",
    url: "#gitlab",
    icon: Gitlab,
  },
  {
    title: "Detective",
    url: "#detective",
    icon: SearchCheck,
  },
  {
    title: "Notes",
    url: "#notes",
    icon: ListTodo,
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ease-in-out border-r border-border
      ${collapsed ? "w-14" : "w-48"}`}
    >
      <div
        className="h-full flex flex-col justify-between"
        collapsed={collapsed}
      >
        <SidebarContent>
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
                      <a
                        href={item.url}
                        className="flex w-full items-center gap-2 p-3"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </a>
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
                    <a
                      href="#settings"
                      className="flex w-full items-center gap-2 p-3 mb-2"
                    >
                      <Settings className="h-4 w-4 shrink-0" />
                      <span>Settings</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                onClick={() => setCollapsed(!collapsed)}
                className="w-full p-3 bg-neutral-900 flex items-center justify-center"
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
