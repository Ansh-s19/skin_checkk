'use client';

import type { Product, ProgressEntry } from '@/lib/types';
import React, { createContext, useState, useEffect, useCallback } from 'react';

interface AppContextType {
  favorites: Product[];
  progress: ProgressEntry[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productName: string) => void;
  isFavorite: (productName: string) => boolean;
  addProgressEntry: (entry: Omit<ProgressEntry, 'id' | 'date'>) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('lumi-favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      const storedProgress = localStorage.getItem('lumi-progress');
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('lumi-favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error("Failed to write favorites to localStorage", error);
      }
    }
  }, [favorites, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('lumi-progress', JSON.stringify(progress));
      } catch (error) {
        console.error("Failed to write progress to localStorage", error);
      }
    }
  }, [progress, isHydrated]);

  const addFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.name === product.name)) {
        return prev;
      }
      return [...prev, product];
    });
  }, []);

  const removeFavorite = useCallback((productName: string) => {
    setFavorites((prev) => prev.filter((p) => p.name !== productName));
  }, []);

  const isFavorite = useCallback(
    (productName: string) => {
      return favorites.some((p) => p.name === productName);
    },
    [favorites]
  );

  const addProgressEntry = useCallback((entry: Omit<ProgressEntry, 'id' | 'date'>) => {
    setProgress((prev) => {
      const newEntry: ProgressEntry = {
        ...entry,
        id: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
      };
      return [newEntry, ...prev];
    });
  }, []);

  const value = {
    favorites,
    progress,
    addFavorite,
    removeFavorite,
    isFavorite,
    addProgressEntry,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
