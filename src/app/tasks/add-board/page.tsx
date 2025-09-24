
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { createBoard } from '@/services/board-service';

export default function AddBoardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
         toast({
          variant: 'destructive',
          title: 'Board Name Required',
          description: `Please enter a name for the new board.`,
        });
        return;
    }
    
    try {
        const newBoard = await createBoard({ 
            name, 
            description,
        });

        toast({
        title: 'Board Created',
        description: `The "${newBoard.name}" board has been successfully created.`,
        });
        
        router.push(`/tasks/${newBoard.id}`);

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error Creating Board',
            description: 'There was a problem creating the board. Please try again.',
        });
    }
  };


  return (
    <div className="flex h-full flex-col">
      <Header title="Create New Board" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold">New Board Details</h2>
                    <p className="text-muted-foreground">
                        Fill out the form below to create a new task board.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Board Name <span className="text-destructive">*</span></Label>
                            <Input 
                                id="name" 
                                placeholder="e.g., 'Project Phoenix'" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description" 
                                placeholder="Add a short description for this board..." 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-2">
                      <Button asChild variant="outline">
                        <Link href="/tasks">Cancel</Link>
                      </Button>
                      <Button type="submit">Create Board</Button>
                    </div>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
}
