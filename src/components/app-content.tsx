
'use client';

import { useContext, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AuthContext, AuthProvider } from '@/contexts/auth-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { Sidebar, SidebarHeader, SidebarContent, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { MainNav } from '@/components/main-nav';
import { Command } from 'lucide-react';

const publicRoutes = ['/login', '/signup'];

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext);
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute || !user) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2.5 p-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Command className="h-5 w-5" />
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                <h1 className="text-lg font-bold text-sidebar-foreground">Spend</h1>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col md:ml-[var(--sidebar-width)] group-data-[collapsible=icon]/sidebar-wrapper:md:ml-[var(--sidebar-width-icon)] transition-[margin-left] ease-in-out duration-200">
          <main className="flex-1">
              {children}
          </main>
        </div>
    </div>
  );
}

export function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <SidebarProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </SidebarProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
