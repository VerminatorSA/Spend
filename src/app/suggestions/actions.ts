'use server';

import { z } from 'zod';
import { getProductRecommendations, type ProductRecommendationOutput } from '@/ai/flows/product-recommendation';

const schema = z.object({
  productSpecifications: z.string().min(20, { message: 'Please provide more detailed specifications (at least 20 characters).' }),
});

type State = {
  message?: string | null;
  errors?: {
    productSpecifications?: string[];
  } | null;
  data?: ProductRecommendationOutput | null;
};

export async function submitSpecifications(prevState: State, formData: FormData): Promise<State> {
  try {
    const validatedFields = schema.safeParse({
      productSpecifications: formData.get('productSpecifications'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid input.',
        errors: validatedFields.error.flatten().fieldErrors,
        data: null,
      };
    }

    const result = await getProductRecommendations(validatedFields.data);

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
