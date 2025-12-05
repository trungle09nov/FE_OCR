'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(ROUTES.DASHBOARD);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">Redirecting to dashboard...</p>
      </main>
    </div>
  );
}
