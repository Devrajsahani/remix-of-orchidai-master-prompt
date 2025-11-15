"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, TrendingUp } from 'lucide-react';

interface Anomaly {
  id: string;
  timestamp: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  worker?: string;
}

const initialAnomalies: Anomaly[] = [
  {
    id: 'A-001',
    timestamp: '14:32:18',
    type: 'critical',
    title: 'Gas Leak Detected',
    description: 'High CO2 levels in Zone-C, Floor 2',
    worker: 'WRK-3456',
  },
  {
    id: 'A-002',
    timestamp: '14:28:45',
    type: 'warning',
    title: 'No Helmet Detected',
    description: 'PPE violation at Zone-B, Floor 3',
    worker: 'WRK-2847',
  },
  {
    id: 'A-003',
    timestamp: '14:25:12',
    type: 'info',
    title: 'Zone Entry Logged',
    description: 'Worker entered restricted area with proper clearance',
    worker: 'WRK-5621',
  },
  {
    id: 'A-004',
    timestamp: '14:22:33',
    type: 'warning',
    title: 'Elevated Heart Rate',
    description: 'Worker heart rate above 130 BPM',
    worker: 'WRK-2847',
  },
  {
    id: 'A-005',
    timestamp: '14:18:56',
    type: 'info',
    title: 'Break Time Completed',
    description: 'Worker returned to active status',
    worker: 'WRK-1923',
  },
];

const anomalyConfig = {
  critical: {
    icon: AlertCircle,
    bg: 'bg-red-500/10',
    border: 'border-red-500/50',
    text: 'text-red-400',
    iconBg: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/50',
    text: 'text-amber-400',
    iconBg: 'bg-amber-500',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/50',
    text: 'text-blue-400',
    iconBg: 'bg-blue-500',
  },
};

export default function AnomalyFeed({ fullView = false }: { fullView?: boolean }) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>(initialAnomalies);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fullView) {
      const interval = setInterval(() => {
        const newAnomaly: Anomaly = {
          id: `A-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          type: ['critical', 'warning', 'info'][Math.floor(Math.random() * 3)] as 'critical' | 'warning' | 'info',
          title: ['New Alert', 'System Update', 'Status Change'][Math.floor(Math.random() * 3)],
          description: 'Auto-generated event for monitoring',
          worker: `WRK-${Math.floor(Math.random() * 9000) + 1000}`,
        };

        setAnomalies((prev) => [newAnomaly, ...prev].slice(0, 20));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [fullView]);

  useEffect(() => {
    if (scrollRef.current && !fullView) {
      scrollRef.current.scrollTop = 0;
    }
  }, [anomalies, fullView]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-700 bg-slate-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold">Live Anomaly Feed</h3>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-slate-400 font-mono">Real-time</span>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`divide-y divide-slate-700/50 ${fullView ? '' : 'max-h-[600px]'} overflow-y-auto custom-scrollbar`}
        style={{
          scrollBehavior: 'smooth',
        }}
      >
        {anomalies.map((anomaly, index) => {
          const config = anomalyConfig[anomaly.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={anomaly.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`${config.iconBg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`font-semibold ${config.text}`}>{anomaly.title}</h4>
                    <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
                      {anomaly.timestamp}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 mb-2">{anomaly.description}</p>

                  {anomaly.worker && (
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${config.bg} border ${config.border} text-xs font-mono`}>
                      <span className={config.text}>{anomaly.worker}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}
