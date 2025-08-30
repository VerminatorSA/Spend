
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FormSettingsSection, type FormField } from '@/components/form-settings-section';

const initialSupplierFields: FormField[] = [
    { id: 'field-name', label: 'Supplier Name', required: true, checked: true, type: 'text' },
    { id: 'field-contact-name', label: 'Contact Name', required: true, checked: true, type: 'text' },
    { id: 'field-contact-email', label: 'Contact Email', required: true, checked: true, type: 'email' },
    { id: 'field-contact-phone', label: 'Contact Phone', required: false, checked: true, type: 'text' },
    { id: 'field-location', label: 'Location', required: false, checked: true, type: 'text' },
    { id: 'field-tax-id', label: 'Tax ID / VAT Number', required: false, checked: false, type: 'text' },
    { id: 'field-website', label: 'Website URL', required: false, checked: false, type: 'text' },
];

const SUPPLIER_FIELDS_STORAGE_KEY = 'supplierFormFields';

export default function SupplierFormsSettingsPage() {
  const [supplierFields, setSupplierFields] = useState<FormField[]>([]);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSupplierFields = localStorage.getItem(SUPPLIER_FIELDS_STORAGE_KEY);
      setSupplierFields(storedSupplierFields ? JSON.parse(storedSupplierFields) : initialSupplierFields);
    } catch (error) {
      console.error("Failed to parse fields from localStorage", error);
      setSupplierFields(initialSupplierFields);
    }
    setIsLoaded(true);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(SUPPLIER_FIELDS_STORAGE_KEY, JSON.stringify(supplierFields));
    toast({
        title: 'Settings Saved',
        description: 'Your settings have been successfully saved.',
    });
  }

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SUPPLIER_FIELDS_STORAGE_KEY, JSON.stringify(supplierFields));
    }
  }, [supplierFields, isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Supplier Form Settings" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
           <div>
              <h2 className="text-2xl font-bold">Supplier Form</h2>
              <p className="text-muted-foreground">Add, remove, or toggle fields for the supplier creation form.</p>
            </div>
            
            <FormSettingsSection 
                fields={supplierFields}
                setFields={setSupplierFields}
            />

           <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
        </div>
      </main>
    </div>
  );
}
