'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email(),
  age: z.coerce.number().min(0, { message: 'Age cannot be negative.' }).optional().nullable(),
  profilePictureUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = getAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      age: null,
      profilePictureUrl: null,
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (user && firestore) {
      const fetchUserData = async () => {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          form.reset({
            fullName: userData.fullName || user.displayName || '',
            email: userData.email || user.email || '',
            age: userData.age || null,
            profilePictureUrl: userData.profilePictureUrl || user.photoURL || null,
          });
        } else {
            form.reset({
                fullName: user.displayName || '',
                email: user.email || '',
                age: null,
                profilePictureUrl: user.photoURL || null,
            });
        }
      };
      fetchUserData();
    }
  }, [user, firestore, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !firestore) return;
    setIsLoading(true);
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      
      // Update Firestore
      await setDoc(userDocRef, {
          id: user.uid,
          fullName: data.fullName,
          email: data.email,
          age: data.age,
          profilePictureUrl: data.profilePictureUrl,
      }, { merge: true });

      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: data.fullName,
          photoURL: data.profilePictureUrl,
        });
      }

      toast({ title: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Update failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
    const getInitials = (name?: string | null) => {
        if (!name) return 'U';
        const names = name.split(' ');
        if (names.length > 1) {
        return names[0][0] + names[names.length - 1][0];
        }
        return name.substring(0, 2);
    };

  if (isUserLoading || !user) {
    return (
      <AppLayout>
        <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Settings
          </h1>
        </div>
        <p className="text-muted-foreground">Manage your account settings.</p>
        
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={form.watch('profilePictureUrl') || undefined} />
                                <AvatarFallback>{getInitials(form.watch('fullName'))}</AvatarFallback>
                            </Avatar>
                            <FormField
                                control={form.control}
                                name="profilePictureUrl"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <FormLabel>Profile Picture URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/image.png" {...field} value={field.value || ''}/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your email" {...field} readOnly disabled />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Your age" {...field} value={field.value || ''}/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                           {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
