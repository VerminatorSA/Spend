
import Image from 'next/image';
import Link from 'next/link';
import { items, type Item } from '@/lib/data';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ItemsPage() {
  return (
    <div className="flex h-full flex-col">
       <Header title="Item Catalog">
        <Button asChild>
            <Link href="/add-item">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
            </Link>
        </Button>
      </Header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="rounded-t-lg object-cover"
                    data-ai-hint={`${item.category} component`}
                  />
                </div>
                <div className="p-6 pb-2">
                  <Badge variant="outline">{item.category}</Badge>
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
                <p className="text-xl font-bold">${item.price.toFixed(2)}</p>
                <Button>Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
