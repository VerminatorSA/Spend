
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Warehouse, Users, AreaChart } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { AiTicker } from './ai-ticker';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: "Dashboard"},
  { href: '/inventory', label: 'Inventory', icon: Warehouse, tooltip: "Inventory"},
  { href: '/contacts', label: 'Contacts', icon: Users, tooltip: "Contacts"},
  { href: '/reports', label: 'Reports', icon: AreaChart, tooltip: "Reports"},
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <AiTicker />
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href) && (item.href === '/' ? pathname === '/' : true)}
              tooltip={item.tooltip}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
