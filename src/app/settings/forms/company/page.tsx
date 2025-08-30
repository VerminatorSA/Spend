
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FormSettingsSection, type FormField } from '@/components/form-settings-section';

const initialCompanyFields: FormField[] = [
    { id: 'field-company-name', label: 'Company Name', required: true, checked: true, type: 'text' },
    { id: 'field-industry', label: 'Industry', required: true, checked: true, type: 'text' },
];

const COMPANY_FIELDS_STORAGE_KEY = 'companyFormFields';

export default function CompanyFormsSettingsPage() {
  const [companyFields, setCompanyFields] = useState<FormField[]>([]);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedFields = localStorage.getItem(COMPANY_FIELDS_STORAGE_KEY);
      setCompanyFields(storedFields ? JSON.parse(storedFields) : initialCompanyFields);
    } catch (error) {
      console.error("Failed to parse fields from localStorage", error);
      setCompanyFields(initialCompanyFields);
    }
    setIsLoaded(true);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(COMPANY_FIELDS_STORAGE_KEY, JSON.stringify(companyFields));
    toast({
        title: 'Settings Saved',
        description: 'Your settings have been successfully saved.',
    });
  }

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(COMPANY_FIELDS_STORAGE_KEY, JSON.stringify(companyFields));
    }
  }, [companyFields, isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Company Form Settings" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
           <div>
              <h2 className="text-2xl font-bold">Company Form</h2>
              <p className="text-muted-foreground">Add, remove, or toggle fields for the company creation form.</p>
            </div>
            
            <FormSettingsSection 
                fields={companyFields}
                setFields={setCompanyFields}
            />

           <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
        </div>
      </main>
    </div>
  );
}
