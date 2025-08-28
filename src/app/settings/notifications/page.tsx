'use client';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function NotificationSettingsPage() {
    const { toast } = useToast();

    const handleSave = () => {
        toast({
            title: 'Settings Saved',
            description: 'Notification settings have been successfully saved.',
        });
    }

    return (
        <div className="flex h-full flex-col">
            <Header title="Notifications" />
            <main className="flex-1 overflow-auto p-4 md:p-6">
                <div className="mx-auto max-w-4xl space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold">Notifications</h2>
                        <p className="text-muted-foreground">Choose how you want to be notified.</p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                                <span>Email Notifications</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Receive updates about new items and supplier messages.
                                </span>
                            </Label>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                            <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                                <span>Push Notifications</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Get real-time alerts on your devices.
                                </span>
                            </Label>
                            <Switch id="push-notifications" />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSave}>Save Notifications</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
