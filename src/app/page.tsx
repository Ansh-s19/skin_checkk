import AppLayout from '@/components/app-layout';
import { DashboardClient } from '@/components/dashboard-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground">
          Upload a photo of your skin to get a personalized analysis and
          product recommendations.
        </p>
        <DashboardClient />
      </div>
    </AppLayout>
  );
}
