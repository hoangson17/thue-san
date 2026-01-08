import * as React from "react"
import {
  IconAdCircle,
  IconBellDollar,
  IconCategory,
  IconChartBar,
  IconDashboard,
  IconEyeDollar,
  IconInnerShadowTop,
  IconMapPinDollar,
  IconPackage,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const data = {
  navMain: [
    {
      title: "Giải đấu",
      url: "/admin/tournaments",
      icon: IconChartBar,
    },
    {
      title: "Quản lý sân",
      url: "/admin/courts",
      icon: IconAdCircle ,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: IconPackage,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: IconCategory,
    },
    {
      title: "Prices",
      url: "/admin/prices",
      icon: IconMapPinDollar,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
  ],
  documents: [
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSelector((state: any) => state.auth);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/admin" className="hover:bg-transparent">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Quản lý sân</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
