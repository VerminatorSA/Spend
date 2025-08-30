
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { items, products, suppliers, contacts, type Item, type Product, type Supplier } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function searchData(query: string) {
    const lowerCaseQuery = query.toLowerCase();

    const filteredItems = items.filter(item => 
        Object.values(item).some(value => 
            String(value).toLowerCase().includes(lowerCaseQuery)
        )
    );

    const filteredProducts = products.filter(product => {
        const bomItems = product.bom.map(bomItem => items.find(i => i.id === bomItem.itemId)?.name || '').join(' ');
        return Object.values(product).some(value => 
            String(value).toLowerCase().includes(lowerCaseQuery)
        ) || bomItems.toLowerCase().includes(lowerCaseQuery);
    });

    const filteredSuppliers = suppliers.filter(supplier => {
        const supplierContacts = contacts.filter(c => c.supplierId === supplier.id);
        const contactMatch = supplierContacts.some(c => 
            c.name.toLowerCase().includes(lowerCaseQuery) || 
            c.email.toLowerCase().includes(lowerCaseQuery)
        );

        return Object.values(supplier).some(value => 
            String(value).toLowerCase().includes(lowerCaseQuery)
        ) || contactMatch;
    });

    return {
        items: filteredItems,
        products: filteredProducts,
        suppliers: filteredSuppliers,
    }
}

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<{ items: Item[], products: Product[], suppliers: Supplier[] }>({ items: [], products: [], suppliers: [] });

    useEffect(() => {
        if (query) {
            setResults(searchData(query));
        } else {
            setResults({ items: [], products: [], suppliers: [] });
        }
    }, [query]);

    if (!query) {
        return <div className="text-center text-muted-foreground">Please enter a search term to begin.</div>
    }
    
    const totalResults = results.items.length + results.products.length + results.suppliers.length;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">
                {totalResults > 0 ? `Found ${totalResults} results for "${query}"` : `No results found for "${query}"`}
            </h2>

            {results.items.length > 0 && (
                <section>
                    <h3 className="text-xl font-semibold mb-4">Items ({results.items.length})</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {results.items.map(item => (
                            <Card key={item.id}>
                                <CardHeader>
                                    <Image src={item.imageUrl} alt={item.name} width={400} height={200} className="rounded-t-lg object-cover" data-ai-hint={`${item.category} component`} />
                                    <CardTitle className="pt-4">{item.name}</CardTitle>
                                    <CardDescription>{item.supplier}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Badge variant="outline">{item.category}</Badge>
                                    <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {results.products.length > 0 && (
                 <section>
                    <h3 className="text-xl font-semibold mb-4">Products ({results.products.length})</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {results.products.map(product => (
                            <Card key={product.id}>
                                <CardHeader>
                                     <Image src={product.imageUrl} alt={product.name} width={400} height={200} className="rounded-t-lg object-cover" data-ai-hint="product image" />
                                    <CardTitle className="pt-4">{product.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">{product.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {results.suppliers.length > 0 && (
                 <section>
                    <h3 className="text-xl font-semibold mb-4">Suppliers ({results.suppliers.length})</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {results.suppliers.map(supplier => {
                            const primaryContact = contacts.find(c => c.supplierId === supplier.id && c.isPrimary);
                            return (
                                <Card key={supplier.id}>
                                    <CardHeader>
                                        <CardTitle>{supplier.name}</CardTitle>
                                        <CardDescription>{supplier.location}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {primaryContact && (
                                            <>
                                                <p className="text-sm"><span className="font-semibold">Contact:</span> {primaryContact.name}</p>
                                                <p className="text-sm text-muted-foreground">{primaryContact.email}</p>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </section>
            )}
        </div>
    )
}

export default function SearchPage() {
    return (
        <div className="flex h-full flex-col">
            <Header title="Search" />
            <main className="flex-1 overflow-auto p-4 md:p-6">
                <div className="mx-auto max-w-7xl">
                    <Suspense fallback={<div>Loading...</div>}>
                      <SearchResults />
                    </Suspense>
                </div>
            </main>
        </div>
    )
}
