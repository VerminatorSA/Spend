
'use client';

import { useState, useEffect } from 'react';
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
import { Separator } from '@/components/ui/separator';

type FieldType = 'text' | 'textarea' | 'select' | 'email' | 'number' | 'date';

interface FormField {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  isCustom?: boolean;
  type?: FieldType;
}

const initialSupplierFields: FormField[] = [
    { id: 'field-name', label: 'Supplier Name', required: true, checked: true, type: 'text' },
    { id: 'field-contact-name', label: 'Contact Name', required: true, checked: true, type: 'text' },
    { id: 'field-contact-email', label: 'Contact Email', required: true, checked: true, type: 'email' },
    { id: 'field-contact-phone', label: 'Contact Phone', required: false, checked: true, type: 'text' },
    { id: 'field-location', label: 'Location', required: false, checked: true, type: 'text' },
    { id: 'field-tax-id', label: 'Tax ID / VAT Number', required: false, checked: false, type: 'text' },
    { id: 'field-website', label: 'Website URL', required: false, checked: false, type: 'text' },
];

const initialItemFields: FormField[] = [
    { id: 'field-item-name', label: 'Item Name', required: true, checked: true, type: 'text' },
    { id: 'field-price', label: 'Price', required: true, checked: true, type: 'number' },
    { id: 'field-unit', label: 'Unit', required: true, checked: true, type: 'text' },
    { id: 'field-category', label: 'Category', required: true, checked: true, type: 'text' },
    { id: 'field-supplier', label: 'Supplier', required: true, checked: true, type: 'text' },
    { id: 'field-description', label: 'Description', required: false, checked: true, type: 'textarea' },
    { id: 'field-sku', label: 'SKU', required: false, checked: false, type: 'text' },
    { id: 'field-stock', label: 'Stock Quantity', required: false, checked: false, type: 'number' },
];

const initialProductFields: FormField[] = [
    { id: 'field-product-name', label: 'Product Name', required: true, checked: true, type: 'text' },
    { id: 'field-product-description', label: 'Description', required: false, checked: true, type: 'textarea' },
];

const initialContactFields: FormField[] = [
    { id: 'field-your-name', label: 'Your Name', required: true, checked: true, type: 'text' },
    { id: 'field-your-email', label: 'Your Email', required: true, checked: true, type: 'email' },
    { id: 'field-subject', label: 'Subject', required: true, checked: true, type: 'text' },
    { id: 'field-message', label: 'Message', required: true, checked: true, type: 'textarea' },
];

const SUPPLIER_FIELDS_STORAGE_KEY = 'supplierFormFields';
const ITEM_FIELDS_STORAGE_KEY = 'itemFormFields';
const PRODUCT_FIELDS_STORAGE_KEY = 'productFormFields';
const CONTACT_FIELDS_STORAGE_KEY = 'contactFormFields';

