
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { submitSpecifications } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, User, Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Get Suggestions
        </>
      )}
    </Button>
  );
}

export default function SuggestionsPage() {
  const initialState = { message: null, errors: {}, data: null, input: null };
  
  // A custom hook to manage the form state and include the user's input
  const useActionStateWithInput = (action: (prevState: any, formData: FormData) => Promise<any>, initialSt: any) => {
    const [state, setState] = useActionState(action, initialSt);
    const formRef = useRef<HTMLFormElement>(null);

    const formAction = async (formData: FormData) => {
        const input = formData.get('itemSpecifications') as string;
        const newState = await action(state, formData);
        setState({ ...newState, input });
    };

    return [state, formAction, formRef] as const;
  };
  
  const [state, formAction, formRef] = useActionStateWithInput(submitSpecifications, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === 'Success') {
      toast({
        title: 'Suggestions Generated',
        description: 'AI recommendations have been successfully generated.',
      });
      // Reset the form input after successful submission
      formRef.current?.reset();
    } else if (state.message && state.message !== 'Invalid input.') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast, formRef]);

  return (
    <div className="flex h-full flex-col">
      <Header title="Turbo Assistant" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold">AI-Powered Item Recommendations</h2>
            <p className="text-muted-foreground">
              Describe the specifications of the items you are manufacturing, and our AI will recommend suitable components and materials.
            </p>
          </div>
          
          <div className="space-y-6">

            {state.data && state.input && (
                 <div className="space-y-6">
                    {/* User's Query */}
                    <div className="flex items-start gap-4">
                        <Avatar className="h-9 w-9 border">
                            <AvatarFallback><User/></AvatarFallback>
                        </Avatar>
                        <div className="flex-1 rounded-lg border bg-card p-4">
                            <p className="font-semibold text-card-foreground">Your Request</p>
                            <p className="text-muted-foreground">{state.input}</p>
                        </div>
                    </div>

                    {/* AI's Response */}
                    <div className="flex items-start gap-4">
                        <Avatar className="h-9 w-9 border border-accent">
                             <AvatarFallback className="bg-accent text-accent-foreground"><Bot /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4">
                            <Card>
                                <CardHeader>
                                <CardTitle>Recommended Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">
                                        {state.data.recommendedItems}
                                    </p>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                <CardTitle>Supplier Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">
                                        {state.data.supplierInformation}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
            
            <form ref={formRef} action={formAction} className="sticky bottom-0 bg-background/80 py-4 backdrop-blur-md">
              <div className="relative">
                <Textarea
                    id="itemSpecifications"
                    name="itemSpecifications"
                    placeholder="e.g., 'We need a 5mm diameter, 20mm long, corrosion-resistant machine screw for an outdoor enclosure...'"
                    rows={3}
                    aria-describedby="spec-error"
                    className="pr-32"
                />
                <div className="absolute bottom-2 right-2">
                    <SubmitButton />
                </div>
              </div>
               {state.errors?.itemSpecifications && (
                    <p id="spec-error" className="mt-2 text-sm text-destructive">
                    {state.errors.itemSpecifications.join(', ')}
                    </p>
                )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
