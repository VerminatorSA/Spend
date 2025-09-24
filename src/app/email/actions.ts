
'use server';

import { z } from 'zod';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase'; // Assuming you have firebase initialized here

const schema = z.object({
  to: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(1, { message: 'Subject is required.' }),
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
});

type State = {
  message?: string | null;
  errors?: {
    to?: string[];
    subject?: string[];
    message?: string[];
  } | null;
};

// This function needs to run on the server, as it calls the Firebase Function
async function callSendEmail(data: { to: string; subject: string; text: string }) {
    try {
        // Use httpsCallableFromURL for unauthenticated access from the server
        const functions = getFunctions(app, 'us-central1');
        const sendEmail = httpsCallable(functions, 'sendEmail');
        const result = await sendEmail(data);
        return { success: true, data: result.data };
    } catch (error: any) {
        console.error('Firebase Functions call failed:', error);
        // Provide a more specific error message if available
        const errorMessage = error.message || 'An unknown error occurred.';
        if (error.code === 'unauthenticated') {
             return { success: false, error: 'Sign in required to send emails.' };
        }
        return { success: false, error: errorMessage };
    }
}


export async function submitEmail(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = schema.safeParse({
    to: formData.get('to'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const result = await callSendEmail({
    to: validatedFields.data.to,
    subject: validatedFields.data.subject,
    text: validatedFields.data.message,
  });

  if (result.success) {
    return {
      message: 'Success',
      errors: null,
    };
  } else {
    return {
        message: result.error,
        errors: null,
    }
  }
}
