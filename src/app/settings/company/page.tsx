
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

export default function CompanySettingsPage() {
    const { settings, setSettings } = useContext(SettingsContext);
    const { toast } = useToast();
    const [localSettings, setLocalSettings] = useState<CompanySettings>(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setLocalSettings(prev => ({...prev, [id]: value}));
    }

    const handleSelectChange = (id: keyof CompanySettings, value: string) => {
        setLocalSettings(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = () => {
        setSettings(localSettings);
        toast({
            title: 'Settings Saved',
            description: 'Company settings have been successfully saved.',
        });
    }

    return (
        <div className="flex h-full flex-col">
            <Header title="Company Settings" />
            <main className="flex-1 overflow-auto p-4 md:p-6">
                <div className="mx-auto max-w-4xl space-y-8">
                     <div>
                        <h2 className="text-2xl font-bold">Company Profile</h2>
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
                        <Button onClick={handleSave}>Save Company Settings</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
