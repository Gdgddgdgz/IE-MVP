'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRouter() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const lsUser = localStorage.getItem('dgcare_user');
    if (!lsUser) {
      router.push('/login');
    } else {
      const user = JSON.parse(lsUser);
      if (user.role === 'family') {
        router.replace('/dashboard/family');
      } else {
        router.replace('/dashboard/caregiver');
      }
    }
  }, [router]);

  if (!mounted) return <div className="min-h-screen flex items-center justify-center text-primary font-bold text-xl animate-pulse">Initializing...</div>;
  return <div className="min-h-screen flex items-center justify-center text-primary font-bold text-xl animate-pulse">Redirecting...</div>;
}
