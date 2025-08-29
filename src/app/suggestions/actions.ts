
'use server';

import { z } from 'zod';
import { getAiAssistantResponse, type AiAssistantOutput } from '@/ai/flows/item-recommendation';

const schema = z.object({
  query: z.string().min(2, { message: 'Please enter a longer query.' }),
});

type State = {
  message?: string | null;
  errors?: {
    query?: string[];
  } | null;
  data?: AiAssistantOutput | null;
  input?: string | null;
};

export async function submitQuery(prevState: State, formData: FormData): Promise<State> {
  try {
    const validatedFields = schema.safeParse({
      query: formData.get('query'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid input.',
        errors: validatedFields.error.flatten().fieldErrors,
        data: null,
      };
    }

    const result = await getAiAssistantResponse(validatedFields.data);

    return {
      message: 'Success',
      errors: null,
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An unexpected error occurred while getting a response.',
      errors: null,
      data: null,
    };
  }
}
