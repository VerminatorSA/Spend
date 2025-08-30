
'use client';

import { useState, useContext, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { SettingsContext, type AppSettings } from '@/contexts/settings-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { companies as initialCompanies, divisions as initialDivisions, type Company, type Division } from '@/lib/organization';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FormField {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  isCustom?: boolean;
  type?: 'text' | 'textarea' | 'select' | 'email' | 'number' | 'date';
}

const COMPANY_FIELDS_STORAGE_KEY = 'companyFormFields';
const DIVISION_FIELDS_STORAGE_KEY = 'divisionFormFields';

function GroupProfileTab({ settings: initialSettings, onSave }: { settings: AppSettings, onSave: (settings: AppSettings) => void }) {
    const [localSettings, setLocalSettings] = useState<AppSettings>(initialSettings);

    useEffect(() => {
        setLocalSettings(initialSettings);
    }, [initialSettings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setLocalSettings(prev => ({...prev, [id]: value}));
    }

    const handleSelectChange = (id: keyof AppSettings, value: string) => {
        setLocalSettings(prev => ({ ...prev, [id]: value as any }));
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Group Profile</CardTitle>
                    <CardDescription>
                        Manage the details for the top-level parent company/group.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Group Name</Label>
                            <Input id="name" value={localSettings.name} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" value={localSettings.website} onChange={handleInputChange} />
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Group Address</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="address1" className="text-xs text-muted-foreground">Address Line 1</Label>
                                <Input id="address1" placeholder="e.g., 123 Main St" value={localSettings.address1} onChange={handleInputChange} />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="address2" className="text-xs text-muted-foreground">Address Line 2 (Optional)</Label>
                                <Input id="address2" placeholder="e.g., Suite 400" value={localSettings.address2} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-xs text-muted-foreground">City</Label>
                                <Input id="city" placeholder="e.g., San Francisco" value={localSettings.city} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state" className="text-xs text-muted-foreground">State / Province</Label>
                                <Input id="state" placeholder="e.g., CA" value={localSettings.state} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postalCode" className="text-xs text-muted-foreground">Postal Code</Label>
                                <Input id="postalCode" placeholder="e.g., 94103" value={localSettings.postalCode} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country" className="text-xs text-muted-foreground">Country</Label>
                                <Input id="country" value={localSettings.country} readOnly disabled />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => onSave(localSettings)}>Save Group Settings</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function CompaniesTab() {
    const [companies, setCompanies] = useState<Company[]>(initialCompanies);
    const [newCompanyData, setNewCompanyData] = useState<Record<string, string>>({});
    const [configuredFields, setConfiguredFields] = useState<FormField[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const storedFields = localStorage.getItem(COMPANY_FIELDS_STORAGE_KEY);
        setConfiguredFields(storedFields ? JSON.parse(storedFields) : [
            { id: 'field-company-name', label: 'Company Name', required: true, checked: true },
            { id: 'field-industry', label: 'Industry', required: true, checked: true },
        ]);
    }, []);

    const handleInputChange = (id: string, value: string) => {
        setNewCompanyData(prev => ({...prev, [id]: value}));
    };

    const handleAddCompany = () => {
        for (const field of configuredFields) {
            if (field.checked && field.required && !newCompanyData[field.id]) {
                toast({ variant: 'destructive', title: 'Error', description: `Please fill out the "${field.label}" field.` });
                return;
            }
        }
        
        const newCompany: Company = {
            id: `comp-${Date.now()}`,
            name: newCompanyData['field-company-name'],
            industry: newCompanyData['field-industry'],
        };
        setCompanies([...companies, newCompany]);
        setNewCompanyData({});
        toast({ title: 'Company Added', description: `${newCompany.name} has been added.` });
    };

    const handleRemoveCompany = (id: string) => {
        setCompanies(companies.filter(c => c.id !== id));
        toast({ title: 'Company Removed' });
    };
    
    const visibleFields = configuredFields.filter(f => f.checked);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Companies</CardTitle>
                <CardDescription>Manage the child companies within the group. These are the main subdivisions for filtering.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Industry</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {companies.map(company => (
                                <TableRow key={company.id}>
                                    <TableCell className="font-medium">{company.name}</TableCell>
                                    <TableCell>{company.industry}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveCompany(company.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 <div className="rounded-lg border bg-muted/50 p-4">
                    <h4 className="mb-4 font-medium">Add New Company</h4>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {visibleFields.map(field => (
                                <div key={field.id} className="space-y-2">
                                    <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
                                    <Input
                                        id={field.id}
                                        placeholder={`Enter ${field.label}`}
                                        value={newCompanyData[field.id] || ''}
                                        onChange={e => handleInputChange(field.id, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button onClick={handleAddCompany} className="w-full sm:w-auto self-end">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Company
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function DivisionsTab() {
    const [divisions, setDivisions] = useState<Division[]>(initialDivisions);
    const [companies] = useState<Company[]>(initialCompanies);
    const [newDivisionData, setNewDivisionData] = useState<Record<string, string>>({});
    const [configuredFields, setConfiguredFields] = useState<FormField[]>([]);
    const { toast } = useToast();

     useEffect(() => {
        const storedFields = localStorage.getItem(DIVISION_FIELDS_STORAGE_KEY);
        setConfiguredFields(storedFields ? JSON.parse(storedFields) : [
            { id: 'field-division-name', label: 'Division Name', required: true, checked: true },
            { id: 'field-parent-company', label: 'Parent Company', required: true, checked: true, type: 'select' },
        ]);
    }, []);

    const handleInputChange = (id: string, value: string) => {
        setNewDivisionData(prev => ({...prev, [id]: value}));
    };

    const handleSelectChange = (id: string, value: string) => {
        setNewDivisionData(prev => ({ ...prev, [id]: value }));
    };

    const handleAddDivision = () => {
        for (const field of configuredFields) {
            if (field.checked && field.required && !newDivisionData[field.id]) {
                toast({ variant: 'destructive', title: 'Error', description: `Please fill out the "${field.label}" field.` });
                return;
            }
        }

        const newDivision: Division = {
            id: `div-${Date.now()}`,
            name: newDivisionData['field-division-name'],
            companyId: newDivisionData['field-parent-company'],
        };
        setDivisions([...divisions, newDivision]);
        setNewDivisionData({});
        toast({ title: 'Division Added', description: `${newDivision.name} has been added.` });
    };

    const handleRemoveDivision = (id: string) => {
        setDivisions(divisions.filter(d => d.id !== id));
        toast({ title: 'Division Removed' });
    };
    
    const visibleFields = configuredFields.filter(f => f.checked);

    return (
         <Card>
            <CardHeader>
                <CardTitle>Divisions</CardTitle>
                <CardDescription>Manage the grandchildren divisions within each company.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Division Name</TableHead>
                                <TableHead>Parent Company</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {divisions.map(division => {
                                const company = companies.find(c => c.id === division.companyId);
                                return (
                                    <TableRow key={division.id}>
                                        <TableCell className="font-medium">{division.name}</TableCell>
                                        <TableCell>{company?.name || 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveDivision(division.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
                 <div className="rounded-lg border bg-muted/50 p-4">
                    <h4 className="mb-4 font-medium">Add New Division</h4>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                             {visibleFields.map(field => (
                                <div key={field.id} className="space-y-2">
                                    <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
                                    {field.type === 'select' ? (
                                        <Select value={newDivisionData[field.id] || ''} onValueChange={(value) => handleSelectChange(field.id, value)}>
                                            <SelectTrigger id={field.id}>
                                                <SelectValue placeholder="Select Parent Company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            id={field.id}
                                            placeholder={`Enter ${field.label}`}
                                            value={newDivisionData[field.id] || ''}
                                            onChange={e => handleInputChange(field.id, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button onClick={handleAddDivision} className="w-full sm:w-auto self-end">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Division
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function GlobalTab({ settings: initialSettings, onSave }: { settings: AppSettings, onSave: (settings: AppSettings) => void }) {
    const [localSettings, setLocalSettings] = useState<AppSettings>(initialSettings);

    useEffect(() => {
        setLocalSettings(initialSettings);
    }, [initialSettings]);

    const handleSelectChange = (id: keyof AppSettings, value: string) => {
        setLocalSettings(prev => ({ ...prev, [id]: value as any }));
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Global Settings</CardTitle>
                    <CardDescription>
                        Manage application-wide settings like date formats and default currency.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2 max-w-xs">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select value={localSettings.dateFormat} onValueChange={(value) => handleSelectChange('dateFormat', value)}>
                            <SelectTrigger id="dateFormat">
                                <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                                <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                                <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2 max-w-xs">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={localSettings.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
                            <SelectTrigger id="currency">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="JPY">JPY (¥)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => onSave(localSettings)}>Save Global Settings</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default function OrganizationSettingsPage() {
    const { settings, setSettings } = useContext(SettingsContext);
    const { toast } = useToast();

    const handleSave = (newSettings: AppSettings) => {
        setSettings(newSettings);
        toast({
            title: 'Settings Saved',
            description: 'Organization settings have been successfully saved.',
        });
    }

    return (
        <div className="flex h-full flex-col">
            <Header title="Organization Settings" />
            <main className="flex-1 overflow-auto p-4 md:p-6">
                <div className="mx-auto max-w-4xl space-y-8">
                    <Tabs defaultValue="group">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="group">Group Profile</TabsTrigger>
                            <TabsTrigger value="companies">Companies</TabsTrigger>
                            <TabsTrigger value="divisions">Divisions</TabsTrigger>
                            <TabsTrigger value="global">Global</TabsTrigger>
                        </TabsList>
                        <TabsContent value="group" className="mt-6">
                            <GroupProfileTab settings={settings} onSave={handleSave} />
                        </TabsContent>
                        <TabsContent value="companies" className="mt-6">
                            <CompaniesTab />
                        </TabsContent>
                        <TabsContent value="divisions" className="mt-6">
                            <DivisionsTab />
                        </TabsContent>
                        <TabsContent value="global" className="mt-6">
                            <GlobalTab settings={settings} onSave={handleSave} />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
