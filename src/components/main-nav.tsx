
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lightbulb, Settings as SettingsIcon, Warehouse, LayoutDashboard, Building } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: "Dashboard"},
  { href: '/inventory', label: 'Inventory', icon: Warehouse, tooltip: "Inventory"},
  { href: '/suggestions', label: 'Suggestions', icon: Lightbulb, tooltip: "Smart Suggestions"},
  { href: '/contact', label: 'Suppliers', icon: Building, tooltip: "Suppliers"},
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
