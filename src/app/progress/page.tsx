'use client';

import AppLayout from '@/components/app-layout';
import { useApp } from '@/hooks/use-app';
import { History } from 'lucide-react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProgressPage() {
  const { progress } = useApp();

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Progress Tracker
          </h1>
        </div>
        <p className="text-muted-foreground">
          See how your skin has evolved. Each analysis is saved here.
        </p>
        {progress.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {progress.map((entry) => (
              <Card key={entry.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Analysis from {entry.date}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-square relative w-full rounded-md overflow-hidden">
                    <Image
                      src={entry.photoDataUri}
                      alt={`Skin analysis from ${entry.date}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Skin Type:</h4>
                    <Badge variant="outline">{entry.analysis.skinType}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Concerns:</h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.analysis.concerns.map((concern) => (
                        <Badge key={concern} variant="secondary">
                          {concern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-96 text-muted-foreground">
            <History size={48} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2 font-headline">No History Yet</h3>
            <p>
              Your first skin analysis will automatically be saved here to
              start your journey.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
