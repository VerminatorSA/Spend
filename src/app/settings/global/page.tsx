
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
                            <div className="mt-4 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="dateFormat">Date Format</Label>
                                    <Select value={localSettings.dateFormat} onValueChange={(value) => handleSelectChange('dateFormat', value)}>
                                        <SelectTrigger id="dateFormat" className="max-w-xs">
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
                        <Button onClick={handleSave}>Save Global Settings</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
