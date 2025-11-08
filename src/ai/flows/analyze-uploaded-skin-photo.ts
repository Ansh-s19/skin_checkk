'use server';

/**
 * @fileOverview Analyzes an uploaded skin photo to identify skin type, conditions, and concerns.
 *
 * - analyzeUploadedSkinPhoto - A function that handles the skin photo analysis process.
 * - AnalyzeUploadedSkinPhotoInput - The input type for the analyzeUploadedSkinPhoto function.
 * - AnalyzeUploadedSkinPhotoOutput - The return type for the analyzeUploadedSkinPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUploadedSkinPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the skin, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /* The data URI of the uploaded skin photo. */
    ),
});
export type AnalyzeUploadedSkinPhotoInput = z.infer<typeof AnalyzeUploadedSkinPhotoInputSchema>;

const AnalyzeUploadedSkinPhotoOutputSchema = z.object({
  skinType: z.string().describe('The identified skin type (e.g., oily, dry, combination).'),
  conditions: z
    .array(z.string())
    .describe('A list of potential skin conditions identified in the photo.'),
  concerns: z
    .array(z.string())
    .describe('A list of specific skin concerns identified (e.g., wrinkles, acne, dark spots).'),
});
export type AnalyzeUploadedSkinPhotoOutput = z.infer<typeof AnalyzeUploadedSkinPhotoOutputSchema>;

export async function analyzeUploadedSkinPhoto(
  input: AnalyzeUploadedSkinPhotoInput
): Promise<AnalyzeUploadedSkinPhotoOutput> {
  return analyzeUploadedSkinPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUploadedSkinPhotoPrompt',
  input: {schema: AnalyzeUploadedSkinPhotoInputSchema},
  output: {schema: AnalyzeUploadedSkinPhotoOutputSchema},
  prompt: `You are an AI skin analysis expert. Analyze the provided skin photo to determine the skin type, potential conditions, and specific concerns.

  Photo: {{media url=photoDataUri}}

  Provide the skin type, a list of potential skin conditions, and a list of specific skin concerns.
`,
});

const analyzeUploadedSkinPhotoFlow = ai.defineFlow(
  {
    name: 'analyzeUploadedSkinPhotoFlow',
    inputSchema: AnalyzeUploadedSkinPhotoInputSchema,
    outputSchema: AnalyzeUploadedSkinPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
