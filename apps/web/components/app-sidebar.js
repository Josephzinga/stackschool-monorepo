'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSidebar = AppSidebar;
const React = __importStar(require("react"));
const nav_documents_1 = require("@/components/nav-documents");
const nav_main_1 = require("@/components/nav-main");
const nav_user_1 = require("@/components/nav-user");
const sidebar_1 = require("@/components/ui/sidebar");
const data_1 = require("@/lib/data");
const ui_1 = require("@stackschool/ui");
const avatar_1 = require("@/components/ui/avatar");
const lucide_react_1 = require("lucide-react");
const dashboard_provider_1 = require("./providers/dashboard-provider");
function AppSidebar({ ...props }) {
    const { currentSchool, user } = (0, ui_1.useUserStore)();
    let role = 'GUEST';
    try {
        const dashboard = (0, dashboard_provider_1.useDashboard)();
        role = dashboard.me?.schoolContext?.role;
    }
    catch (e) {
        role = currentSchool
            ? user?.memberships?.find((m) => m?.school?.id === currentSchool?.id)
                ?.role || 'GUEST'
            : 'GUEST';
    }
    const filteredNavMain = data_1.menuItems.navMain.filter((item) => !item.visible || item.visible.includes(role));
    const filteredDocuments = data_1.menuItems.documents.filter((item) => !item.visible || item.visible.includes(role));
    const userData = {
        name: user?.username || 'Utilisateur',
        email: user?.email || '',
        avatar: user?.profile?.photo || '',
    };
    return (<sidebar_1.Sidebar collapsible="offcanvas" {...props}>
      <sidebar_1.SidebarHeader>
        <sidebar_1.SidebarMenu>
          <sidebar_1.SidebarMenuItem>
            <sidebar_1.SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5! h-14">
              <a href="#">
                <avatar_1.Avatar className="w-11 h-11 rounded-xl">
                  <avatar_1.AvatarImage src={currentSchool?.logo ?? undefined}/>
                  <avatar_1.AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                    <lucide_react_1.School className="h-6 w-6"/>
                  </avatar_1.AvatarFallback>
                </avatar_1.Avatar>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-poppins font-semibold truncate w-full">
                    {currentSchool?.name}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {role.toLowerCase()}
                  </span>
                </div>
              </a>
            </sidebar_1.SidebarMenuButton>
          </sidebar_1.SidebarMenuItem>
        </sidebar_1.SidebarMenu>
      </sidebar_1.SidebarHeader>
      <sidebar_1.SidebarContent>
        <nav_main_1.NavMain items={filteredNavMain}/>
        <nav_documents_1.NavDocuments items={filteredDocuments}/>
      </sidebar_1.SidebarContent>
      <sidebar_1.SidebarFooter>
        <nav_user_1.NavUser user={userData}/>
      </sidebar_1.SidebarFooter>
    </sidebar_1.Sidebar>);
}
//# sourceMappingURL=app-sidebar.js.map