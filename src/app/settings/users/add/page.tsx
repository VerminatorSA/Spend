
'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { companies, divisions } from '@/lib/organization';
import { users } from '@/lib/users';
import Link from 'next/link';

export default function InviteUserPage() {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        companyId: '',
        divisionId: '',
    });
    const [availableDivisions, setAvailableDivisions] = useState(divisions);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value}));
    };

    const handleSelectChange = (id: 'companyId' | 'divisionId', value: string) => {
        if (id === 'companyId') {
            setFormData(prev => ({...prev, companyId: value, divisionId: ''}));
            setAvailableDivisions(divisions.filter(d => d.companyId === value));
        } else {
            setFormData(prev => ({...prev, [id]: value}));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { firstName, lastName, email, companyId, divisionId } = formData;

        if (!firstName || !lastName || !email || !companyId || !divisionId) {
            toast({
                variant: 'destructive',
                title: 'Missing Required Fields',
                description: 'Please fill out all fields to send an invitation.',
            });
            return;
        }

        const newUser = {
            id: `user-${Date.now()}`,
            firstName,
            lastName,
            email,
            companyId,
            divisionId,
            role: 'Member', // Default role
            status: 'Invited' as 'Invited',
            avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
        };

        users.push(newUser);

        console.log('Invitation Sent:', formData);
        toast({
            title: 'Invitation Sent',
            description: `An invitation has been sent to ${email}.`,
        });

        // Reset form
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            companyId: '',
            divisionId: '',
        });
        setAvailableDivisions(divisions);
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                             <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" placeholder="e.g., John" value={formData.firstName} onChange={handleInputChange} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" placeholder="e.g., Doe" value={formData.lastName} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="e.g., user@example.com" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="companyId">Company</Label>
                                <Select value={formData.companyId} onValueChange={(value) => handleSelectChange('companyId', value)}>
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
                                <Label htmlFor="divisionId">Division</Label>
                                <Select value={formData.divisionId} onValueChange={(value) => handleSelectChange('divisionId', value)} disabled={!formData.companyId}>
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
                          <Button type="submit">Send Invitation</Button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
        </div>
    );
}
