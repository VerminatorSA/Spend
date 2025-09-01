
'use client';

import { useState, useContext, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SettingsContext, type AppSettings } from '@/contexts/settings-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function EmailSettingsPage() {
    const { settings, setSettings } = useContext(SettingsContext);
    const { toast } = useToast();
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            emailSettings: {
                ...prev.emailSettings,
                [id]: value,
            }
        }));
    }

    const handleSave = () => {
        setSettings(localSettings);
        toast({
            title: 'Settings Saved',
            description: 'Email configuration settings have been successfully saved.',
        });
    }

    return (
        <div className="flex h-full flex-col">
            <Header title="Email Configuration" />
            <main className="flex-1 overflow-auto p-4 md:p-6">
                <div className="mx-auto max-w-4xl space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Email Settings</CardTitle>
                            <CardDescription>
                                Configure your SMTP server to send emails from your own domain.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <Alert variant="default" className="border-yellow-500/50 text-yellow-500 [&>svg]:text-yellow-500">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Backend Required</AlertTitle>
                                <AlertDescription>
                                    Saving these settings will not automatically enable email sending. A developer must connect this to a backend cloud function to dispatch emails.
                                </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="smtpServer">SMTP Server</Label>
                                    <Input id="smtpServer" placeholder="e.g., smtp.example.com" value={localSettings.emailSettings?.smtpServer || ''} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPort">SMTP Port</Label>
                                    <Input id="smtpPort" type="number" placeholder="e.g., 587" value={localSettings.emailSettings?.smtpPort || ''} onChange={handleInputChange} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="smtpUser">SMTP Username</Label>
                                    <Input id="smtpUser" placeholder="Your username" value={localSettings.emailSettings?.smtpUser || ''} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="smtpPass">SMTP Password</Label>
                                    <Input id="smtpPass" type="password" placeholder="••••••••••••" value={localSettings.emailSettings?.smtpPass || ''} onChange={handleInputChange} />
                                </div>
                            </div>
                            <Separator />
                             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                 <div className="space-y-2">
                                    <Label htmlFor="fromName">"From" Name</Label>
                                    <Input id="fromName" placeholder="e.g., Your Company Name" value={localSettings.emailSettings?.fromName || ''} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fromEmail">"From" Email Address</Label>
                                    <Input id="fromEmail" type="email" placeholder="e.g., noreply@yourdomain.com" value={localSettings.emailSettings?.fromEmail || ''} onChange={handleInputChange} />
                                </div>
                            </div>
                             <div className="flex justify-end">
                                <Button onClick={handleSave}>Save Email Settings</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
