
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings as SettingsIcon, Warehouse, LayoutDashboard, Users, Sparkles } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: "Dashboard"},
  { href: '/inventory', label: 'Inventory', icon: Warehouse, tooltip: "Inventory"},
  { href: '/contacts', label: 'Contacts', icon: Users, tooltip: "Contacts"},
  { href: '/settings', label: 'Settings', icon: SettingsIcon, tooltip: "Settings"},
];

export function MainNav() {
  const pathname = usePathname();

  return (
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
  );
}
