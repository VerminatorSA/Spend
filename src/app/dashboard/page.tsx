
'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import * as RechartsPrimitive from 'recharts';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlusCircle, ChevronDown } from 'lucide-react';
import { suppliers, items, products, type Product, type Item } from '@/lib/data';
import { SettingsContext, getCurrencySymbol } from '@/contexts/settings-context';

function calculateProductCost(product: Product, allItems: Item[]): number {
  return product.bom.reduce((total, bomItem) => {
    const item = allItems.find(i => i.id === bomItem.itemId);
    return total + (item ? item.price * bomItem.quantity : 0);
  }, 0);
}

function calculateTotalItemValue(allItems: Item[]): number {
    return allItems.reduce((total, item) => {
        return total + (item.price * item.stock);
    }, 0);
}

function calculateTotalProductValue(allProducts: Product[], allItems: Item[]): number {
    return allProducts.reduce((total, product) => {
        const productCost = calculateProductCost(product, allItems);
        // Assuming each product in the list represents one assembly
        return total + productCost;
    }, 0);
}


export default function DashboardPage() {
  const { settings } = useContext(SettingsContext);
  const currencySymbol = getCurrencySymbol(settings.currency);

  const totalItemValue = calculateTotalItemValue(items);
  const totalProductValue = calculateTotalProductValue(products, items);

  const dashboardMetrics = [
    {
      title: 'Total Suppliers',
      value: suppliers.length,
      description: 'The total number of suppliers in your directory.',
    },
    {
      title: 'Total Items',
      value: items.length,
      description: 'The total number of items in your catalog.',
    },
    {
      title: 'Total Products',
      value: products.length,
      description: 'The total number of products you have configured.',
    },
    {
      title: 'Total Item Value',
      value: `${currencySymbol}${totalItemValue.toLocaleString()}`,
      description: 'The total value of all items currently in stock.',
    },
    {
      title: 'Total Product Value',
      value: `${currencySymbol}${totalProductValue.toLocaleString()}`,
      description: 'The total cost of all configured products.',
    },
  ];

  const inventoryValueByCategory = items.reduce((acc, item) => {
    const value = item.price * item.stock;
    if (!acc[item.category]) {
      acc[item.category] = 0;
    }
    acc[item.category] += value;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(inventoryValueByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const categoryChartConfig = {
    value: {
      label: 'Value',
      color: 'hsl(var(--chart-1))',
    },
     name: {
      label: 'Category',
    },
  } satisfies React.ComponentProps<typeof ChartContainer>['config'];

  const supplierItemCount = items.reduce((acc, item) => {
    if (!acc[item.supplier]) {
      acc[item.supplier] = 0;
    }
    acc[item.supplier]++;
    return acc;
  }, {} as Record<string, number>);

  const supplierChartData = Object.entries(supplierItemCount)
    .map(([name, value]) => ({ name, value, fill: `hsl(var(--chart-${Object.keys(supplierItemCount).indexOf(name) + 1}))` }))
    .sort((a, b) => b.value - a.value);

  const supplierChartConfig = {
    value: {
      label: 'Items',
    },
    ...supplierChartData.reduce((acc, cur) => {
        acc[cur.name] = { label: cur.name, color: cur.fill };
        return acc;
    }, {} as React.ComponentProps<typeof ChartContainer>['config'])
  } satisfies React.ComponentProps<typeof ChartContainer>['config'];

  return (
    <div className="flex h-full flex-col">
      <Header title="Dashboard">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Quick Add
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/add-supplier">Add Supplier</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/add-item">Add Item</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/add-product">Add Product</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {dashboardMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold tracking-tight">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
             <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Inventory Value by Category</CardTitle>
                    <CardDescription>Showing total stock value for each item category.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={categoryChartConfig} className="h-64 w-full">
                        <BarChart accessibilityLayer data={categoryChartData} margin={{ top: 20, left: -20, right: 20 }}>
                            <RechartsPrimitive.CartesianGrid vertical={false} />
                            <RechartsPrimitive.XAxis 
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <RechartsPrimitive.YAxis 
                                tickFormatter={(value) => `${currencySymbol}${value / 1000}k`}
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                             <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                                />
                            <RechartsPrimitive.Bar dataKey="value" fill="var(--color-value)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
             </Card>
             <Card className="lg:col-span-3">
                 <CardHeader>
                    <CardTitle>Supplier Item Distribution</CardTitle>
                    <CardDescription>Top suppliers by number of distinct items offered.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <ChartContainer config={supplierChartConfig} className="h-64 w-full">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                                />
                            <RechartsPrimitive.Pie 
                                data={supplierChartData} 
                                dataKey="value" 
                                nameKey="name"
                                innerRadius={60}
                            />
                            <ChartLegend
                                content={<ChartLegendContent nameKey="name" />}
                                />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
