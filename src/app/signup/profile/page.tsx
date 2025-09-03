
'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/auth-context';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { companies, divisions } from '@/lib/organization';
import { users, type User } from '@/lib/users';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Command } from 'lucide-react';

export default function ProfileSetupPage() {
    const { user, clearNewUserFlag, isNewUser } = useContext(AuthContext);
    const { toast } = useToast();
    const router = useRouter();
    const [companyId, setCompanyId] = useState('');
    const [divisionId, setDivisionId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // If a logged-in user who is NOT a new user lands here, redirect them.
        if (user && !isNewUser) {
            router.replace('/dashboard');
        }
        // If a non-logged-in user lands here, redirect them.
        if (!user) {
            router.replace('/login');
        }
    }, [user, isNewUser, router]);

    const availableDivisions = companyId ? divisions.filter(d => d.companyId === companyId) : [];

    const handleCompanyChange = (id: string) => {
        setCompanyId(id);
        setDivisionId('');
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!companyId || !divisionId) {
            toast({
                variant: 'destructive',
                title: 'Missing Required Fields',
                description: 'Please select your company and division.',
            });
            setIsSubmitting(false);
            return;
        }
        
        if (!user || !user.email || !user.displayName) {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'User information is missing. Please try signing up again.',
            });
            setIsSubmitting(false);
            router.push('/signup');
            return;
        }

        const [firstName, ...lastNameParts] = user.displayName.split(' ');
        const lastName = lastNameParts.join(' ');

        const newUser: User = {
            id: user.uid,
            firstName,
            lastName,
            email: user.email,
            companyId,
            divisionId,
            role: 'Member',
            status: 'Active',
            avatarUrl: `https://picsum.photos/seed/${user.uid}/100/100`,
        };
        
        // In a real app, you'd save this to a database. Here, we push to a local array.
        users.push(newUser);

        toast({
            title: 'Profile Setup Complete!',
            description: 'Welcome to Spend!',
        });
        
        clearNewUserFlag();
        router.push('/dashboard');
    };

    if (!isNewUser || !user) {
        // Render nothing or a loading spinner while redirecting
        return null;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm">
                 <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Command className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Welcome, {user.displayName}!</CardTitle>
                    <CardDescription>Just one more step. Please select your company and division to finish setting up your profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="companyId">Company <span className="text-destructive">*</span></Label>
                            <Select value={companyId} onValueChange={handleCompanyChange}>
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
                            <Select value={divisionId} onValueChange={setDivisionId} disabled={!companyId}>
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
                        <div className="pt-4">
                          <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? 'Saving...' : 'Complete Setup'}
                          </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
