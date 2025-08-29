
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { products, items, type Product, type Item } from '@/lib/data';
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

function calculateProductCost(product: Product) {
  return product.bom.reduce((total, bomItem) => {
    const item = items.find(i => i.id === bomItem.itemId);
    return total + (item ? item.price * bomItem.quantity : 0);
  }, 0);
}

export default function InventoryPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Inventory">
         <Button asChild>
            <Link href="/add-item">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
            </Link>
        </Button>
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
                            <TableHead>Category</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead className="w-[120px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map(item => (
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
                                    <Badge variant="outline">{item.category}</Badge>
                                </TableCell>
                                <TableCell>{item.supplier}</TableCell>
                                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={item.stock > 0 ? 'secondary' : 'destructive'}>
                                        {item.stock > 0 ? `${item.stock}` : 'Out of Stock'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" disabled={item.stock === 0}>Add to Cart</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          </TabsContent>
          <TabsContent value="products" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id} className="flex flex-col">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="rounded-t-xl object-cover"
                        data-ai-hint="product image"
                      />
                    </div>
                    <div className="p-6 pb-2">
                      <CardTitle className="mt-2 text-lg">{product.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription>{product.description}</CardDescription>
                    
                    <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Bill of Materials</h4>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {product.bom.map(bomItem => {
                                        const item = items.find(i => i.id === bomItem.itemId);
                                        return (
                                            <TableRow key={bomItem.itemId}>
                                                <TableCell className="font-medium">{item ? item.name : 'Unknown Item'}</TableCell>
                                                <TableCell className="text-right">{bomItem.quantity}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <p className="text-xl font-bold">Cost: ${calculateProductCost(product).toFixed(2)}</p>
                    <Button>Add to Quote</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
