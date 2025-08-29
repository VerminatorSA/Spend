
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createTask } from '@/services/task-service';

export default function AddTaskPage() {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !priority) {
         toast({
          variant: 'destructive',
          title: 'Missing Required Fields',
          description: `Please fill out the Title and Priority fields.`,
        });
        return;
    }

    let finalDueDate: string | undefined = undefined;
    if (dueDate) {
        const dateWithTime = new Date(dueDate);
        if (dueTime) {
            const [hours, minutes] = dueTime.split(':');
            dateWithTime.setHours(parseInt(hours, 10));
            dateWithTime.setMinutes(parseInt(minutes, 10));
        }
        finalDueDate = dateWithTime.toISOString();
    }
    
    try {
        await createTask({ 
            title, 
            description, 
            priority, 
            dueDate: finalDueDate 
        });

        toast({
        title: 'Task Created',
        description: 'The new task has been successfully added to the board.',
        });
        
        setTitle('');
        setDescription('');
        setDueDate(undefined);
        setDueTime('');
        setPriority('');

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error Creating Task',
            description: 'There was a problem creating the task. Please try again.',
        });
    }
  };


  return (
    <div className="flex h-full flex-col">
      <Header title="Add New Task" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold">New Task Details</h2>
                    <p className="text-muted-foreground">
                        Fill out the form below to add a new task. Required fields are marked with an asterisk (*).
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                            <Input 
                                id="title" 
                                placeholder="e.g., 'Finalize Q4 budget'" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description" 
                                placeholder="Add a more detailed description for this task..." 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority <span className="text-destructive">*</span></Label>
                                <Select onValueChange={(v) => setPriority(v as any)} value={priority}>
                                    <SelectTrigger id="priority">
                                        <SelectValue placeholder="Select a priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Due Date & Time</Label>
                                <div className="flex gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="due-date"
                                                variant={"outline"}
                                                className={cn(
                                                    "flex-1 justify-start text-left font-normal",
                                                    !dueDate && "text-muted-foreground"
                                                )}
                                                >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                            mode="single"
                                            selected={dueDate}
                                            onSelect={setDueDate}
                                            initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Input
                                        type="time"
                                        value={dueTime}
                                        onChange={(e) => setDueTime(e.target.value)}
                                        className="w-[120px]"
                                        disabled={!dueDate}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-2">
                      <Button asChild variant="outline">
                        <Link href="/tasks">Cancel</Link>
                      </Button>
                      <Button type="submit">Add Task</Button>
                    </div>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
}
