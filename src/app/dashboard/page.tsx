
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { suppliers, items, products } from '@/lib/data';

export default function DashboardPage() {
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Suppliers</CardTitle>
              <CardDescription>The total number of suppliers in your directory.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{suppliers.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Items</CardTitle>
              <CardDescription>The total number of items in your catalog.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{items.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
              <CardDescription>The total number of products you have configured.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{products.length}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
