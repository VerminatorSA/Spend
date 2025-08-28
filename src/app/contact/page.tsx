import { suppliers } from '@/lib/data';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Contact Hub" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <p className="text-muted-foreground">
            Connect with sales representatives from our trusted vendors.
          </p>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {supplier.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">Rep: {supplier.contact.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <a href={`mailto:${supplier.contact.email}`}>
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href={`tel:${supplier.contact.phone}`}>
                          <Phone className="h-4 w-4" />
                          <span className="sr-only">Call</span>
                        </a>
                      </Button>
                      <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Schedule Meeting</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
