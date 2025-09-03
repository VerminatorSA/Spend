
/**
 * @fileOverview A service for sending emails via Firebase Cloud Functions.
 */
import { functions, httpsCallable } from '@/lib/firebase';

interface SendEmailPayload {
    email: string;
    name: string;
}

/**
 * Calls a Firebase Cloud Function to send an invitation email.
 * @param payload The data for the email (recipient's email and name).
 * @returns A promise that resolves when the function is called.
 */
export async function sendInvitationEmail(payload: SendEmailPayload): Promise<void> {
    
    // The function is deployed under the 'spend' codebase. The default export 
    // from 'functions-sendemail/src/index.ts' becomes the function name.
    const functionName = 'sendEmail';

    try {
        // We need to specify the region if it's not the default 'us-central1'
        const sendEmailFunction = httpsCallable(functions, functionName);
        
        const emailData = {
            to: payload.email,
            subject: `You're invited to join Spend`,
            // A simple text body. You could make this an HTML template.
            text: `Hi ${payload.name},\n\nYou have been invited to join the Spend application. Please click the link below to get started.\n\nThank you!`,
        };

        const result = await sendEmailFunction(emailData);
        console.log('Cloud Function called successfully, result:', result.data);

    } catch (error) {
        console.error("Error calling Cloud Function:", error);
        // Re-throw the error so the UI can catch it and show a message
        throw new Error("Failed to send email via Cloud Function.");
    }
}
