
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { submitEmail } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { contacts } from '@/lib/data';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Send Email
        </>
      )}
    </Button>
  );
}

export default function EmailPage() {
  const initialState = { message: null, errors: {} };
  const [state, formAction] = useActionState(submitEmail, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === 'Success') {
      toast({
        title: 'Email Sent',
        description: 'Your email has been successfully sent.',
      });
      formRef.current?.reset();
    } else if (state.message && state.message !== 'Invalid input.') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="flex h-full flex-col">
      <Header title="Email Suite" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Compose Email</CardTitle>
                    <CardDescription>Send an email to one of your contacts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form ref={formRef} action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="to">Recipient</Label>
                            <Select name="to">
                                <SelectTrigger id="to">
                                    <SelectValue placeholder="Select a contact" />
                                </SelectTrigger>
                                <SelectContent>
                                    {contacts.map(contact => (
                                        <SelectItem key={contact.id} value={contact.email}>
                                            {contact.name} ({contact.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                             {state.errors?.to && (
                                <p className="mt-2 text-sm text-destructive">
                                    {state.errors.to.join(', ')}
                                </p>
                            )}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" name="subject" placeholder="Your email subject" />
                             {state.errors?.subject && (
                                <p className="mt-2 text-sm text-destructive">
                                    {state.errors.subject.join(', ')}
                                </p>
                            )}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" placeholder="Type your message here." rows={10} />
                             {state.errors?.message && (
                                <p className="mt-2 text-sm text-destructive">
                                    {state.errors.message.join(', ')}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <SubmitButton />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
