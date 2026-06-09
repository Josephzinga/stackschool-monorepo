import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ProtectedRoute from '@/components/providers/protected-route';
import { DashboardProvider } from '@/components/providers/dashboard-provider';
import { Toaster } from '@/components/ui/sonner';
import { SocketProvider } from '@/lib/socket-context';

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
                '--sidebar-width': 'calc(var(--spacing) * 72)',
                '--header-height': 'calc(var(--spacing) * 12)',
              } as React.CSSProperties
            }
          >
            <div>
              <AppSidebar variant="inset" />
            </div>
            <SidebarInset>
              <SiteHeader />

              <Toaster
                position="bottom-right"
                className="bg-sky-500! text-lg"
                duration={5000}
                id="dashboard"
              />

              {children}
            </SidebarInset>
          </SidebarProvider>
        </SocketProvider>
      </DashboardProvider>
    </ProtectedRoute>
  );
}
