"use client"

import {
  ChevronsUpDown,
  GalleryVerticalEnd,
  Heart,
  Search,
  Shirt,
  TrendingUp
} from "lucide-react"
import type * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar"
import type { Session } from "~/lib/auth-client"
import { APP_NAME, APP_VERSION } from "~/project.config"
import { ThemeSwitcher } from "./common/theme-switcher"



const sidebar_links =   [
  {
    title: "Search",
    url: "/search",
    icon: Search,
    isActive: true,
    items: [],
  },
  {
    title: "Trends",
    url: "/trends",
    icon: TrendingUp,
    items:[],
  },
  {
    title: "Discover",
    url: "/discover",
    icon: Shirt,
    items:[],
  },
  {
    title: "Assistant",
    url: "/outfit-assistant",
    icon: Heart,
    items: [
    ],
  },
]


interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: Session["user"];
}
export function AppSidebar({ user, ...props }: SidebarProps) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {APP_NAME}
                </span>
                <span className="truncate text-xs">{APP_VERSION}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebar_links} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-center gap-2 items-center px-3 overflow-hidden">
          <ThemeSwitcher />
        </div>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );

}
