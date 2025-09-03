
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { companies, divisions } from '@/lib/organization';
import { users } from '@/lib/users';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';


export default function InviteUserPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [divisionId, setDivisionId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const availableDivisions = companyId ? divisions.filter(d => d.companyId === companyId) : [];

    const handleCompanyChange = (id: string) => {
        setCompanyId(id);
        setDivisionId(''); // Reset division when company changes
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!firstName || !lastName || !email || !companyId || !divisionId) {
            toast({
                variant: 'destructive',
                title: 'Missing Required Fields',
                description: 'Please fill out all fields to send an invitation.',
            });
            setIsSubmitting(false);
            return;
        }

        toast({
            variant: 'destructive',
            title: 'Feature Deprecated',
            description: 'Email invitations are currently disabled. Please ask new users to sign up directly.',
        });
        setIsSubmitting(false);
    };

    return (
        <div className="flex h-full flex-col">
        <Header title="Invite New User" />
        <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="mx-auto max-w-4xl">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold">User Invitation</h2>
                        <p className="text-muted-foreground">
                            Fill out the form below to invite a new user to the application. All fields are required.
                        </p>
                    </div>
                     <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Invitations Disabled</AlertTitle>
                        <AlertDescription>
                            The email invitation service is currently unavailable. New users should be directed to the <Link href="/signup" className="font-bold underline">Sign Up</Link> page to create their own accounts.
                        </AlertDescription>
                    </Alert>
                    <form onSubmit={handleSubmit} className="space-y-6 opacity-50">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                             <div className="space-y-2">
                                <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                                <Input id="firstName" placeholder="e.g., John" value={firstName} onChange={e => setFirstName(e.target.value)} disabled />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                                <Input id="lastName" placeholder="e.g., Doe" value={lastName} onChange={e => setLastName(e.target.value)} disabled />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                            <Input id="email" type="email" placeholder="e.g., user@example.com" value={email} onChange={e => setEmail(e.target.value)} disabled />
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="companyId">Company <span className="text-destructive">*</span></Label>
                                <Select value={companyId} onValueChange={handleCompanyChange} disabled>
                                    <SelectTrigger id="companyId">
                                        <SelectValue placeholder="Select a company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="divisionId">Division <span className="text-destructive">*</span></Label>
                                <Select value={divisionId} onValueChange={setDivisionId} disabled>
                                    <SelectTrigger id="divisionId">
                                        <SelectValue placeholder="Select a division" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableDivisions.map(d => (
                                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 gap-2">
                          <Button asChild variant="outline">
                            <Link href="/settings/users">Cancel</Link>
                          </Button>
                          <Button type="submit" disabled>
                            Send Invitation
                          </Button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
        </div>
    );
}
