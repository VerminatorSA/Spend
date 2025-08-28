import Image from 'next/image';
import { products, type Product } from '@/lib/data';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Product Catalog" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="rounded-t-lg object-cover"
                    data-ai-hint={`${product.category} component`}
                  />
                </div>
                <div className="p-6 pb-2">
                  <Badge variant="outline">{product.category}</Badge>
                  <CardTitle className="mt-2 text-lg">{product.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription>{product.description}</CardDescription>
                <p className="mt-2 text-sm text-muted-foreground">
                  Supplier: <span className="font-medium text-foreground">{product.supplier}</span>
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
                <Button>Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
