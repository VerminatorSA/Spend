import Image from 'next/image';
import { suppliers, type Supplier } from '@/lib/data';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Mail, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SuppliersPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Supplier Directory" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{supplier.name}</CardTitle>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <Globe className="mr-1.5 h-4 w-4" />
                      <span>{supplier.location}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{supplier.itemsOffered} Items</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between">
                <div className="space-y-3 text-sm">
                  <p className="font-medium">Primary Contact</p>
                  <div className="flex items-center text-muted-foreground">
                    <User className="mr-2 h-4 w-4" />
                    <span>{supplier.contact.name}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    <a href={`mailto:${supplier.contact.email}`} className="hover:text-primary">
                      {supplier.contact.email}
                    </a>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="mr-2 h-4 w-4" />
                    <span>{supplier.contact.phone}</span>
                  </div>
                </div>
                <Button className="mt-6 w-full" variant="outline">View Items</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
