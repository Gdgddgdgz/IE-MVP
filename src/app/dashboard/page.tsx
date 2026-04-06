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

  if (!mounted) return <div style={{ padding: '40px', color: 'var(--primary-green)' }}>Initializing...</div>;
  return <div style={{ padding: '40px', color: 'var(--primary-green)' }}>Redirecting...</div>;
}
