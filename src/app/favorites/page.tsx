'use client';

import AppLayout from '@/components/app-layout';
import { ProductCard } from '@/components/product-card';
import { useApp } from '@/hooks/use-app';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useApp();

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Favorite Products
          </h1>
        </div>
        <p className="text-muted-foreground">
          Your hand-picked collection of skincare favorites.
        </p>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favorites.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-96 text-muted-foreground">
            <Heart size={48} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2 font-headline">No Favorites Yet</h3>
            <p>
              Click the heart icon on any product to save it here for later.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
