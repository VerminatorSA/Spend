
'use client';

import { ReactNode } from 'react';
import { Sidebar, SidebarHeader, SidebarContent } from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';

export function AppShell({ children }: { children: ReactNode }) {

  return (
    <>
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <MainNav />
            </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col md:ml-[var(--sidebar-width-icon)]">
            <main className="flex-1">
                {children}
            </main>
        </div>
    </>
  );
}
