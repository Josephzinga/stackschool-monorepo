'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavMain = NavMain;
const icons_react_1 = require("@tabler/icons-react");
const button_1 = require("@/components/ui/button");
const sidebar_1 = require("@/components/ui/sidebar");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const dashboard_provider_1 = require("@/components/providers/dashboard-provider");
function NavMain({ items }) {
    const pathname = (0, navigation_1.usePathname)();
    const { me } = (0, dashboard_provider_1.useDashboard)();
    const role = me?.schoolContext?.role.toLowerCase();
    return (<sidebar_1.SidebarGroup>
      <sidebar_1.SidebarGroupContent className="flex flex-col gap-2">
        <sidebar_1.SidebarMenu>
          <sidebar_1.SidebarMenuItem className="flex items-center gap-2">
            <sidebar_1.SidebarMenuButton tooltip="Quick Create" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
              <icons_react_1.IconCirclePlusFilled />
              <span>Quick Create</span>
            </sidebar_1.SidebarMenuButton>
            <button_1.Button size="icon" className="size-8 group-data-[collapsible=icon]:opacity-0" variant="outline">
              <icons_react_1.IconMail />
              <span className="sr-only">Inbox</span>
            </button_1.Button>
          </sidebar_1.SidebarMenuItem>
        </sidebar_1.SidebarMenu>
        <sidebar_1.SidebarMenu>
          {items.map((item) => (<sidebar_1.SidebarMenuItem key={item.label}>
              <link_1.default href={item.label === 'Dashboard' ? `/dashboard/${role}` : item.href} className="w-full space-y-1">
                <sidebar_1.SidebarMenuButton className="font-jost text-sm xl:text-base font-medium" isActive={(pathname.includes('dashboard') &&
                item.href === '/dashboard') ||
                item.href.includes(pathname)} tooltip={item.label}>
                  {item.icon && <item.icon />}
                  <span>{item.label}</span>
                </sidebar_1.SidebarMenuButton>
              </link_1.default>
            </sidebar_1.SidebarMenuItem>))}
        </sidebar_1.SidebarMenu>
      </sidebar_1.SidebarGroupContent>
    </sidebar_1.SidebarGroup>);
}
//# sourceMappingURL=nav-main.js.map