
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, Trash2, Package } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/tasks';
import { items as allItems, type Item } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

interface EditTaskDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export function EditTaskDialog({ task, isOpen, onClose, onSave }: EditTaskDialogProps) {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEditedTask(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof Task, value: string) => {
    setEditedTask(prev => ({ ...prev, [id]: value as any }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setEditedTask(prev => ({ ...prev, dueDate: date ? date.toISOString() : null }));
  };
  
  const handleAddInventoryItem = () => {
    if (selectedItem && !editedTask.inventoryItems?.some(i => i.itemId === selectedItem)) {
      const newItems = [...(editedTask.inventoryItems || []), { itemId: selectedItem, quantity: 1 }];
      setEditedTask(prev => ({ ...prev, inventoryItems: newItems }));
      setSelectedItem('');
    }
  };
  
  const handleRemoveInventoryItem = (itemId: string) => {
    const newItems = editedTask.inventoryItems?.filter(i => i.itemId !== itemId);
    setEditedTask(prev => ({ ...prev, inventoryItems: newItems }));
  };

  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    if (quantity > 0) {
      const newItems = editedTask.inventoryItems?.map(i => i.itemId === itemId ? { ...i, quantity } : i);
      setEditedTask(prev => ({ ...prev, inventoryItems: newItems }));
    }
  };

  const handleSave = () => {
    onSave(editedTask);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={editedTask.title} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={editedTask.description || ''} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={editedTask.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                        <SelectTrigger id="priority">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={editedTask.status} onValueChange={(value) => handleSelectChange('status', value)}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="To Do">To Do</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn("w-full justify-start text-left font-normal", !editedTask.dueDate && "text-muted-foreground")}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editedTask.dueDate ? format(new Date(editedTask.dueDate), "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
                            onSelect={handleDateChange}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
              <h3 className="font-semibold text-foreground">Required Inventory</h3>
              <div className="flex gap-2">
                 <Select value={selectedItem} onValueChange={setSelectedItem}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an item..." />
                    </SelectTrigger>
                    <SelectContent>
                        {allItems.map(item => (
                            <SelectItem key={item.id} value={item.id} disabled={editedTask.inventoryItems?.some(i => i.itemId === item.id)}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleAddInventoryItem} size="icon" variant="outline">
                    <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                {editedTask.inventoryItems && editedTask.inventoryItems.length > 0 ? (
                  editedTask.inventoryItems.map(invItem => {
                    const item = allItems.find(i => i.id === invItem.itemId);
                    return (
                      <div key={invItem.itemId} className="flex items-center justify-between rounded-md bg-background p-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{item?.name}</span>
                          <span className="text-xs text-muted-foreground">In Stock: {item?.stock}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Input 
                              type="number"
                              min="1"
                              className="h-8 w-20"
                              value={invItem.quantity}
                              onChange={(e) => handleItemQuantityChange(invItem.itemId, parseInt(e.target.value, 10))}
                           />
                           <Button variant="ghost" size="icon" onClick={() => handleRemoveInventoryItem(invItem.itemId)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                           </Button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No inventory items linked.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
