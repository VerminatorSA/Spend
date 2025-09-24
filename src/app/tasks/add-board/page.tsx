
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { companies, divisions } from '@/lib/organization';
import { users } from '@/lib/users';

export default function AddBoardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const [divisionId, setDivisionId] = useState<string | undefined>(undefined);
  const [ownerId, setOwnerId] = useState<string | undefined>(undefined);

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
            companyId,
            divisionId,
            ownerId,
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
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="companyId">Company (Optional)</Label>
                                <Select onValueChange={setCompanyId} value={companyId}>
                                    <SelectTrigger id="companyId">
                                        <SelectValue placeholder="Assign a company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="divisionId">Division (Optional)</Label>
                                <Select onValueChange={setDivisionId} value={divisionId}>
                                    <SelectTrigger id="divisionId">
                                        <SelectValue placeholder="Assign a division" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {divisions.map(d => (
                                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ownerId">Owner (Optional)</Label>
                                <Select onValueChange={setOwnerId} value={ownerId}>
                                    <SelectTrigger id="ownerId">
                                        <SelectValue placeholder="Assign an owner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map(u => (
                                            <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
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
