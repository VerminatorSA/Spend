
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { items, type Item } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { createProduct } from '@/services/product-service';

interface FormField {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  isCustom?: boolean;
}

interface BomItem {
  itemId: string;
  quantity: number;
}

const FORM_FIELDS_STORAGE_KEY = 'productFormFields';

export default function AddProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [configuredFields, setConfiguredFields] = useState<FormField[]>([]);
  const [bom, setBom] = useState<BomItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedFields = localStorage.getItem(FORM_FIELDS_STORAGE_KEY);
      if (storedFields) {
        setConfiguredFields(JSON.parse(storedFields));
      } else {
        setConfiguredFields([
          { id: 'field-product-name', label: 'Product Name', required: true, checked: true },
          { id: 'field-product-description', label: 'Description', required: false, checked: true },
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

  const handleBomItemToggle = (itemId: string, checked: boolean | 'indeterminate') => {
    if (checked) {
      setBom([...bom, { itemId, quantity: 1 }]);
    } else {
      setBom(bom.filter(item => item.itemId !== itemId));
    }
  };

  const handleQuantityChange = (itemId: string, quantity: string) => {
    const numQuantity = parseInt(quantity, 10);
    if (numQuantity > 0) {
      setBom(bom.map(item => item.itemId === itemId ? { ...item, quantity: numQuantity } : item));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    if (bom.length === 0) {
        toast({
            variant: 'destructive',
            title: 'No Items Selected',
            description: 'Please select at least one item for the product\'s bill of materials.',
        });
        return;
    }

    try {
        await createProduct({
            name: formData['field-product-name'],
            description: formData['field-product-description'],
            bom: bom,
        });

        toast({
            title: 'Product Created',
            description: 'The new product has been successfully created.',
        });

        router.push('/inventory');
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error Creating Product',
            description: 'There was a problem creating the product. Please try again.',
        });
    }
  };

  const visibleFields = configuredFields.filter(f => f.checked);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Add New Product" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-4">
              <div>
                  <h2 className="text-2xl font-bold">New Product Details</h2>
                  <p className="text-muted-foreground">
                      Fill out the form below to create a new product. Required fields are marked with an asterisk (*).
                  </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {visibleFields.length > 0 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {visibleFields.map((field) => (
                                <div key={field.id} className="space-y-2">
                                    <Label htmlFor={field.id}>{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
                                    <Input 
                                        id={field.id} 
                                        placeholder={`Enter ${field.label}`} 
                                        onChange={handleInputChange} 
                                        value={formData[field.id] || ''} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <Separator />
                
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Bill of Materials (BOM) <span className="text-destructive">*</span></h3>
                    <div className="grid grid-cols-1 gap-4 rounded-md border p-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map(item => {
                            const bomEntry = bom.find(b => b.itemId === item.id);
                            const isSelected = !!bomEntry;
                            return (
                                <div key={item.id} className="flex items-center justify-between rounded-lg border bg-background p-3">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox 
                                            id={`item-${item.id}`}
                                            checked={isSelected}
                                            onCheckedChange={(checked) => handleBomItemToggle(item.id, checked)}
                                        />
                                        <Label htmlFor={`item-${item.id}`} className="text-sm font-medium">
                                            {item.name}
                                        </Label>
                                    </div>
                                    {isSelected && (
                                        <Input
                                            type="number"
                                            min="1"
                                            className="h-8 w-20"
                                            value={bomEntry.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                            />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit">Create Product</Button>
                </div>
              </form>
          </div>
        </div>
      </main>
    </div>
  );
}
