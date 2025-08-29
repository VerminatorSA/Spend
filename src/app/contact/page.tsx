
'use client';

import Link from 'next/link';
import { suppliers } from '@/lib/data';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Mail, Phone, User, PlusCircle } from 'lucide-react';
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

export default function SuppliersPage() {
  const allContacts = suppliers.map(supplier => ({
    ...supplier.contact,
    supplierName: supplier.name,
    supplierId: supplier.id,
  }));

  return (
    <div className="flex h-full flex-col">
      <Header title="Suppliers">
        <Button asChild>
            <Link href="/add-supplier">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Supplier
            </Link>
        </Button>
      </Header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Tabs defaultValue="suppliers">
            <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
                    <TabsTrigger value="contacts">Contacts</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="suppliers" className="mt-6">
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
                        <div className="mt-6 flex gap-2">
                            <Button asChild className="flex-1">
                                <Link href={`/contact/${supplier.id}`}>Contact</Link>
                            </Button>
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </TabsContent>
            <TabsContent value="contacts" className="mt-6">
                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Contact Name</TableHead>
                                <TableHead>Supplier</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className="w-[120px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allContacts.map((contact, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{contact.name}</TableCell>
                                    <TableCell>
                                      <Link href={`/contact/${contact.supplierId}`} className="hover:underline">
                                        {contact.supplierName}
                                      </Link>
                                    </TableCell>
                                    <TableCell>
                                        <a href={`mailto:${contact.email}`} className="text-muted-foreground hover:text-primary">
                                            {contact.email}
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{contact.phone}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" asChild>
                                          <Link href={`/contact/${contact.supplierId}`}>
                                            Send Message
                                          </Link>
                                        </Button>
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
