'use client';

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useUserStore } from '@stackschool/ui';
import { UserIcon } from 'lucide-react';

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user } = useUserStore();

  return (
    <SidebarMenu className="w-full">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full font-poppins flex gap-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <AvatarImage
                src={user?.profile?.avatarUrl ?? undefined}
                alt={user?.username}
              />
              <AvatarFallback className="rounded-lg">
                {user?.profile?.firstName[0].toUpperCase()}
                {user?.profile?.lastName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.username}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user?.email || user?.phoneNumber}
              </span>
            </div>
            <IconDotsVertical className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.profile?.avatarUrl ?? undefined}
                      alt={user?.username}
                    />
                    <AvatarFallback className="rounded-lg">
                      <UserIcon className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.username}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user?.email || user?.phoneNumber}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <IconUserCircle />
                Comptes
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Paiements
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconLogout />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
