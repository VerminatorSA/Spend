
'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlusCircle, ChevronDown } from 'lucide-react';
import { suppliers, items, products, type Product, type Item } from '@/lib/data';
import { SettingsContext, getCurrencySymbol } from '@/contexts/settings-context';

function calculateProductCost(product: Product, allItems: Item[]): number {
  return product.bom.reduce((total, bomItem) => {
    const item = allItems.find(i => i.id === bomItem.itemId);
    return total + (item ? item.price * bomItem.quantity : 0);
  }, 0);
}

function calculateTotalItemValue(allItems: Item[]): number {
    return allItems.reduce((total, item) => {
        return total + (item.price * item.stock);
    }, 0);
}

function calculateTotalProductValue(allProducts: Product[], allItems: Item[]): number {
    return allProducts.reduce((total, product) => {
        return total + calculateProductCost(product, allItems);
    }, 0);
}

export default function DashboardPage() {
  const { settings } = useContext(SettingsContext);
  const currencySymbol = getCurrencySymbol(settings.currency);

  const totalItemValue = calculateTotalItemValue(items);
  const totalProductValue = calculateTotalProductValue(products, items);

  return (
    <div className="flex h-full flex-col">
      <Header title="Dashboard">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Quick Add
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/add-supplier">Add Supplier</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/add-item">Add Item</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/add-product">Add Product</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="flex flex-col">
              <h3 className="text-lg font-medium text-muted-foreground">Total Suppliers</h3>
              <p className="text-5xl font-bold tracking-tight">{suppliers.length}</p>
              <p className="text-sm text-muted-foreground">The total number of suppliers in your directory.</p>
          </div>
          <div className="flex flex-col">
              <h3 className="text-lg font-medium text-muted-foreground">Total Items</h3>
              <p className="text-5xl font-bold tracking-tight">{items.length}</p>
              <p className="text-sm text-muted-foreground">The total number of items in your catalog.</p>
          </div>
          <div className="flex flex-col">
              <h3 className="text-lg font-medium text-muted-foreground">Total Products</h3>
              <p className="text-5xl font-bold tracking-tight">{products.length}</p>
              <p className="text-sm text-muted-foreground">The total number of products you have configured.</p>
          </div>
          <div className="flex flex-col">
              <h3 className="text-lg font-medium text-muted-foreground">Total Item Value</h3>
              <p className="text-5xl font-bold tracking-tight">{currencySymbol}{totalItemValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">The total value of all items currently in stock.</p>
          </div>
           <div className="flex flex-col">
              <h3 className="text-lg font-medium text-muted-foreground">Total Product Value</h3>
              <p className="text-5xl font-bold tracking-tight">{currencySymbol}{totalProductValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">The total cost of all configured products.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
