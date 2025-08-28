'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { suppliers } from '@/lib/data';

interface FormField {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  isCustom?: boolean;
  type?: 'text' | 'textarea' | 'select';
}

const FORM_FIELDS_STORAGE_KEY = 'contactFormFields';

export default function ContactPage() {
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
        setConfiguredFields([
          { id: 'field-your-name', label: 'Your Name', required: true, checked: true, type: 'text' },
          { id: 'field-your-email', label: 'Your Email', required: true, checked: true, type: 'text' },
          { id: 'field-subject', label: 'Subject', required: true, checked: true, type: 'text' },
          { id: 'field-message', label: 'Message', required: true, checked: true, type: 'textarea' },
        ]);
      }
    } catch (error) {
      console.error("Failed to parse fields from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData['field-supplier']) {
        toast({
          variant: 'destructive',
          title: 'Missing Required Field',
          description: `Please select a supplier.`,
        });
        return;
    }
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
    console.log('Contact Form Submitted:', formData);
    toast({
      title: 'Message Sent',
      description: 'Your message has been successfully sent to the supplier.',
    });
    
    const resetData: Record<string, string> = {};
    configuredFields.forEach(field => {
        if(field.checked) {
            resetData[field.id] = '';
        }
    });
    resetData['field-supplier'] = '';
    setFormData(resetData);
  };

  const visibleFields = configuredFields.filter(f => f.checked);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Contact Hub" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-4">
              <div>
                  <h2 className="text-2xl font-bold">Contact a Supplier</h2>
                  <p className="text-muted-foreground">
                      Select a supplier and fill out the form to send them a message. Required fields are marked with an asterisk (*).
                  </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="field-supplier">Supplier <span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData['field-supplier'] || ''}
                    onValueChange={(value) => handleSelectChange('field-supplier', value)}
                   >
                    <SelectTrigger id="field-supplier">
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.name}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {visibleFields.map((field) => (
                        <div key={field.id} className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                            <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
                            {field.type === 'textarea' ? (
                                <Textarea 
                                    id={field.id} 
                                    placeholder={`Enter ${field.label}`} 
                                    onChange={handleInputChange} 
                                    value={formData[field.id] || ''}
                                    rows={5}
                                />
                            ) : (
                                <Input 
                                    id={field.id} 
                                    placeholder={`Enter ${field.label}`} 
                                    onChange={handleInputChange} 
                                    value={formData[field.id] || ''} 
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit">Send Message</Button>
                </div>
              </form>
          </div>
        </div>
      </main>
    </div>
  );
}
