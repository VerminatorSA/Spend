
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

type FieldType = 'text' | 'textarea' | 'select' | 'email' | 'number' | 'date';

interface FormField {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  isCustom?: boolean;
  type?: FieldType;
}

const initialItemFields: FormField[] = [
    { id: 'field-item-name', label: 'Item Name', required: true, checked: true, type: 'text' },
    { id: 'field-price', label: 'Price', required: true, checked: true, type: 'number' },
    { id: 'field-unit', label: 'Unit', required: true, checked: true, type: 'text' },
    { id: 'field-category', label: 'Category', required: true, checked: true, type: 'text' },
    { id: 'field-supplier', label: 'Supplier', required: true, checked: true, type: 'text' },
    { id: 'field-description', label: 'Description', required: false, checked: true, type: 'textarea' },
    { id: 'field-sku', label: 'SKU', required: false, checked: false, type: 'text' },
    { id: 'field-stock', label: 'Stock Quantity', required: false, checked: true, type: 'number' },
];

const ITEM_FIELDS_STORAGE_KEY = 'itemFormFields';

function FormSettingsSection({
  fields,
  setFields,
}: {
  fields: FormField[];
  setFields: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('text');
  const { toast } = useToast();

  const handleAddField = () => {
    if (newFieldName.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Field name cannot be empty.',
      });
      return;
    }
    const newField: FormField = {
      id: `custom-${Date.now()}`,
      label: newFieldName.trim(),
      required: true,
      checked: true,
      isCustom: true,
      type: newFieldType,
    };
    setFields([...fields, newField]);
    setNewFieldName('');
    setNewFieldType('text');
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };
  
  const handleToggleField = (id: string) => {
    setFields(fields.map(field => field.id === id ? {...field, checked: !field.checked} : field));
  };
  
  const handleToggleRequired = (id: string) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, required: !field.required } : field
      )
    );
  };

  return (
      <div className="space-y-6">
          <div>
              <div className="space-y-3">
              {fields.map((field) => (
                  <div key={field.id} className="flex flex-col items-start gap-4 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id={`checked-${field.id}`}
                        checked={field.checked} 
                        disabled={field.required && !field.isCustom}
                        onCheckedChange={() => handleToggleField(field.id)}
                      />
                      <Label htmlFor={`checked-${field.id}`} className={field.required && !field.isCustom ? 'font-semibold' : ''}>
                        {field.label}
                      </Label>
                    </div>
                    <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
                       <div className="flex items-center space-x-2">
                        <Switch 
                          id={`required-${field.id}`}
                          checked={field.required}
                          onCheckedChange={() => handleToggleRequired(field.id)}
                          disabled={!field.isCustom && field.required}
                        />
                        <Label htmlFor={`required-${field.id}`} className="text-sm text-muted-foreground">
                          Required
                        </Label>
                      </div>
                      {field.isCustom && (
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveField(field.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                      )}
                    </div>
                  </div>
              ))}
              </div>
          </div>
          <Separator />
          <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="mb-2 font-medium">Add New Field</h4>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input 
                    placeholder="e.g., 'Minimum Order Quantity'" 
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    className="flex-grow"
                />
                 <Select value={newFieldType} onValueChange={(value) => setNewFieldType(value as FieldType)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select field type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Text Area</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                <Button onClick={handleAddField} className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Field
                </Button>
              </div>
          </div>
      </div>
  );
}


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
