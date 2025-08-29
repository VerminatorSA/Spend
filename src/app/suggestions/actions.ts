
'use server';

import { z } from 'zod';
import { getItemRecommendations, type ItemRecommendationOutput } from '@/ai/flows/item-recommendation';

const schema = z.object({
  itemSpecifications: z.string().min(20, { message: 'Please provide more detailed specifications (at least 20 characters).' }),
});

type State = {
  message?: string | null;
  errors?: {
    itemSpecifications?: string[];
  } | null;
  data?: ItemRecommendationOutput | null;
  input?: string | null;
};

export async function submitSpecifications(prevState: State, formData: FormData): Promise<State> {
  try {
    const validatedFields = schema.safeParse({
      itemSpecifications: formData.get('itemSpecifications'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid input.',
        errors: validatedFields.error.flatten().fieldErrors,
        data: null,
      };
    }

    const result = await getItemRecommendations(validatedFields.data);

    return {
      message: 'Success',
      errors: null,
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An unexpected error occurred while getting recommendations.',
      errors: null,
      data: null,
    };
  }
}
