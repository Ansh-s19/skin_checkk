'use client';

import {
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useUser } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = getAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged out successfully.' });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: 'Logout failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

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
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };

  return (
    <div className="min-h-screen w-full flex">
      <aside className="hidden md:flex flex-col w-64 bg-card text-card-foreground border-r">
        <div className="p-4 border-b flex justify-between items-center">
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
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t">
          {isUserLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="flex items-center gap-2 text-left">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm font-medium">
                    {user.displayName || user.email}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-2" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/settings">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button asChild className="flex-1" variant="outline">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
           <Logo />
          <nav className="flex gap-2 items-center">
             {navItems.map((item) => (
               <Button key={item.href} asChild variant="ghost" size="icon" className={cn(pathname === item.href && "bg-primary text-primary-foreground")}>
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
               </Button>
             ))}
             {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/settings">
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                    </Link>
                     <DropdownMenuItem onClick={handleLogout}>
                       <LogOut className="mr-2 h-4 w-4" />
                       <span>Log out</span>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
             )}
          </nav>
        </header>
        <main className="flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
}
