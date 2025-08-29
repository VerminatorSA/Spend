
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { submitQuery } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, User, Bot, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Thinking...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Send
        </>
      )}
    </Button>
  );
}

export default function SuggestionsPage() {
  const initialState = { message: null, errors: {}, data: null, input: null };
  
  const useActionStateWithInput = (action: (prevState: any, formData: FormData) => Promise<any>, initialSt: any) => {
    const [state, setState] = useActionState(action, initialSt);
    const formRef = useRef<HTMLFormElement>(null);

    const formAction = async (formData: FormData) => {
        const input = formData.get('query') as string;
        const newState = await action(state, formData);
        setState({ ...newState, input });
    };

    return [state, formAction, formRef] as const;
  };
  
  const [state, formAction, formRef] = useActionStateWithInput(submitQuery, initialState);
  const { toast } = useToast();
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.message === 'Success') {
      toast({
        title: 'Response Received',
        description: 'Spencer has responded.',
      });
      formRef.current?.reset();
    } else if (state.message && state.message !== 'Invalid input.') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast, formRef]);

  useEffect(() => {
      conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.data]);

  return (
    <div className="flex h-full max-h-screen flex-col">
      <Header title="Spencer" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold">AI-Powered Assistant</h2>
            <p className="text-muted-foreground">
              Ask for item recommendations, inquire about the app, or just say hello.
            </p>
          </div>
          
          <div className="space-y-6 pb-24">

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
                        <Avatar className="h-9 w-9 border border-primary">
                             <AvatarFallback className={cn("text-primary-foreground", state.data.isWarning ? "bg-destructive" : "bg-primary" )}>
                                {state.data.isWarning ? <AlertTriangle /> : <Bot />}
                             </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4">
                            <Card className={cn(state.data.isWarning && "border-destructive bg-destructive/10")}>
                                <CardHeader>
                                <CardTitle className={cn(state.data.isWarning && "text-destructive")}>Spencer</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className={cn(
                                        "whitespace-pre-wrap font-sans text-sm",
                                        state.data.isWarning ? "text-destructive" : "text-muted-foreground"
                                    )}>
                                        {state.data.response}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
            <div ref={conversationEndRef} />
          </div>
        </div>
      </main>
       <footer className="sticky bottom-0 border-t bg-background/95 py-4 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-4xl px-4">
            <form ref={formRef} action={formAction}>
                <div className="relative">
                  <Textarea
                      id="query"
                      name="query"
                      placeholder="e.g., 'Hello! Can you suggest a corrosion-resistant screw for an outdoor enclosure?'"
                      rows={1}
                      aria-describedby="spec-error"
                      className="min-h-12 resize-none pr-24"
                  />
                  <div className="absolute bottom-2.5 right-2.5">
                      <SubmitButton />
                  </div>
                </div>
                {state.errors?.query && (
                      <p id="spec-error" className="mt-2 text-sm text-destructive">
                      {state.errors.query.join(', ')}
                      </p>
                  )}
              </form>
          </div>
        </footer>
    </div>
  );
}
