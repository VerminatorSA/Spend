import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { AppContent } from '@/components/app-content';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Spend',
  description: 'A spend management application for purchasing managers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`font-sans antialiased ${inter.variable}`}>
        <AuthProvider>
          <SettingsProvider>
            <SidebarProvider>
              <AppContent>{children}</AppContent>
              <Toaster />
            </SidebarProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
