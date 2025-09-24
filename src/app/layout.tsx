import { Inter } from 'next/font/google';
import { AppContent } from '@/components/app-content';
import './globals.css';
import { ClientBody } from '@/components/client-body';

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
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <ClientBody>
        <AppContent>{children}</AppContent>
      </ClientBody>
    </html>
  );
}
