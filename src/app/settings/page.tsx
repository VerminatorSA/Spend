'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormField {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  isCustom?: boolean;
}

const initialFields: FormField[] = [
  { id: 'field-name', label: 'Supplier Name', required: true, checked: true },
  { id: 'field-contact', label: 'Contact Info', required: true, checked: true },
  { id: 'field-location', label: 'Location', required: false, checked: true },
  { id: 'field-tax-id', label: 'Tax ID / VAT Number', required: false, checked: false },
  { id: 'field-website', label: 'Website URL', required: false, checked: false },
];

export default function SettingsPage() {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [newFieldName, setNewFieldName] = useState('');
  const { toast } = useToast();

  const handleAddField = () => {
    if (newFieldName.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Field name cannot be empty.',
      });
      return;
    }
    const newField: FormField = {
      id: `custom-${Date.now()}`,
      label: newFieldName.trim(),
      required: false,
      checked: true,
      isCustom: true,
    };
    setFields([...fields, newField]);
    setNewFieldName('');
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };
  
  const handleToggleField = (id: string) => {
    setFields(fields.map(field => field.id === id ? {...field, checked: !field.checked} : field));
  };

  return (
    <div className="flex h-full flex-col">
      <Header title="Settings" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your personal and contact information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="manager@spend.com" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" defaultValue="Purchasing Manager" />
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Choose how you want to be notified.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                    <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                      <span>Email Notifications</span>
                      <span className="font-normal leading-snug text-muted-foreground">
                        Receive updates about new products and supplier messages.
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
                  <div className="flex justify-end pt-4">
                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
               <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of the application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                     <Select defaultValue="system">
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="flex justify-end pt-4">
                    <Button>Apply Theme</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="forms">
               <Card>
                <CardHeader>
                  <CardTitle>Form Settings</CardTitle>
                  <CardDescription>Add or remove fields from various forms in the app.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-4 font-medium">"Add Supplier" Form Fields</h3>
                    <div className="space-y-3">
                      {fields.map((field) => (
                        <div key={field.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={field.id} 
                              checked={field.checked} 
                              disabled={field.required}
                              onCheckedChange={() => handleToggleField(field.id)}
                            />
                            <Label htmlFor={field.id} className={field.required ? 'text-muted-foreground' : ''}>
                              {field.label} {field.required && '(Required)'}
                            </Label>
                          </div>
                          {field.isCustom && (
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveField(field.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border bg-muted/50 p-4">
                    <h4 className="mb-2 font-medium">Add New Field</h4>
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="e.g., 'Minimum Order Quantity'" 
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddField()}
                      />
                      <Button onClick={handleAddField}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Field
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button>Save Form Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </main>
    </div>
  );
}
