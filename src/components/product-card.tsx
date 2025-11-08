'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useApp } from '@/hooks/use-app';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';

export function ProductCard({ product }: { product: Product }) {
  const { isFavorite, addFavorite, removeFavorite } = useApp();
  const isFav = isFavorite(product.name);
  const [placeholder, setPlaceholder] = useState<typeof PlaceHolderImages[0] | null>(null);

  useEffect(() => {
    // This ensures the random selection only happens on the client-side
    // to avoid hydration mismatches between server and client renders.
    setPlaceholder(
      PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)]
    );
  }, []);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(product.name);
    } else {
      addFavorite(product);
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden bg-card hover:bg-accent/50 transition-colors">
      <CardHeader>
        <CardTitle className="text-lg leading-tight h-10">{product.name}</CardTitle>
        <CardDescription>{product.brand}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="aspect-square relative w-full rounded-md overflow-hidden bg-muted">
          {placeholder && (
            <Image
              src={placeholder.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={placeholder.imageHint}
            />
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 h-14">
          {product.description}
        </p>
        <div>
          <h4 className="font-semibold text-sm mb-1">Benefits for you:</h4>
          <p className="text-sm text-foreground/80 line-clamp-4 h-20">{product.benefits}</p>
        </div>
      </CardContent>
      <CardFooter>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className={cn('h-5 w-5', isFav ? 'text-red-500 fill-current' : 'text-muted-foreground')}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFav ? 'Remove from favorites' : 'Add to favorites'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
