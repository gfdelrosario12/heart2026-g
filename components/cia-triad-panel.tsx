'use client';

import React from "react"

import { Card } from '@/components/ui/card';
import { Shield, Eye, Link as LinkIcon, Lock } from 'lucide-react';

interface TriadItem {
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

export function CIATriadPanel() {
  const triadItems: TriadItem[] = [
    {
      title: 'Confidentiality',
      icon: <Lock className="w-6 h-6" />,
      description:
        'Ensuring data access is restricted to authorized users only. Encryption and access controls protect sensitive information.',
      color: 'bg-blue-900/20 border-blue-700',
    },
    {
      title: 'Integrity',
      icon: <Shield className="w-6 h-6" />,
      description:
        'Maintaining accuracy and completeness of data. Changes are tracked and verified to prevent unauthorized modification.',
      color: 'bg-green-900/20 border-green-700',
    },
    {
      title: 'Availability',
      icon: <Eye className="w-6 h-6" />,
      description:
        'Ensuring authorized users can access data and services when needed. System uptime and reliability are critical.',
      color: 'bg-purple-900/20 border-purple-700',
    },
  ];

  return (
    <div id="security" className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {triadItems.map((item, index) => (
        <Card
          key={index}
          className={`${item.color} border bg-slate-800 transition-all hover:shadow-lg`}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-blue-400">{item.icon}</div>
              <h3 className="text-lg font-semibold text-white">
                {item.title}
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
