
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FormSettingsSection, type FormField } from '@/components/form-settings-section';

const initialContactFields: FormField[] = [
    { id: 'field-your-name', label: 'Your Name', required: true, checked: true, type: 'text' },
    { id: 'field-your-email', label: 'Your Email', required: true, checked: true, type: 'email' },
    { id: 'field-subject', label: 'Subject', required: true, checked: true, type: 'text' },
    { id: 'field-message', label: 'Message', required: true, checked: true, type: 'textarea' },
];

const CONTACT_FIELDS_STORAGE_KEY = 'contactFormFields';


export default function ContactFormsSettingsPage() {
  const [contactFields, setContactFields] = useState<FormField[]>([]);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedContactFields = localStorage.getItem(CONTACT_FIELDS_STORAGE_KEY);
      setContactFields(storedContactFields ? JSON.parse(storedContactFields) : initialContactFields);
    } catch (error) {
      console.error("Failed to parse fields from localStorage", error);
      setContactFields(initialContactFields);
    }
    setIsLoaded(true);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(CONTACT_FIELDS_STORAGE_KEY, JSON.stringify(contactFields));
    toast({
        title: 'Settings Saved',
        description: 'Your settings have been successfully saved.',
    });
  }

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CONTACT_FIELDS_STORAGE_KEY, JSON.stringify(contactFields));
    }
  }, [contactFields, isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Contact Form Settings" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
           <div>
              <h2 className="text-2xl font-bold">Contact Form</h2>
              <p className="text-muted-foreground">Add, remove, or toggle fields for the supplier contact form.</p>
            </div>
            
            <FormSettingsSection 
                fields={contactFields}
                setFields={setContactFields}
            />

           <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
        </div>
      </main>
    </div>
  );
}
