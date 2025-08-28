'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { submitSpecifications } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

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
  const initialState = { message: null, errors: {}, data: null };
  const [state, dispatch] = useFormState(submitSpecifications, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === 'Success') {
      toast({
        title: 'Suggestions Generated',
        description: 'AI recommendations have been successfully generated.',
      });
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
      <Header title="Smart Suggestions" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Item Recommendations</CardTitle>
              <p className="text-muted-foreground">
                Describe the specifications of the items you are manufacturing, and our AI will recommend suitable components and materials.
              </p>
            </CardHeader>
            <CardContent>
              <form action={dispatch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itemSpecifications">Item Specifications</Label>
                  <Textarea
                    id="itemSpecifications"
                    name="itemSpecifications"
                    placeholder="e.g., 'We need a 5mm diameter, 20mm long, corrosion-resistant machine screw for an outdoor enclosure made of ABS plastic...'"
                    rows={6}
                    aria-describedby="spec-error"
                  />
                  {state.errors?.itemSpecifications && (
                    <p id="spec-error" className="text-sm text-destructive">
                      {state.errors.itemSpecifications.join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex justify-end">
                  <SubmitButton />
                </div>
              </form>
            </CardContent>
          </Card>
          
          {state.data && (
            <div className="mt-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 font-sans text-sm text-muted-foreground">
                    {state.data.recommendedItems}
                  </pre>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Information</CardTitle>
                </CardHeader>
                <CardContent>
                   <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 font-sans text-sm text-muted-foreground">
                    {state.data.supplierInformation}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
