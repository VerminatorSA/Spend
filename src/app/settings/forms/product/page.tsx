
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FormSettingsSection, type FormField } from '@/components/form-settings-section';

const initialProductFields: FormField[] = [
    { id: 'field-product-name', label: 'Product Name', required: true, checked: true, type: 'text' },
    { id: 'field-product-description', label: 'Description', required: false, checked: true, type: 'textarea' },
];

const PRODUCT_FIELDS_STORAGE_KEY = 'productFormFields';


export default function ProductFormsSettingsPage() {
  const [productFields, setProductFields] = useState<FormField[]>([]);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedProductFields = localStorage.getItem(PRODUCT_FIELDS_STORAGE_KEY);
      setProductFields(storedProductFields ? JSON.parse(storedProductFields) : initialProductFields);
    } catch (error) {
      console.error("Failed to parse fields from localStorage", error);
      setProductFields(initialProductFields);
    }
    setIsLoaded(true);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(PRODUCT_FIELDS_STORAGE_KEY, JSON.stringify(productFields));
    toast({
        title: 'Settings Saved',
        description: 'Your settings have been successfully saved.',
    });
  }

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PRODUCT_FIELDS_STORAGE_KEY, JSON.stringify(productFields));
    }
  }, [productFields, isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Product Form Settings" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
           <div>
              <h2 className="text-2xl font-bold">Product Form</h2>
              <p className="text-muted-foreground">Add, remove, or toggle fields for the product creation form.</p>
            </div>
            
            <FormSettingsSection 
                fields={productFields}
                setFields={setProductFields}
            />

           <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
        </div>
      </main>
    </div>
  );
}
