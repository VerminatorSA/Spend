
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { suppliers, contacts } from '@/lib/data';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Mail, Phone, User, PlusCircle, LayoutGrid, List } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

function ContactDialog({ supplierId, supplierName }: { supplierId: string, supplierName: string }) {
    const { toast } = useToast();
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!message) {
            toast({
                variant: 'destructive',
                title: 'Message cannot be empty',
            });
            return;
        }
        console.log(`Sending message to ${supplierName} (${supplierId}): ${message}`);
        toast({
            title: 'Message Sent',
            description: `Your message has been sent to ${supplierName}.`,
        });
        setMessage('');
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm">Contact</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Contact {supplierName}</DialogTitle>
                    <DialogDescription>
                        Compose your message below. It will be sent to the primary contact for this supplier.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                            id="message" 
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </div>
                 <DialogClose asChild>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={handleSend}>Send Message</Button>
                    </div>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}


export default function ContactsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex h-full flex-col">
      <Header title="Contacts & Suppliers">
        <div className="flex items-center gap-2">
            <Button asChild>
                <Link href="/add-supplier">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Supplier
                </Link>
            </Button>
        </div>
      </Header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mb-4 flex justify-end gap-2">
              <Button variant={view === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setView('grid')}>
                  <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant={view === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setView('list')}>
                  <List className="h-4 w-4" />
              </Button>
          </div>
          {view === 'grid' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suppliers.map((supplier) => {
                  const primaryContact = contacts.find(c => c.supplierId === supplier.id && c.isPrimary);
                  return (
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
                      {primaryContact ? (
                          <div className="space-y-3 text-sm">
                          <p className="font-medium">Primary Contact</p>
                          <div className="flex items-center text-muted-foreground">
                              <User className="mr-2 h-4 w-4" />
                              <span>{primaryContact.name}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                              <Mail className="mr-2 h-4 w-4" />
                              <a href={`mailto:${primaryContact.email}`} className="hover:text-primary">
                              {primaryContact.email}
                              </a>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                              <Phone className="mr-2 h-4 w-4" />
                              <span>{primaryContact.phone}</span>
                          </div>
                          </div>
                      ) : (
                          <div className="text-sm text-muted-foreground">No primary contact.</div>
                      )}
                      <div className="mt-6 flex gap-2">
                          <ContactDialog supplierId={supplier.id} supplierName={supplier.name} />
                      </div>
                  </CardContent>
                  </Card>
                  )
              })}
              </div>
          ) : (
              <div className="rounded-xl border">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Supplier Name</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead className="text-center">Items</TableHead>
                              <TableHead className="w-[100px]"></TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {suppliers.map(supplier => {
                              const primaryContact = contacts.find(c => c.supplierId === supplier.id && c.isPrimary);
                              return (
                              <TableRow key={supplier.id}>
                                  <TableCell className="font-medium">{supplier.name}</TableCell>
                                  <TableCell className="text-muted-foreground">{supplier.location}</TableCell>
                                  <TableCell>
                                      {primaryContact ? (
                                          <div className="flex flex-col">
                                              <span>{primaryContact.name}</span>
                                              <a href={`mailto:${primaryContact.email}`} className="text-xs text-muted-foreground hover:text-primary">
                                                  {primaryContact.email}
                                              </a>
                                          </div>
                                      ) : (
                                          <span className="text-xs text-muted-foreground">No primary contact</span>
                                      )}
                                  </TableCell>
                                  <TableCell className="text-center text-muted-foreground">{supplier.itemsOffered}</TableCell>
                                  <TableCell className="text-right">
                                      <ContactDialog supplierId={supplier.id} supplierName={supplier.name} />
                                  </TableCell>
                              </TableRow>
                          )})}
                      </TableBody>
                  </Table>
              </div>
          )}
      </main>
    </div>
  );
}
