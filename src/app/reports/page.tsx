
'use client';

import { useState, useContext } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { items, suppliers, type Item, type Supplier } from '@/lib/data';
import { SettingsContext, getCurrencySymbol } from '@/contexts/settings-context';
import { generateItemTags } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { BarChart } from 'lucide-react';

type ReportType = 'inventory-summary' | 'supplier-overview' | null;

export default function ReportsPage() {
    const { settings } = useContext(SettingsContext);
    const currencySymbol = getCurrencySymbol(settings.currency);

    const [reportType, setReportType] = useState<ReportType>(null);
    const [reportData, setReportData] = useState<any[] | null>(null);
    const [generatedReportType, setGeneratedReportType] = useState<ReportType>(null);

    const handleGenerateReport = () => {
        if (!reportType) return;

        let data;
        if (reportType === 'inventory-summary') {
            data = items.map(item => ({
                id: item.id,
                name: item.name,
                category: item.category,
                supplier: item.supplier,
                price: item.price,
                stock: item.stock,
                value: item.price * item.stock,
                status: item.stock === 0 ? 'Out of Stock' : (item.stock < item.reorderLevel ? 'Low Stock' : 'In Stock'),
            }));
        } else if (reportType === 'supplier-overview') {
            data = suppliers.map(supplier => ({
                id: supplier.id,
                name: supplier.name,
                location: supplier.location,
                itemsOffered: supplier.itemsOffered,
                contact: supplier.contact.name,
            }));
        }
        setReportData(data);
        setGeneratedReportType(reportType);
    };

    const renderReport = () => {
        if (!reportData || !generatedReportType) {
            return (
                 <div className="text-center text-muted-foreground py-12">
                    <BarChart className="mx-auto h-12 w-12" />
                    <h3 className="mt-4 text-lg font-semibold">Generate a Report</h3>
                    <p className="mt-1 text-sm">Select a report type and click "Generate" to view data.</p>
                </div>
            );
        }

        if (generatedReportType === 'inventory-summary') {
            return (
                 <Card>
                    <CardHeader>
                        <CardTitle>Inventory Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Stock</TableHead>
                                    <TableHead className="text-right">Total Value</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportData.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell>{item.supplier}</TableCell>
                                        <TableCell className="text-right">{currencySymbol}{item.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{item.stock}</TableCell>
                                        <TableCell className="text-right">{currencySymbol}{item.value.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={item.status === 'Out of Stock' ? 'destructive' : (item.status === 'Low Stock' ? 'outline' : 'secondary')}
                                                className={item.status === 'Low Stock' ? 'border-yellow-500 text-yellow-500' : ''}
                                            >
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            );
        }

        if (generatedReportType === 'supplier-overview') {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle>Supplier Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Supplier Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead className="text-right">Items Offered</TableHead>
                                    <TableHead>Primary Contact</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportData.map(supplier => (
                                    <TableRow key={supplier.id}>
                                        <TableCell className="font-medium">{supplier.name}</TableCell>
                                        <TableCell>{supplier.location}</TableCell>
                                        <TableCell className="text-right">{supplier.itemsOffered}</TableCell>
                                        <TableCell>{supplier.contact}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            );
        }
    };

    return (
        <div className="flex h-full flex-col">
            <Header title="Reports" />
            <main className="flex-1 overflow-auto p-4 md:p-6">
                <div className="mx-auto max-w-6xl space-y-8">
                     <div>
                        <h2 className="text-2xl font-bold">Report Generator</h2>
                        <p className="text-muted-foreground">
                            Select and generate reports to gain insights into your operations.
                        </p>
                    </div>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col items-center gap-4 sm:flex-row">
                                <div className="w-full flex-1">
                                    <Select value={reportType || ''} onValueChange={(value) => setReportType(value as ReportType)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a report type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="inventory-summary">Inventory Summary</SelectItem>
                                            <SelectItem value="supplier-overview">Supplier Overview</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleGenerateReport} disabled={!reportType} className="w-full sm:w-auto">
                                    Generate Report
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8">
                        {renderReport()}
                    </div>
                </div>
            </main>
        </div>
    );
}
