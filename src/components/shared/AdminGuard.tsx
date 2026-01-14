"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, type User } from '@/services/auth';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.replace('/admin/login');
        return;
      }

      if (currentUser.role !== 'admin') {
        router.replace('/admin/login');
        return;
      }

      setUser(currentUser);
      setIsLoading(false);
    }

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#215388]" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
