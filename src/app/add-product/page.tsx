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

const FORM_FIELDS_STORAGE_KEY = 'productFormFields';

export default function AddProductPage() {
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
                { id: 'field-product-name', label: 'Product Name', required: true, checked: true },
                { id: 'field-price', label: 'Price', required: true, checked: true },
                { id: 'field-category', label: 'Category', required: true, checked: true },
                { id: 'field-supplier', label: 'Supplier', required: true, checked: true },
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
    console.log('Product Form Submitted:', formData);
    toast({
      title: 'Product Submitted',
      description: 'The new product has been successfully submitted.',
    });
    
    const resetData: Record<string, string> = {};
    configuredFields.forEach(field => {
        if(field.checked) {
            resetData[field.id] = '';
        }
    });
    setFormData(resetData);
  };

  const visibleFields = configuredFields.filter(f => f.checked);

  if (!isLoaded) {
    return null; 
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Add New Product" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>New Product Details</CardTitle>
              <CardDescription>
                Fill out the form below to add a new product to the catalog. Required fields are marked with an asterisk (*).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {visibleFields.length > 0 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {visibleFields.map((field) => (
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
                  <Button type="submit">Add Product</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
