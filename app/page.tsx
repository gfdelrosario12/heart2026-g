'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    document.title = 'Heart 2026';
    router.push('/login');
  }, [router]);

  return null;
}
