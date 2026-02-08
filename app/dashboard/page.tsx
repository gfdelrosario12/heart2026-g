'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { UsersTable } from '@/components/users-table';
import { AuditLogsTable } from '@/components/audit-logs-table';
import { CIATriadPanel } from '@/components/cia-triad-panel';
import { ValentineModal } from '@/components/valentine-modal';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showValentine, setShowValentine] = useState(false);

  useEffect(() => {
    document.title = 'Dashboard | Heart 2026';
    
    // Check if user is authenticated by trying to fetch user data
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.status === 401) {
          router.push('/login');
          return;
        }

        // Get user info from localStorage or session
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user} onValentineClick={() => setShowValentine(true)}>
      <div className="space-y-6">
        <CIATriadPanel />
        <UsersTable />
        <AuditLogsTable />
      </div>
      {showValentine && <ValentineModal onClose={() => setShowValentine(false)} />}
    </DashboardLayout>
  );
}
