
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/header';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { companies, divisions, type Company, type Division } from '@/lib/organization';

interface FormField {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  isCustom?: boolean;
  type?: 'text' | 'email' | 'select';
  options?: string[];
}

const FORM_FIELDS_STORAGE_KEY = 'userFormFields';

export default function InviteUserPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [configuredFields, setConfiguredFields] = useState<FormField[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  const availableDivisions = useMemo(() => {
    if (!selectedCompany) return [];
    return divisions.filter(d => d.companyId === selectedCompany);
  }, [selectedCompany]);


  useEffect(() => {
    try {
        const storedFields = localStorage.getItem(FORM_FIELDS_STORAGE_KEY);
        if (storedFields) {
            setConfiguredFields(JSON.parse(storedFields));
        } else {
            setConfiguredFields([
                { id: 'field-email', label: 'Email Address', required: true, checked: true, type: 'email' },
                { id: 'field-role', label: 'Role', required: true, checked: true, type: 'select', options: ['Admin', 'User'] },
                { id: 'field-company', label: 'Company', required: false, checked: true, type: 'select' },
                { id: 'field-division', label: 'Division', required: false, checked: true, type: 'select' },
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
  
  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (id === 'field-company') {
        setSelectedCompany(value);
        // Reset division if company changes
        setFormData(prev => ({...prev, 'field-division': ''}));
    }
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
    console.log('User Invitation Submitted:', formData);
    toast({
      title: 'Invitation Sent',
      description: `An invitation has been sent to ${formData['field-email']}.`,
    });
    
    const resetData: Record<string, string> = {};
    configuredFields.forEach(field => {
        if(field.checked) {
            resetData[field.id] = '';
        }
    });
    setFormData(resetData);
    setSelectedCompany('');
  };

  const visibleFields = configuredFields.filter(f => f.checked);

  if (!isLoaded) {
    return null; 
  }

  const renderField = (field: FormField) => {
    if (field.type === 'select') {
        let options: {value: string, label: string}[] = [];
        if (field.id === 'field-role') {
            options = field.options?.map(opt => ({ value: opt, label: opt })) || [];
        } else if (field.id === 'field-company') {
            options = companies.map(c => ({ value: c.id, label: c.name }));
        } else if (field.id === 'field-division') {
            options = availableDivisions.map(d => ({ value: d.id, label: d.name }));
        }

        return (
            <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
                <Select 
                    onValueChange={(value) => handleSelectChange(field.id, value)}
                    value={formData[field.id] || ''}
                    disabled={field.id === 'field-division' && !selectedCompany}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        )
    }
    return (
        <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
            <Input 
                id={field.id} 
                placeholder={`Enter ${field.label}`} 
                onChange={handleInputChange} 
                value={formData[field.id] || ''}
                type={field.type || 'text'}
            />
        </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Invite New User" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold">New User Invitation</h2>
                    <p className="text-muted-foreground">
                        Enter the email and role for the new user. They will receive an invitation to join your team. Required fields are marked with an asterisk (*).
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {visibleFields.length > 0 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {visibleFields.map((field) => renderField(field))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                    <Button type="submit">Send Invitation</Button>
                    </div>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
}
