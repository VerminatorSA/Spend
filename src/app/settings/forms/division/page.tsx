
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FormSettingsSection, type FormField } from '@/components/form-settings-section';

const initialDivisionFields: FormField[] = [
    { id: 'field-division-name', label: 'Division Name', required: true, checked: true, type: 'text' },
    { id: 'field-parent-company', label: 'Parent Company', required: true, checked: true, type: 'select' },
];

const DIVISION_FIELDS_STORAGE_KEY = 'divisionFormFields';

export default function DivisionFormsSettingsPage() {
  const [divisionFields, setDivisionFields] = useState<FormField[]>([]);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedFields = localStorage.getItem(DIVISION_FIELDS_STORAGE_KEY);
      setDivisionFields(storedFields ? JSON.parse(storedFields) : initialDivisionFields);
    } catch (error) {
      console.error("Failed to parse fields from localStorage", error);
      setDivisionFields(initialDivisionFields);
    }
    setIsLoaded(true);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(DIVISION_FIELDS_STORAGE_KEY, JSON.stringify(divisionFields));
    toast({
        title: 'Settings Saved',
        description: 'Your settings have been successfully saved.',
    });
  }

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(DIVISION_FIELDS_STORAGE_KEY, JSON.stringify(divisionFields));
    }
  }, [divisionFields, isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Division Form Settings" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
           <div>
              <h2 className="text-2xl font-bold">Division Form</h2>
              <p className="text-muted-foreground">Add, remove, or toggle fields for the division creation form.</p>
            </div>
            
            <FormSettingsSection 
                fields={divisionFields}
                setFields={setDivisionFields}
            />

           <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
        </div>
      </main>
    </div>
  );
}
