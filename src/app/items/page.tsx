'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { items, type Item } from '@/lib/data';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle, LayoutGrid, List } from 'lucide-react';

export default function ItemsPage() {
  const [view, setView] = useState('grid');
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const filteredItems = categoryFilter
    ? items.filter((item) => item.category === categoryFilter)
    : items;
  
  const pageTitle = categoryFilter ? `Items: ${categoryFilter}` : "Item Catalog";

  return (
    <div className="flex h-full flex-col">
       <Header title={pageTitle}>
          <div className="flex items-center gap-2">
            <div className="hidden rounded-lg bg-muted p-1 md:flex">
                <Button 
                    variant={view === 'grid' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setView('grid')}
                    aria-label="Grid View"
                >
                    <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                    variant={view === 'list' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setView('list')}
                    aria-label="List View"
                >
                    <List className="h-4 w-4" />
                </Button>
            </div>
            <Button asChild>
                <Link href="/add-item">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Item
                </Link>
            </Button>
          </div>
      </Header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        {view === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
                <Card key={item.id} className="flex flex-col">
                <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="rounded-t-xl object-cover"
                        data-ai-hint={`${item.category} component`}
                    />
                    </div>
                    <div className="p-6 pb-2">
                    <div className="flex items-center justify-between">
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge variant={item.stock > 0 ? 'secondary' : 'destructive'}>
                            {item.stock > 0 ? `${item.stock} in Stock` : 'Out of Stock'}
                        </Badge>
                    </div>
                    <CardTitle className="mt-2 text-lg">{item.name}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                    <CardDescription>{item.description}</CardDescription>
                    <p className="mt-2 text-sm text-muted-foreground">
                    Supplier: <span className="font-medium text-foreground">{item.supplier}</span>
                    </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <p className="text-xl font-bold">${item.price.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ unit</span></p>
                    <Button disabled={item.stock === 0}>Add to Cart</Button>
                </CardFooter>
                </Card>
            ))}
            </div>
        ) : (
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
                        {filteredItems.map(item => (
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
        )}
      </main>
    </div>
  );
}
