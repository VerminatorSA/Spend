
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Package, Lightbulb, Mail, Settings as SettingsIcon, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: "Dashboard"},
  { href: '/suppliers', label: 'Suppliers', icon: Users, tooltip: "Supplier Directory"},
  { href: '/items', label: 'Items', icon: Package, tooltip: "Item Management"},
  { href: '/products', label: 'Products', icon: ShoppingCart, tooltip: "Product Management"},
  { href: '/suggestions', label: 'Suggestions', icon: Lightbulb, tooltip: "Smart Suggestions"},
  { href: '/contact', label: 'Contact Hub', icon: Mail, tooltip: "Contact Hub"},
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
            isActive={pathname.startsWith(item.href)}
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
