
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { users } from '@/lib/users';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string, displayName: string) => Promise<any>;
  logout: () => Promise<void>;
  isNewUser: boolean;
  clearNewUserFlag: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  isNewUser: false,
  clearNewUserFlag: () => {},
});

const publicRoutes = ['/login', '/signup'];
const profileSetupRoute = '/signup/profile';

function AuthSkeleton() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (loading) return;

    const isPublicRoute = publicRoutes.includes(pathname);
    const isProfileSetup = pathname === profileSetupRoute;

    if (isNewUser && !isProfileSetup) {
        router.push(profileSetupRoute);
        return;
    }

    if (!user && !isPublicRoute && !isProfileSetup) {
      router.push('/login');
    } else if (user && (isPublicRoute || (isProfileSetup && !isNewUser))) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router, isNewUser]);

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  }

  const signup = async (email: string, pass: string, displayName: string) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName });
      setIsNewUser(true); // Flag that this is a new user
      return userCredential;
  }
  
  const clearNewUserFlag = () => {
    setIsNewUser(false);
  }

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const value = { user, loading, login, signup, logout, isNewUser, clearNewUserFlag };
  
  const isPublicRoute = publicRoutes.includes(pathname) || pathname === profileSetupRoute;

  if (loading && !isPublicRoute) {
    return <AuthSkeleton />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
