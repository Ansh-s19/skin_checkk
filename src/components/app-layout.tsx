'use client';

import {
  Heart,
  History,
  LayoutDashboard,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/progress',
      label: 'Progress',
      icon: History,
    },
    {
      href: '/favorites',
      label: 'Favorites',
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen w-full flex">
      <aside className="hidden md:flex flex-col w-64 bg-primary text-primary-foreground border-r border-primary/20">
        <div className="p-4 border-b border-primary/20">
          <Logo />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-primary/20'
              )}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between p-4 border-b">
           <Logo className="text-primary-foreground" />
          <nav className="flex gap-2">
             {navItems.map((item) => (
               <Button key={item.href} asChild variant="ghost" size="icon" className={cn(pathname === item.href && "bg-accent text-accent-foreground")}>
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
               </Button>
             ))}
          </nav>
        </header>
        <main className="flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
}
