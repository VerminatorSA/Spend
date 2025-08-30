
'use client';

import { useState, useContext, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { SettingsContext, type CompanySettings } from '@/contexts/settings-context';

export default function GlobalSettingsPage() {
    const { settings, setSettings } = useContext(SettingsContext);
    const { toast } = useToast();
    const [localSettings, setLocalSettings] = useState<CompanySettings>(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSelectChange = (id: keyof CompanySettings, value: string) => {
        setLocalSettings(prev => ({ ...prev, [id]: value as any }));
    };

    const handleSave = () => {
        setSettings(localSettings);
        toast({
            title: 'Settings Saved',
            description: 'Global settings have been successfully saved.',
        });
    }

    return (
        <div className="flex h-full flex-col">
            <Header title="Global Settings" />
            <main className="flex-1 overflow-auto p-4 md:p-6">
                <div className="mx-auto max-w-4xl space-y-8">
                     <div>
                        <h2 className="text-2xl font-bold">Global Settings</h2>
                        <p className="text-muted-foreground">
                           Manage application-wide settings.
                        </p>
                    </div>
                   
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Localization</h3>
                            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select value={localSettings.language} onValueChange={(value) => handleSelectChange('language', value)}>
                                        <SelectTrigger id="language">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en-US">English (US)</SelectItem>
                                            <SelectItem value="en-GB">English (UK)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
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
                                 <div className="space-y-2">
                                    <Label htmlFor="currency">Default Currency</Label>
                                    <Select value={localSettings.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
                                        <SelectTrigger id="currency">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="CAD">CAD (C$)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                            <SelectItem value="AUD">AUD (A$)</SelectItem>
                                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                                            <SelectItem value="ZAR">ZAR (R)</SelectItem>
                                            <SelectItem value="BRL">BRL (R$)</SelectItem>
                                            <SelectItem value="INR">INR (₹)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Default Country</Label>
                                    <Select value={localSettings.country} onValueChange={(value) => handleSelectChange('country', value)}>
                                        <SelectTrigger id="country">
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="US">United States</SelectItem>
                                            <SelectItem value="CA">Canada</SelectItem>
                                            <SelectItem value="GB">United Kingdom</SelectItem>
                                            <SelectItem value="AU">Australia</SelectItem>
                                            <SelectItem value="ZA">South Africa</SelectItem>
                                            <SelectItem value="DE">Germany</SelectItem>
                                            <SelectItem value="JP">Japan</SelectItem>
                                            <SelectItem value="CN">China</SelectItem>
                                            <SelectItem value="BR">Brazil</SelectItem>
                                            <SelectItem value="IN">India</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                     <div className="flex justify-end">
                        <Button onClick={handleSave}>Save Global Settings</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
