'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavDocuments = NavDocuments;
const icons_react_1 = require("@tabler/icons-react");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const sidebar_1 = require("@/components/ui/sidebar");
const link_1 = __importDefault(require("next/link"));
function NavDocuments({ items, }) {
    const { isMobile } = (0, sidebar_1.useSidebar)();
    return (<sidebar_1.SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <sidebar_1.SidebarGroupLabel>Autre</sidebar_1.SidebarGroupLabel>
      <sidebar_1.SidebarMenu>
        {items.map((item) => (<sidebar_1.SidebarMenuItem key={item.label}>
            <sidebar_1.SidebarMenuButton asChild>
              <link_1.default href={item.href}>
                <item.icon />
                <span className="text-sm">{item.label} </span>
              </link_1.default>
            </sidebar_1.SidebarMenuButton>
            <dropdown_menu_1.DropdownMenu>
              <dropdown_menu_1.DropdownMenuTrigger asChild>
                <sidebar_1.SidebarMenuAction showOnHover className="data-[state=open]:bg-accent rounded-sm">
                  <icons_react_1.IconDots />
                  <span className="sr-only">More</span>
                </sidebar_1.SidebarMenuAction>
              </dropdown_menu_1.DropdownMenuTrigger>
              <dropdown_menu_1.DropdownMenuContent className="w-24 rounded-lg" side={isMobile ? 'bottom' : 'right'} align={isMobile ? 'end' : 'start'}>
                <dropdown_menu_1.DropdownMenuItem>
                  <icons_react_1.IconFolder />
                  <span>Open</span>
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem>
                  <icons_react_1.IconShare3 />
                  <span>Share</span>
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuSeparator />
                <dropdown_menu_1.DropdownMenuItem variant="destructive">
                  <icons_react_1.IconTrash />
                  <span>Delete</span>
                </dropdown_menu_1.DropdownMenuItem>
              </dropdown_menu_1.DropdownMenuContent>
            </dropdown_menu_1.DropdownMenu>
          </sidebar_1.SidebarMenuItem>))}
        <sidebar_1.SidebarMenuItem>
          <sidebar_1.SidebarMenuButton className="text-sidebar-foreground/70">
            <icons_react_1.IconDots className="text-sidebar-foreground/70"/>
            <span>More</span>
          </sidebar_1.SidebarMenuButton>
        </sidebar_1.SidebarMenuItem>
      </sidebar_1.SidebarMenu>
    </sidebar_1.SidebarGroup>);
}
//# sourceMappingURL=nav-documents.js.map