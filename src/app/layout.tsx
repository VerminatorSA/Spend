
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { Command } from 'lucide-react';
import { SettingsProvider } from '@/contexts/settings-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Spend',
  description: 'A spend management application for purchasing managers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`font-sans antialiased ${inter.variable}`}>
        <SettingsProvider>
          <div className="relative flex min-h-screen flex-col">
            <SidebarProvider>
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
            </SidebarProvider>
          </div>
        </SettingsProvider>
        <Toaster />
      </body>
    </html>
  );
}
