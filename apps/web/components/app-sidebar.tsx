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
import { ROLE_LABEL_FR } from '@stackschool/contracts';
import { Badge } from '@/components/ui/badge';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentSchool, currentMemberShip } = useUserStore();
  const role = currentMemberShip?.role!;
  // Filtrage des menus
  const filteredNavMain = menuItems.navMain.filter(
    (item) => !item.visible || item.visible.includes(role),
  );

  const filteredDocuments = menuItems.documents.filter(
    (item) => !item.visible || item.visible.includes(role),
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5! h-14">
              <a href="#" className="flex gap-3">
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
                  <Badge variant="outline" className="text-sm text-primary">
                    {ROLE_LABEL_FR[role]}
                  </Badge>
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
