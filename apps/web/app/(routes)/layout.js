"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardLayout;
const app_sidebar_1 = require("@/components/app-sidebar");
const site_header_1 = require("@/components/site-header");
const sidebar_1 = require("@/components/ui/sidebar");
const protected_route_1 = __importDefault(require("@/components/providers/protected-route"));
const dashboard_provider_1 = require("@/components/providers/dashboard-provider");
const sonner_1 = require("@/components/ui/sonner");
const socket_context_1 = require("@/lib/socket-context");
function DashboardLayout({ children, }) {
    return (<protected_route_1.default>
      <dashboard_provider_1.DashboardProvider>
        <socket_context_1.SocketProvider>
          <sidebar_1.SidebarProvider style={{
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
        }}>
            <div>
              <app_sidebar_1.AppSidebar variant="inset"/>
            </div>
            <sidebar_1.SidebarInset>
              <site_header_1.SiteHeader />

              <sonner_1.Toaster position="bottom-right" className="bg-sky-500! text-lg" duration={5000} id="dashboard"/>

              {children}
            </sidebar_1.SidebarInset>
          </sidebar_1.SidebarProvider>
        </socket_context_1.SocketProvider>
      </dashboard_provider_1.DashboardProvider>
    </protected_route_1.default>);
}
//# sourceMappingURL=layout.js.map