'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

// This is a mock. In a real app, you'd fetch this from your backend/settings.
const configuredFields = [
  { id: 'field-name', label: 'Supplier Name', required: true, checked: true },
  { id: 'field-contact-name', label: 'Contact Name', required: true, checked: true },
  { id: 'field-contact-email', label: 'Contact Email', required: true, checked: true },
  { id: 'field-contact-phone', label: 'Contact Phone', required: true, checked: true },
  { id: 'field-location', label: 'Location', required: false, checked: true },
  { id: 'field-tax-id', label: 'Tax ID / VAT Number', required: false, checked: true },
  { id: 'field-website', label: 'Website URL', required: false, checked: true },
  { id: 'custom-1699302633433', label: 'Minimum Order Quantity', required: false, checked: true },
];

export default function AddSupplierPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    for (const field of configuredFields) {
      if (field.required && !formData[field.id]) {
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
    setFormData({});
  };

  const contactFields = ['field-contact-name', 'field-contact-email', 'field-contact-phone'];
  const mainFields = configuredFields.filter(f => f.checked && !contactFields.includes(f.id));
  const customFields = configuredFields.filter(f => f.checked && !f.required && !contactFields.includes(f.id));


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
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="field-name">Supplier Name <span className="text-destructive">*</span></Label>
                      <Input id="field-name" placeholder="e.g., Global Components Inc." onChange={handleInputChange} value={formData['field-name'] || ''} />
                    </div>
                  </div>
                </div>

                <Separator />
                
                <div>
                  <h3 className="mb-4 text-lg font-medium">Contact Information</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <div className="space-y-2">
                        <Label htmlFor="field-contact-name">Contact Name <span className="text-destructive">*</span></Label>
                        <Input id="field-contact-name" placeholder="e.g., Sarah Chen" onChange={handleInputChange} value={formData['field-contact-name'] || ''} />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="field-contact-email">Contact Email <span className="text-destructive">*</span></Label>
                        <Input id="field-contact-email" type="email" placeholder="e.g., sarah.chen@globalcomp.com" onChange={handleInputChange} value={formData['field-contact-email'] || ''} />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="field-contact-phone">Contact Phone <span className="text-destructive">*</span></Label>
                        <Input id="field-contact-phone" type="tel" placeholder="e.g., 1-800-555-0101" onChange={handleInputChange} value={formData['field-contact-phone'] || ''} />
                      </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4 text-lg font-medium">Additional Details</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {customFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>{field.label}</Label>
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
