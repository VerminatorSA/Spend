'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Package, Lightbulb, Mail, Settings as SettingsIcon, PlusCircle } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
  { href: '/suppliers', label: 'Suppliers', icon: Users, tooltip: "Supplier Directory"},
  { href: '/add-supplier', label: 'Add Supplier', icon: PlusCircle, tooltip: "Add New Supplier"},
  { href: '/products', label: 'Products', icon: Package, tooltip: "Product Management"},
  { href: '/add-product', label: 'Add Product', icon: PlusCircle, tooltip: "Add New Product"},
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
