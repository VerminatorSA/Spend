'use client';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AppearanceSettingsPage() {
    const { toast } = useToast();

    const handleSave = () => {
        toast({
            title: 'Settings Saved',
            description: 'Appearance settings have been successfully saved.',
        });
    }

    return (
        <div className="flex h-full flex-col">
            <Header title="Appearance" />
            <main className="flex-1 overflow-auto p-4 md:p-6">
                <div className="mx-auto max-w-4xl space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold">Appearance</h2>
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
            </main>
        </div>
    );
}
