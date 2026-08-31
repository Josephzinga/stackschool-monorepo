'use client';

import * as React from 'react';
import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { menuItems } from '@/lib/data';
import { useUserStore } from '@stackschool/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { School } from 'lucide-react';
import { useDashboard } from './providers/dashboard-provider';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentSchool, user } = useUserStore();

  // On essaie de récupérer le rôle depuis le contexte Dashboard (plus fiable)
  // Sinon on fallback sur le store User
  let role = 'GUEST';
  try {
    const dashboard = useDashboard();
    role = dashboard.me?.schoolContext?.role!;
  } catch (e) {
    // Si on est hors du DashboardProvider (ex: page d'accueil), on utilise le store
    role = currentSchool
      ? user?.memberships?.find((m) => m?.school?.id === currentSchool?.id)
          ?.role || 'GUEST'
      : 'GUEST';
  }

  // Filtrage des menus
  const filteredNavMain = menuItems.navMain.filter(
    (item) => !item.visible || item.visible.includes(role),
  );

  const filteredDocuments = menuItems.documents.filter(
    (item) => !item.visible || item.visible.includes(role),
  );

  const userData = {
    name: user?.username || 'Utilisateur',
    email: user?.email || '',
    avatar: user?.profile?.photo || '',
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5! h-14">
              <a href="#">
                <Avatar className="w-11 h-11 rounded-xl">
                  <AvatarImage src={currentSchool?.logo ?? undefined} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                    <School className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-poppins font-semibold truncate w-full">
                    {currentSchool?.name}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {role?.toLowerCase()}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavDocuments items={filteredDocuments} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
