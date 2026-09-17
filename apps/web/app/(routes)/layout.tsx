import { SidebarProvider } from '@/components/ui/sidebar';
import ProtectedRoute from '@/components/providers/protected-route';
import { DashboardProvider } from '@/components/providers/dashboard-provider';
import { SocketProvider } from '@/components/providers/socket-context';
import { MainComponent } from '@/app/(routes)/page';

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
                '--sidebar-width': 'calc(var(--spacing) * 60)',
                '--header-height': 'calc(var(--spacing) * 12)',
              } as React.CSSProperties
            }
          >
            <MainComponent>{children}</MainComponent>
          </SidebarProvider>
        </SocketProvider>
      </DashboardProvider>
    </ProtectedRoute>
  );
}
