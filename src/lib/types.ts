import type { AnalyzeUploadedSkinPhotoOutput } from '@/ai/flows/analyze-uploaded-skin-photo';
import type { RecommendPersonalizedProductsOutput } from '@/ai/flows/recommend-personalized-products';

export type SkinAnalysis = AnalyzeUploadedSkinPhotoOutput;
export type Product = RecommendPersonalizedProductsOutput['products'][0];

export type ProgressEntry = {
  id: string;
  date: string;
  photoDataUri: string;
  analysis: SkinAnalysis;
};
