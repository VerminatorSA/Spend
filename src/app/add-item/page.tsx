
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { items } from '@/lib/data';

interface FormField {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  isCustom?: boolean;
}

const FORM_FIELDS_STORAGE_KEY = 'itemFormFields';

export default function AddItemPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [configuredFields, setConfiguredFields] = useState<FormField[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const existingCategories = Array.from(new Set(items.map(item => item.category)));

  useEffect(() => {
    try {
        const storedFields = localStorage.getItem(FORM_FIELDS_STORAGE_KEY);
        if (storedFields) {
            setConfiguredFields(JSON.parse(storedFields));
        } else {
            // Fallback to some default fields if nothing is in storage
            setConfiguredFields([
                { id: 'field-item-name', label: 'Item Name', required: true, checked: true },
                { id: 'field-price', label: 'Price', required: true, checked: true },
                { id: 'field-category', label: 'Category', required: true, checked: true },
                { id: 'field-supplier', label: 'Supplier', required: true, checked: true },
                { id: 'field-stock', label: 'Stock Quantity', required: false, checked: true },
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
    if (id === 'field-category' && value === 'add-new') {
        setShowNewCategoryInput(true);
        // Clear the category from form data if 'Add new' is selected
        const newFormData = { ...formData };
        delete newFormData['field-category'];
        setFormData(newFormData);
    } else {
        setShowNewCategoryInput(false);
        setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalFormData = { ...formData };
    if (showNewCategoryInput) {
        const newCategory = formData['new-category'];
        if (!newCategory || newCategory.trim() === '') {
             toast({
                variant: 'destructive',
                title: 'Missing Required Field',
                description: `Please enter a name for the new category.`,
            });
            return;
        }
        finalFormData['field-category'] = newCategory;
    }


    for (const field of configuredFields) {
      // Custom handling for category since it might be in the new input
      if (field.id === 'field-category' && field.checked && field.required && !finalFormData['field-category']) {
        toast({
            variant: 'destructive',
            title: 'Missing Required Field',
            description: `Please select or add a category.`,
          });
          return;
      }

      if (field.checked && field.required && !finalFormData[field.id]) {
         toast({
          variant: 'destructive',
          title: 'Missing Required Field',
          description: `Please fill out the "${field.label}" field.`,
        });
        return;
      }
    }
    console.log('Item Form Submitted:', finalFormData);
    toast({
      title: 'Item Submitted',
      description: 'The new item has been successfully submitted.',
    });
    
    const resetData: Record<string, string> = {};
    configuredFields.forEach(field => {
        if(field.checked) {
            resetData[field.id] = '';
        }
    });
    setFormData(resetData);
    setShowNewCategoryInput(false);
  };

  const visibleFields = configuredFields.filter(f => f.checked);

  if (!isLoaded) {
    return null; 
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Add New Item" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold">New Item Details</h2>
                    <p className="text-muted-foreground">
                        Fill out the form below to add a new item to the catalog. Required fields are marked with an asterisk (*).
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {visibleFields.length > 0 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {visibleFields.map((field) => {
                                    if (field.id === 'field-category') {
                                        return (
                                            <div key={field.id} className="space-y-2">
                                                <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
                                                <Select 
                                                    onValueChange={(value) => handleSelectChange(field.id, value)}
                                                    value={showNewCategoryInput ? 'add-new' : formData[field.id] || ''}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {existingCategories.map(cat => (
                                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                        ))}
                                                        <SelectItem value="add-new">
                                                          <span className="text-primary">Add new category...</span>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {showNewCategoryInput && (
                                                    <Input 
                                                        id="new-category"
                                                        placeholder="Enter new category name"
                                                        value={formData['new-category'] || ''}
                                                        onChange={handleInputChange}
                                                        className="mt-2"
                                                    />
                                                )}
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
                                                type={field.id.includes('price') || field.id.includes('stock') ? 'number' : 'text'}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                    <Button type="submit">Add Item</Button>
                    </div>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
}
