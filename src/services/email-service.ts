
/**
 * @fileOverview A service for sending emails via Firebase Cloud Functions.
 */
import { functions, httpsCallable } from '@/lib/firebase';
import { auth } from '@/lib/firebase';

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
    
    const functionName = 'sendEmail';

    if (!auth.currentUser) {
        throw new Error("User is not authenticated. Cannot send email.");
    }

    try {
        const sendEmailFunction = httpsCallable(functions, functionName);
        
        const emailData = {
            to: payload.email,
            subject: `You're invited to join Spend`,
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
