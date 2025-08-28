'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface FormField {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  isCustom?: boolean;
}

const FORM_FIELDS_STORAGE_KEY = 'supplierFormFields';

export default function AddSupplierPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [configuredFields, setConfiguredFields] = useState<FormField[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
        const storedFields = localStorage.getItem(FORM_FIELDS_STORAGE_KEY);
        if (storedFields) {
            setConfiguredFields(JSON.parse(storedFields));
        } else {
            // Fallback to some default fields if nothing is in storage
            setConfiguredFields([
                { id: 'field-name', label: 'Supplier Name', required: true, checked: true },
                { id: 'field-contact-name', label: 'Contact Name', required: true, checked: true },
                { id: 'field-contact-email', label: 'Contact Email', required: true, checked: true },
                { id: 'field-contact-phone', label: 'Contact Phone', required: true, checked: true },
            ]);
        }
    } catch (error) {
        console.error("Failed to parse fields from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    for (const field of configuredFields) {
      if (field.checked && field.required && !formData[field.id]) {
         toast({
          variant: 'destructive',
          title: 'Missing Required Field',
          description: `Please fill out the "${field.label}" field.`,
        });
        return;
      }
    }
    console.log('Form Submitted:', formData);
    toast({
      title: 'Supplier Submitted',
      description: 'The new supplier has been successfully submitted for review.',
    });
    // Reset only the values for the fields that are currently configured
    const resetData: Record<string, string> = {};
    configuredFields.forEach(field => {
        if(field.checked) {
            resetData[field.id] = '';
        }
    });
    setFormData(resetData);
  };

  const contactFieldIds = ['field-contact-name', 'field-contact-email', 'field-contact-phone'];
  
  const mainFields = configuredFields.filter(f => f.checked && !contactFieldIds.includes(f.id) && f.id === 'field-name');
  const contactFields = configuredFields.filter(f => f.checked && contactFieldIds.includes(f.id));
  const additionalFields = configuredFields.filter(f => f.checked && !contactFieldIds.includes(f.id) && f.id !== 'field-name');

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Add New Supplier" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>New Supplier Details</CardTitle>
              <CardDescription>
                Fill out the form below to add a new supplier to the directory. Required fields are marked with an asterisk (*).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {mainFields.length > 0 && (
                    <div className="space-y-4">
                        {mainFields.map((field) => (
                             <div key={field.id} className="space-y-2">
                                <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
                                <Input id={field.id} placeholder={`e.g., ${field.label}`} onChange={handleInputChange} value={formData[field.id] || ''} />
                            </div>
                        ))}
                    </div>
                )}

                {contactFields.length > 0 && <Separator />}
                
                {contactFields.length > 0 && (
                    <div>
                    <h3 className="mb-4 text-lg font-medium">Contact Information</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {contactFields.map(field => (
                            <div key={field.id} className="space-y-2">
                                <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
                                <Input id={field.id} placeholder={`e.g., Jane Doe`} onChange={handleInputChange} value={formData[field.id] || ''} />
                            </div>
                        ))}
                    </div>
                    </div>
                )}

                {additionalFields.length > 0 && <Separator />}

                {additionalFields.length > 0 && (
                    <div>
                    <h3 className="mb-4 text-lg font-medium">Additional Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {additionalFields.map((field) => (
                        <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
                        <Input
                            id={field.id}
                            placeholder={`Enter ${field.label}`}
                            onChange={handleInputChange}
                            value={formData[field.id] || ''}
                        />
                        </div>
                    ))}
                    </div>
                    </div>
                )}


                <div className="flex justify-end pt-4">
                  <Button type="submit">Add Supplier</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
