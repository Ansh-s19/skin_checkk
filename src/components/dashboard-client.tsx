'use client';

import { useState, useTransition, useRef } from 'react';
import Image from 'next/image';
import { analyzeSkinAndRecommendProducts } from '@/app/actions';
import { useApp } from '@/hooks/use-app';
import { useToast } from '@/hooks/use-toast';
import type { SkinAnalysis, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product-card';
import { FileUp, Bot, Sparkles, Droplets, FlaskConical, Target, Wand2, X } from 'lucide-react';

interface AnalysisResult {
  analysis: SkinAnalysis;
  recommendations: { products: Product[] };
}

export function DashboardClient() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addProgressEntry } = useApp();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyzeClick = () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please upload a photo to start the analysis.',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const photoDataUri = reader.result as string;
      startTransition(async () => {
        const { data, error } = await analyzeSkinAndRecommendProducts(
          photoDataUri
        );
        if (error) {
          setError(error);
          toast({
            title: 'Analysis Failed',
            description: error,
            variant: 'destructive',
          });
        } else if (data) {
          setResult(data);
          addProgressEntry({ photoDataUri, analysis: data.analysis });
          setError(null);
        }
      });
    };
  };

  const handleUploadClick = () => {
    if (!preview) {
        fileInputRef.current?.click();
    }
  };
  
  const handleRemoveImage = () => {
    setPreview(null);
    setFile(null);
    setResult(null);
    setError(null);
    // Reset file input value
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const getSkinTypeIcon = (skinType: string) => {
    const lowerCaseSkinType = skinType.toLowerCase();
    if (lowerCaseSkinType.includes('oily')) return <Droplets className="h-5 w-5 text-accent-foreground" />;
    if (lowerCaseSkinType.includes('dry')) return <Sparkles className="h-5 w-5 text-accent-foreground" />;
    if (lowerCaseSkinType.includes('combination')) return <Wand2 className="h-5 w-5 text-accent-foreground" />;
    return <Bot className="h-5 w-5 text-accent-foreground" />;
  };

  return (
    <div className="grid gap-8 grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUp /> Your Photo
          </CardTitle>
          <CardDescription>Upload a clear photo of your skin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="aspect-square w-full max-w-md mx-auto rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/20 relative"
          >
            {preview ? (
                <>
                    <Image
                        src={preview}
                        alt="Skin preview"
                        width={400}
                        height={400}
                        className="object-cover rounded-md h-full w-full"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full h-8 w-8"
                        onClick={handleRemoveImage}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove image</span>
                    </Button>
                </>
            ) : (
              <div 
                className="text-center text-muted-foreground p-4 cursor-pointer"
                onClick={handleUploadClick}
              >
                <FileUp className="mx-auto h-12 w-12" />
                <p>Click to upload</p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            onClick={handleAnalyzeClick}
            disabled={!file || isPending}
            className="w-full max-w-md mx-auto"
          >
            {isPending ? 'Analyzing...' : 'Analyze My Skin'}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {isPending && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          </div>
        )}

        {!isPending && result && (
            <div className="space-y-8 animate-in fade-in-50 duration-500">
            <Card className="bg-accent/30 border-accent">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Bot /> AI Skin Analysis Results
                </CardTitle>
                <CardDescription>
                    Here's what our AI discovered about your skin.
                </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
                      {getSkinTypeIcon(result.analysis.skinType)}
                      <div>
                        <p className="text-sm text-muted-foreground">Skin Type</p>
                        <p className="font-semibold text-lg">{result.analysis.skinType}</p>
                      </div>
                  </div>
                   <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
                      <FlaskConical className="h-5 w-5 text-accent-foreground"/>
                      <div>
                        <p className="text-sm text-muted-foreground">Potential Conditions</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {result.analysis.conditions.map((item) => (
                                <Badge key={item} variant="secondary">{item}</Badge>
                            ))}
                        </div>
                      </div>
                  </div>
                   <div className="flex items-center gap-4 p-4 rounded-lg bg-card border">
                      <Target className="h-5 w-5 text-accent-foreground"/>
                      <div>
                        <p className="text-sm text-muted-foreground">Key Concerns</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {result.analysis.concerns.map((item) => (
                                <Badge key={item} variant="secondary">{item}</Badge>
                            ))}
                        </div>
                      </div>
                  </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Sparkles /> Personalized Recommendations
                </CardTitle>
                <CardDescription>
                    Products selected just for you based on your analysis.
                </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.recommendations.products.map((product) => (
                        <ProductCard key={product.name} product={product} />
                    ))}
                  </div>
                </CardContent>
            </Card>
            </div>
        )}

        {!isPending && !result && !error && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full min-h-96 text-muted-foreground">
             <Bot size={48} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2 font-headline">Awaiting Analysis</h3>
            <p>Your skin analysis results will appear here once you upload a photo.</p>
          </div>
        )}
      </div>
    </div>
  );
}
