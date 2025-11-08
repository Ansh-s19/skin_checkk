'use server';

import {
  analyzeUploadedSkinPhoto,
  type AnalyzeUploadedSkinPhotoOutput,
} from '@/ai/flows/analyze-uploaded-skin-photo';
import {
  recommendPersonalizedProducts,
  type RecommendPersonalizedProductsOutput,
} from '@/ai/flows/recommend-personalized-products';

interface ActionResult {
  analysis: AnalyzeUploadedSkinPhotoOutput;
  recommendations: RecommendPersonalizedProductsOutput;
}

export async function analyzeSkinAndRecommendProducts(
  photoDataUri: string
): Promise<{ data: ActionResult | null; error: string | null }> {
  if (!photoDataUri) {
    return { data: null, error: 'No photo data provided.' };
  }

  try {
    const analysisResult = await analyzeUploadedSkinPhoto({ photoDataUri });

    if (!analysisResult.skinType || !analysisResult.concerns) {
      return { data: null, error: 'Failed to analyze skin from the image.' };
    }

    const recommendationsResult = await recommendPersonalizedProducts({
      skinType: analysisResult.skinType,
      skinConcerns: analysisResult.concerns.join(', '),
    });

    return {
      data: {
        analysis: analysisResult,
        recommendations: recommendationsResult,
      },
      error: null,
    };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during the analysis.';
    return { data: null, error: errorMessage };
  }
}
