
'use client';

import { Header } from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { FileText, ChevronRight, User, Package, ShoppingCart, Mail, Users, Building, GitFork } from 'lucide-react';


const formSettingsSections = [
    { 
        href: '/settings/forms/supplier', 
        title: 'Supplier Form', 
        description: 'Customize the fields for adding new suppliers.', 
        icon: User
    },
    { 
        href: '/settings/forms/item', 
        title: 'Item Form', 
        description: 'Customize the fields for adding new items.', 
        icon: Package
    },
    { 
        href: '/settings/forms/product', 
        title: 'Product Form', 
        description: 'Customize the fields for creating new products.', 
        icon: ShoppingCart
    },
    { 
        href: '/settings/forms/contact', 
        title: 'Contact Form', 
        description: 'Customize the fields for the supplier contact form.', 
        icon: Mail
    },
    {
        href: '/settings/forms/user',
        title: 'User Form',
        description: 'Customize the fields for adding new users.',
        icon: Users
    },
    {
        href: '/settings/forms/company',
        title: 'Company Form',
        description: 'Customize the fields for adding new companies.',
        icon: Building
    },
    {
        href: '/settings/forms/division',
        title: 'Division Form',
        description: 'Customize the fields for adding new divisions.',
        icon: GitFork
    }
]

function AppearanceTab() {
    const { toast } = useToast();

    const handleSave = () => {
        toast({
            title: 'Settings Saved',
            description: 'Appearance settings have been successfully saved.',
        });
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold">Appearance</h3>
                <p className="text-muted-foreground">
                    Customize the look and feel of the application.
                </p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue="system">
                        <SelectTrigger id="theme" className="max-w-xs">
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-2">
                        <Input type="color" defaultValue="#4A8FE7" className="h-10 w-14 p-1"/>
                        <Input value="#4A8FE7" readOnly className="max-w-xs" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex items-center gap-2">
                        <Input type="color" defaultValue="#2ECC71" className="h-10 w-14 p-1"/>
                        <Input value="#2ECC71" readOnly className="max-w-xs" />
                    </div>
                </div>
            </div>
             <div className="flex justify-end">
                <Button onClick={handleSave}>Save Appearance</Button>
            </div>
        </div>
    );
}

function FormsTab() {
    return (
        <div className="space-y-8">
           <div>
              <h3 className="text-xl font-bold">Form Customization</h3>
              <p className="text-muted-foreground">Select a form to add, remove, or reconfigure its fields.</p>
            </div>
            <div className="divide-y divide-border rounded-xl border">
                {formSettingsSections.map((section) => (
                <Link href={section.href} key={section.href} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                        <section.icon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="font-medium">{section.title}</span>
                            <span className="text-sm text-muted-foreground">{section.description}</span>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                ))}
            </div>
        </div>
    );
}

export default function CustomizationSettingsPage() {
    return (
        <div className="flex h-full flex-col">
            <Header title="Customization Settings" />
            <main className="flex-1 overflow-auto p-4 md:p-6">
                <div className="mx-auto max-w-4xl space-y-8">
                     <Tabs defaultValue="appearance">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="appearance">Appearance</TabsTrigger>
                            <TabsTrigger value="forms">Forms</TabsTrigger>
                        </TabsList>
                        <TabsContent value="appearance" className="mt-6">
                            <AppearanceTab />
                        </TabsContent>
                        <TabsContent value="forms" className="mt-6">
                            <FormsTab />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
