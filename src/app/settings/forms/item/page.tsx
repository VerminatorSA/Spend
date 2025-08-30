
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FormSettingsSection, type FormField } from '@/components/form-settings-section';


const initialItemFields: FormField[] = [
    { id: 'field-item-name', label: 'Item Name', required: true, checked: true, type: 'text' },
    { id: 'field-price', label: 'Price', required: true, checked: true, type: 'number' },
    { id: 'field-unit', label: 'Unit', required: true, checked: true, type: 'text' },
    { id: 'field-category', label: 'Category', required: true, checked: true, type: 'text' },
    { id: 'field-supplier', label: 'Supplier', required: true, checked: true, type: 'text' },
    { id: 'field-description', label: 'Description', required: false, checked: true, type: 'textarea' },
    { id: 'field-sku', label: 'SKU', required: false, checked: false, type: 'text' },
    { id: 'field-stock', label: 'Stock Quantity', required: false, checked: true, type: 'number' },
    { id: 'field-reorder-level', label: 'Reorder Level', required: false, checked: true, type: 'number' },
];

const ITEM_FIELDS_STORAGE_KEY = 'itemFormFields';


export default function ItemFormsSettingsPage() {
  const [itemFields, setItemFields] = useState<FormField[]>([]);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedItemFields = localStorage.getItem(ITEM_FIELDS_STORAGE_KEY);
      setItemFields(storedItemFields ? JSON.parse(storedItemFields) : initialItemFields);
    } catch (error) {
      console.error("Failed to parse fields from localStorage", error);
      setItemFields(initialItemFields);
    }
    setIsLoaded(true);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(ITEM_FIELDS_STORAGE_KEY, JSON.stringify(itemFields));
    toast({
        title: 'Settings Saved',
        description: 'Your settings have been successfully saved.',
    });
  }

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(ITEM_FIELDS_STORAGE_KEY, JSON.stringify(itemFields));
    }
  }, [itemFields, isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Item Form Settings" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
           <div>
              <h2 className="text-2xl font-bold">Item Form</h2>
              <p className="text-muted-foreground">Add, remove, or toggle fields for the item creation form.</p>
            </div>
            
            <FormSettingsSection 
                fields={itemFields}
                setFields={setItemFields}
            />

           <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
        </div>
      </main>
    </div>
  );
}
