import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ProtectedRoute from '@/components/providers/protected-route';
import { DashboardProvider } from '@/components/providers/dashboard-provider';
import { Toaster } from '@/components/ui/toast';
import { SocketProvider } from '@/components/providers/socket-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardProvider>
        <SocketProvider>
          <SidebarProvider
            style={
              {
                '--sidebar-width': 'calc(var(--spacing) * 64)',
                '--header-height': 'calc(var(--spacing) * 12)',
              } as React.CSSProperties
            }
          >
            <AppSidebar className="z-30" variant="sidebar" collapsible="icon" />

            <SidebarInset>
              <SiteHeader />

              <Toaster />

              {children}
            </SidebarInset>
          </SidebarProvider>
        </SocketProvider>
      </DashboardProvider>
    </ProtectedRoute>
  );
}
