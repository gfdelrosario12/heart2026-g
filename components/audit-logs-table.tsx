'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ActivityIcon as ActivityLog } from 'lucide-react';
import relationshipLogs from '@/data/relationship-logs.json';

interface AuditLog {
  id: string;
  action: string;
  details: string;
  created_at: string;
}

export function AuditLogsTable() {
  const logs = relationshipLogs.logs as AuditLog[];

  const getActionColor = (action: string) => {
    switch (action) {
      case 'FIRST_SIGHT':
      case 'CAPTURED_HEART':
        return 'text-pink-400';
      case 'THINKING_OF_YOU':
      case 'DREAM_OF_YOU':
        return 'text-purple-400';
      case 'LOVE_GROWS':
      case 'FALLING_DEEPER':
        return 'text-rose-400';
      case 'MISSING_YOU':
        return 'text-blue-400';
      case 'LUCKY_DAY':
      case 'PERFECT_MATCH':
        return 'text-green-400';
      case 'FOREVER_YOURS':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <Card
      id="audit-logs"
      className="bg-slate-800 border-slate-700"
    >
      <div className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ActivityLog className="w-5 h-5" />
          Audit Logs
        </h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 mb-1">
                <span className={`font-mono font-semibold text-xs md:text-sm ${getActionColor(log.action)}`}>
                  {log.action}
                </span>
                <span className="text-slate-400 text-xs">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-slate-300 text-xs md:text-sm">{log.details}</p>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No audit logs found
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