function FormSettingsSection({
  fields,
  setFields,
}: {
  fields: FormField[];
  setFields: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('text');
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
      required: true,
      checked: true,
      isCustom: true,
      type: newFieldType,
    };
    setFields([...fields, newField]);
    setNewFieldName('');
    setNewFieldType('text');
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };
  
  const handleToggleField = (id: string) => {
    setFields(fields.map(field => field.id === id ? {...field, checked: !field.checked} : field));
  };
  
  const handleToggleRequired = (id: string) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, required: !field.required } : field
      )
    );
  };

  return (
      <div className="space-y-6">
          <div>
              <div className="space-y-3">
              {fields.map((field) => (
                  <div key={field.id} className="flex flex-col items-start gap-4 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id={`checked-${field.id}`}
                        checked={field.checked} 
                        disabled={field.required && !field.isCustom}
                        onCheckedChange={() => handleToggleField(field.id)}
                      />
                      <Label htmlFor={`checked-${field.id}`} className={field.required && !field.isCustom ? 'font-semibold' : ''}>
                        {field.label}
                      </Label>
                    </div>
                    <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
                       <div className="flex items-center space-x-2">
                        <Switch 
                          id={`required-${field.id}`}
                          checked={field.required}
                          onCheckedChange={() => handleToggleRequired(field.id)}
                          disabled={!field.isCustom && field.required}
                        />
                        <Label htmlFor={`required-${field.id}`} className="text-sm text-muted-foreground">
                          Required
                        </Label>
                      </div>
                      {field.isCustom && (
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveField(field.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                      )}
                    </div>
                  </div>
              ))}
              </div>
          </div>
          <Separator />
          <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="mb-2 font-medium">Add New Field</h4>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input 
                    placeholder="e.g., 'Minimum Order Quantity'" 
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    className="flex-grow"
                />
                 <Select value={newFieldType} onValueChange={(value) => setNewFieldType(value as FieldType)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select field type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Text Area</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                <Button onClick={handleAddField} className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Field
                </Button>
              </div>
          </div>
      </div>
  );
}


export default function SettingsPage() {
  const [supplierFields, setSupplierFields] = useState<FormField[]>([]);
  const [itemFields, setItemFields] = useState<FormField[]>([]);
  const [productFields, setProductFields] = useState<FormField[]>([]);
  const [contactFields, setContactFields] = useState<FormField[]>([]);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSupplierFields = localStorage.getItem(SUPPLIER_FIELDS_STORAGE_KEY);
      setSupplierFields(storedSupplierFields ? JSON.parse(storedSupplierFields) : initialSupplierFields);

      const storedItemFields = localStorage.getItem(ITEM_FIELDS_STORAGE_KEY);
      setItemFields(storedItemFields ? JSON.parse(storedItemFields) : initialItemFields);
      
      const storedProductFields = localStorage.getItem(PRODUCT_FIELDS_STORAGE_KEY);
      setProductFields(storedProductFields ? JSON.parse(storedProductFields) : initialProductFields);

      const storedContactFields = localStorage.getItem(CONTACT_FIELDS_STORAGE_KEY);
      setContactFields(storedContactFields ? JSON.parse(storedContactFields) : initialContactFields);

    } catch (error) {
      console.error("Failed to parse fields from localStorage", error);
      setSupplierFields(initialSupplierFields);
      setItemFields(initialItemFields);
      setProductFields(initialProductFields);
      setContactFields(initialContactFields);
    }
    setIsLoaded(true);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(SUPPLIER_FIELDS_STORAGE_KEY, JSON.stringify(supplierFields));
    localStorage.setItem(ITEM_FIELDS_STORAGE_KEY, JSON.stringify(itemFields));
    localStorage.setItem(PRODUCT_FIELDS_STORAGE_KEY, JSON.stringify(productFields));
    localStorage.setItem(CONTACT_FIELDS_STORAGE_KEY, JSON.stringify(contactFields));
    toast({
        title: 'Settings Saved',
        description: 'Your form settings have been successfully saved.',
    });
  }

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SUPPLIER_FIELDS_STORAGE_KEY, JSON.stringify(supplierFields));
      localStorage.setItem(ITEM_FIELDS_STORAGE_KEY, JSON.stringify(itemFields));
      localStorage.setItem(PRODUCT_FIELDS_STORAGE_KEY, JSON.stringify(productFields));
      localStorage.setItem(CONTACT_FIELDS_STORAGE_KEY, JSON.stringify(contactFields));
    }
  }, [supplierFields, itemFields, productFields, contactFields, isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Settings" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="forms" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your personal and contact information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                  <Separator />
                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                     <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select defaultValue="US">
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="JP">Japan</SelectItem>
                          <SelectItem value="CN">China</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="USD">
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select defaultValue="mm-dd-yyyy">
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
                </CardContent>
                <CardHeader className="border-t pt-6">
                   <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="pt-6">
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
                </CardContent>
                 <CardHeader className="border-t pt-6">
                   <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                  </div>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="pt-6">
               <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of the application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                   <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-2">
                        <Input type="color" defaultValue="#4A8FE7" className="h-10 w-14 p-1"/>
                        <Input value="#4A8FE7" readOnly/>
                    </div>
                   </div>
                   <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex items-center gap-2">
                        <Input type="color" defaultValue="#2ECC71" className="h-10 w-14 p-1"/>
                        <Input value="#2ECC71" readOnly/>
                    </div>
                   </div>
                </CardContent>
                 <CardHeader className="border-t pt-6">
                   <div className="flex justify-end">
                    <Button>Apply Theme</Button>
                  </div>
                </CardHeader>
              </Card>
            </TabsContent>
            
            <TabsContent value="forms" className="pt-6">
               <Card>
                <CardHeader>
                  <CardTitle>Form Settings</CardTitle>
                  <CardDescription>Add, remove, or toggle fields for the app's forms.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="supplier-form" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                            <TabsTrigger value="supplier-form">Supplier</TabsTrigger>
                            <TabsTrigger value="item-form">Item</TabsTrigger>
                            <TabsTrigger value="product-form">Product</TabsTrigger>
                            <TabsTrigger value="contact-form">Contact</TabsTrigger>
                        </TabsList>
                        <TabsContent value="supplier-form" className="py-6">
                             <FormSettingsSection 
                                fields={supplierFields}
                                setFields={setSupplierFields}
                            />
                        </TabsContent>
                         <TabsContent value="item-form" className="py-6">
                            <FormSettingsSection 
                                fields={itemFields}
                                setFields={setItemFields}
                            />
                        </TabsContent>
                         <TabsContent value="product-form" className="py-6">
                            <FormSettingsSection 
                                fields={productFields}
                                setFields={setProductFields}
                            />
                        </TabsContent>
                         <TabsContent value="contact-form" className="py-6">
                            <FormSettingsSection 
                                fields={contactFields}
                                setFields={setContactFields}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardHeader className="border-t pt-6">
                    <div className="flex justify-end">
                        <Button onClick={handleSaveSettings}>Save All Form Settings</Button>
                    </div>
                </CardHeader>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </main>
    </div>
  );
}
