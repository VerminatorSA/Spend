
import Image from 'next/image';
import { products, items, type Product } from '@/lib/data';
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

function calculateProductCost(product: Product) {
  return product.bom.reduce((total, bomItem) => {
    const item = items.find(i => i.id === bomItem.itemId);
    return total + (item ? item.price * bomItem.quantity : 0);
  }, 0);
}

export default function ProductsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Product Catalog" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="rounded-t-lg object-cover"
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
                <p className="text-xl font-bold">${calculateProductCost(product).toFixed(2)}</p>
                <Button>Add to Quote</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
