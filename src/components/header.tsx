
'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header({ title, children }: { title: string, children?: React.ReactNode }) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b bg-card p-4 md:p-6">
        <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
        </div>
        <div>
            {children}
        </div>
    </header>
  );
}
