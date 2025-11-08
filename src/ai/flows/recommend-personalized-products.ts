'use server';

/**
 * @fileOverview A flow for recommending personalized skincare products based on skin analysis.
 *
 * - recommendPersonalizedProducts - A function that recommends products based on skin analysis.
 * - RecommendPersonalizedProductsInput - The input type for the recommendPersonalizedProducts function.
 * - RecommendPersonalizedProductsOutput - The return type for the recommendPersonalizedProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendPersonalizedProductsInputSchema = z.object({
  skinType: z.string().describe('The user\u0027s skin type (e.g., oily, dry, combination).'),
  skinConcerns: z
    .string()
    .describe('A comma-separated list of the user\u0027s skin concerns (e.g., acne, wrinkles, dryness).'),
});
export type RecommendPersonalizedProductsInput = z.infer<
  typeof RecommendPersonalizedProductsInputSchema
>;

const RecommendPersonalizedProductsOutputSchema = z.object({
  products: z.array(
    z.object({
      name: z.string().describe('The name of the product.'),
      description: z.string().describe('A brief description of the product.'),
      brand: z.string().describe('The brand of the product.'),
      benefits: z.string().describe('The benefits of using the product for the user.'),
    })
  ).describe('A list of personalized skincare product recommendations.'),
});
export type RecommendPersonalizedProductsOutput = z.infer<
  typeof RecommendPersonalizedProductsOutputSchema
>;

export async function recommendPersonalizedProducts(
  input: RecommendPersonalizedProductsInput
): Promise<RecommendPersonalizedProductsOutput> {
  return recommendPersonalizedProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendPersonalizedProductsPrompt',
  input: {schema: RecommendPersonalizedProductsInputSchema},
  output: {schema: RecommendPersonalizedProductsOutputSchema},
  prompt: `Based on the user\u0027s skin type ({{{skinType}}}) and skin concerns ({{{skinConcerns}}}), recommend a list of skincare products tailored to their needs. Provide the product name, a brief description, the brand, and the specific benefits for the user.  Respond in JSON format.`,
});

const recommendPersonalizedProductsFlow = ai.defineFlow(
  {
    name: 'recommendPersonalizedProductsFlow',
    inputSchema: RecommendPersonalizedProductsInputSchema,
    outputSchema: RecommendPersonalizedProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
