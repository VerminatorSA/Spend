
'use client';

import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products, items, suppliers, type Product, type Item } from '@/lib/data';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import { SettingsContext, getCurrencySymbol } from '@/contexts/settings-context';
import { generateItemTags } from '@/lib/utils';

function calculateProductCost(product: Product) {
  return product.bom.reduce((total, bomItem) => {
    const item = items.find(i => i.id === bomItem.itemId);
    return total + (item ? item.price * bomItem.quantity : 0);
  }, 0);
}

export default function InventoryPage() {
  const { settings } = useContext(SettingsContext);
  const currencySymbol = getCurrencySymbol(settings.currency);

  const getStockVariant = (stock: number, reorderLevel: number): 'secondary' | 'destructive' | 'outline' => {
    if (stock === 0) return 'destructive';
    if (stock < reorderLevel) return 'outline';
    return 'secondary';
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Inventory">
         <div className="flex items-center gap-2">
            <Button asChild>
                <Link href="/add-item">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Item
                </Link>
            </Button>
            <Button asChild>
                <Link href="/add-product">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                </Link>
            </Button>
         </div>
      </Header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Tabs defaultValue="items">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="items" className="mt-6">
            <div className="rounded-xl border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead className="w-[120px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map(item => {
                          const supplier = suppliers.find(s => s.name === item.supplier);
                          const stockVariant = getStockVariant(item.stock, item.reorderLevel);
                          const tags = generateItemTags(item);
                          return (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Image 
                                        src={item.imageUrl} 
                                        alt={item.name} 
                                        width={64} 
                                        height={64} 
                                        className="rounded-md object-cover" 
                                        data-ai-hint={`${item.category} component`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {tags.map(tag => (
                                      <Badge key={tag} variant="outline">{tag}</Badge>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell>{item.supplier}</TableCell>
                                <TableCell className="text-right">{currencySymbol}{item.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={stockVariant} className={stockVariant === 'outline' ? 'border-yellow-500 text-yellow-500' : ''}>
                                        {item.stock > 0 ? `${item.stock} units` : 'Out of Stock'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" asChild disabled={!supplier}>
                                      <Link href={supplier ? `/contact/${supplier.id}` : '#'}>Reorder</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                </Table>
            </div>
          </TabsContent>
          <TabsContent value="products" className="mt-6">
            <div className="rounded-xl border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Cost</TableHead>
                            <TableHead className="w-[140px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map(product => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Image 
                                        src={product.imageUrl} 
                                        alt={product.name} 
                                        width={64} 
                                        height={64} 
                                        className="rounded-md object-cover" 
                                        data-ai-hint="product image"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell className="max-w-xs truncate text-muted-foreground">{product.description}</TableCell>
                                <TableCell className="text-right font-medium">{currencySymbol}{calculateProductCost(product).toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm">Add to Quote</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
