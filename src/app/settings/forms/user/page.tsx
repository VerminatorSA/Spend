
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FormSettingsSection, type FormField } from '@/components/form-settings-section';
import { companies, divisions } from '@/lib/organization';


const initialUserFields: FormField[] = [
    { id: 'field-email', label: 'Email Address', required: true, checked: true, type: 'email' },
    { 
        id: 'field-role', 
        label: 'Role', 
        required: true, 
        checked: true, 
        type: 'select', 
        options: [
            { value: 'admin', label: 'Admin'},
            { value: 'user', label: 'User'},
        ] 
    },
    { 
        id: 'field-company', 
        label: 'Company', 
        required: false, 
        checked: true, 
        type: 'select',
        options: companies.map(c => ({ value: c.id, label: c.name }))
    },
    { 
        id: 'field-division', 
        label: 'Division', 
        required: false, 
        checked: true, 
        type: 'select',
        // Options for division are dynamic and will be handled in the form component
    },
];

const USER_FIELDS_STORAGE_KEY = 'userFormFields';

export default function UserFormsSettingsPage() {
  const [userFields, setUserFields] = useState<FormField[]>([]);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedUserFields = localStorage.getItem(USER_FIELDS_STORAGE_KEY);
      if (storedUserFields) {
        // Basic migration: if old format (string options) is detected, map it.
        const parsedFields = JSON.parse(storedUserFields);
        const migratedFields = parsedFields.map((field: any) => {
            if (field.id === 'field-role' && field.options && typeof field.options[0] === 'string') {
                return { ...field, options: field.options.map((o: string) => ({ value: o.toLowerCase(), label: o })) };
            }
             if (field.id === 'field-company') {
                return { ...field, options: companies.map(c => ({ value: c.id, label: c.name })) };
            }
            return field;
        });
        setUserFields(migratedFields);
      } else {
        setUserFields(initialUserFields);
      }
    } catch (error) {
      console.error("Failed to parse fields from localStorage", error);
      setUserFields(initialUserFields);
    }
    setIsLoaded(true);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(USER_FIELDS_STORAGE_KEY, JSON.stringify(userFields));
    toast({
        title: 'Settings Saved',
        description: 'Your settings have been successfully saved.',
    });
  }

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(USER_FIELDS_STORAGE_KEY, JSON.stringify(userFields));
    }
  }, [userFields, isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="User Form Settings" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
           <div>
              <h2 className="text-2xl font-bold">User Invitation Form</h2>
              <p className="text-muted-foreground">Add, remove, or toggle fields for the user invitation form.</p>
            </div>
            
            <FormSettingsSection 
                fields={userFields}
                setFields={setUserFields}
            />

           <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
        </div>
      </main>
    </div>
  );
}
