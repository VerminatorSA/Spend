
'use client';

import Link from 'next/link';
import { suppliers } from '@/lib/data';
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

export default function ContactsPage() {
  const allContacts = suppliers.map(supplier => ({
    ...supplier.contact,
    supplierName: supplier.name,
    supplierId: supplier.id,
  }));

  return (
    <div className="flex h-full flex-col">
      <Header title="Contacts" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
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
      </main>
    </div>
  );
}
