
'use client';

import { useState, useContext, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { SettingsContext, type CompanySettings } from '@/contexts/settings-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function CompanyProfileTab({ settings: initialSettings, onSave }: { settings: CompanySettings, onSave: (settings: CompanySettings) => void }) {
    const [localSettings, setLocalSettings] = useState<CompanySettings>(initialSettings);

    useEffect(() => {
        setLocalSettings(initialSettings);
    }, [initialSettings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setLocalSettings(prev => ({...prev, [id]: value}));
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold">Company Profile</h3>
                <p className="text-muted-foreground">
                    Manage your organization's details and branding.
                </p>
            </div>
           
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" value={localSettings.companyName} onChange={handleInputChange} className="max-w-lg" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input id="companyWebsite" value={localSettings.companyWebsite} onChange={handleInputChange} className="max-w-lg" />
                </div>
                <Separator />
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Company Address</h3>
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
                            <Label htmlFor="companyCountry" className="text-xs text-muted-foreground">Country</Label>
                            <Input id="companyCountry" value={localSettings.country} readOnly disabled />
                        </div>
                    </div>
                </div>
            </div>
             <div className="flex justify-end">
                <Button onClick={() => onSave(localSettings)}>Save Company Settings</Button>
            </div>
        </div>
    )
}

function GlobalSettingsTab({ settings: initialSettings, onSave }: { settings: CompanySettings, onSave: (settings: CompanySettings) => void }) {
    const [localSettings, setLocalSettings] = useState<CompanySettings>(initialSettings);

    useEffect(() => {
        setLocalSettings(initialSettings);
    }, [initialSettings]);

    const handleSelectChange = (id: keyof CompanySettings, value: string) => {
        setLocalSettings(prev => ({ ...prev, [id]: value as any }));
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold">Global Settings</h3>
                <p className="text-muted-foreground">
                    Manage application-wide settings.
                </p>
            </div>
           
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Localisation</h3>
                    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
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
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={() => onSave(localSettings)}>Save Global Settings</Button>
            </div>
        </div>
    )
}


export default function OrganizationSettingsPage() {
    const { settings, setSettings } = useContext(SettingsContext);
    const { toast } = useToast();

    const handleSave = (newSettings: CompanySettings) => {
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
                    <Tabs defaultValue="profile">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="profile">Company Profile</TabsTrigger>
                            <TabsTrigger value="global">Global</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile" className="mt-6">
                            <CompanyProfileTab settings={settings} onSave={handleSave} />
                        </TabsContent>
                        <TabsContent value="global" className="mt-6">
                            <GlobalSettingsTab settings={settings} onSave={handleSave} />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
