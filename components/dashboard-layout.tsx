'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  LogOut,
  Users,
  Lock,
  Heart,
  Shield,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: any;
  onValentineClick?: () => void;
}

export function DashboardLayout({
  children,
  user,
  onValentineClick,
}: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Logout failed');
      console.error(error);
    }
  };

  const navigationItems = [
    { label: 'Users', icon: Users, href: '#users' },
    { label: 'Audit Logs', icon: BarChart3, href: '#audit-logs' },
    { label: 'Security', icon: Lock, href: '#security' },
  ];

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-800 text-white transition-all duration-300 flex flex-col border-r border-slate-700 fixed md:relative h-full z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 md:p-6 flex items-center justify-between">
          <div className={sidebarOpen ? 'block' : 'hidden'}>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="font-bold">IAM</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-slate-700"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 px-2 md:px-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                const element = document.querySelector(item.href);
                element?.scrollIntoView({ behavior: 'smooth' });
                // Close sidebar on mobile after navigation
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 md:p-4 space-y-2 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-pink-300 hover:bg-pink-900/20"
            onClick={onValentineClick}
          >
            <Heart className="w-5 h-5 mr-2" />
            {sidebarOpen && <span>Valentine</span>}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:bg-red-900/20"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        <header className="bg-slate-800 border-b border-slate-700 p-4 md:p-6 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Identity & Access Management
              </h1>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                Welcome, {user?.name || 'User'}
              </p>
            </div>
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden hover:bg-slate-700"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
