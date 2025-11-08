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

export function ProductCard({ product }: { product: Product }) {
  const { isFavorite, addFavorite, removeFavorite } = useApp();
  const isFav = isFavorite(product.name);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(product.name);
    } else {
      addFavorite(product);
    }
  };

  const placeholder =
    PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
        <CardDescription>{product.brand}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="aspect-square relative w-full rounded-md overflow-hidden">
          <Image
            src={placeholder.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={placeholder.imageHint}
          />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.description}
        </p>
        <div>
          <h4 className="font-semibold text-sm mb-1">Benefits for you:</h4>
          <p className="text-sm text-foreground/80">{product.benefits}</p>
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
