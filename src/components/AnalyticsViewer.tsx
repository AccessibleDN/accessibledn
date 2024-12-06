'use client';

import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FaFolder, FaChartBar, FaFileAlt, FaCloudUploadAlt, FaDownload, FaServer } from 'react-icons/fa';
import NavLink from './NavLink';

interface AnalyticsData {
  totalFiles: number;
  totalSize: number;
  fileTypes: Record<string, number>;
  uploadStats: {
    lastHour: number;
    lastDay: number; 
    lastWeek: number;
  };
  downloadStats: {
    lastHour: number;
    lastDay: number;
    lastWeek: number;
  };
  serverMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    uptime: number;
  };
}

const fetchAnalytics = async (): Promise<AnalyticsData> => {
  const response = await fetch('/api/filesystem/analytics');
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch analytics');
  }

  return data.data;
};

const formatSize = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2
  }).format(size);

  return `${formattedNumber} ${units[unitIndex]}`;
};

const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};

const LoadingCard = React.memo(() => {
  const shimmerClass = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";
  
  return (
    <div className={`relative overflow-hidden bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 ${shimmerClass}`}>
      <div className="h-7 w-32 bg-white/20 rounded-lg mb-3"></div>
      <div className="h-5 w-24 bg-white/20 rounded-lg"></div>
    </div>
  );
});

const MetricCard = React.memo(({ title, value, icon: Icon, subtitle }: { title: string; value: React.ReactNode; icon?: React.ElementType; subtitle?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    whileHover={{ 
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.15)",
      transition: { type: "spring", stiffness: 400, damping: 25 }
    }}
    className="relative overflow-hidden bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl"
  >
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-3">
        {Icon && <Icon className="w-6 h-6 text-indigo-400" />}
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-100 bg-clip-text text-transparent"
        >
          {title}
        </motion.h3>
      </div>
      <motion.p 
        className="text-5xl font-extrabold text-white tracking-tight"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          delay: 0.3,
          duration: 0.8
        }}
      >
        {value}
      </motion.p>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-sm text-indigo-300"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
    <motion.div 
      className="absolute top-0 right-0 -mt-4 -mr-4 w-48 h-48 bg-indigo-600/20 rounded-full blur-[100px]"
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.6, 0.4]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </motion.div>
));

const FileTypeCard = React.memo(({ type, count }: { type: string; count: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10"
  >
    <div className="flex items-center justify-between">
      <span className="text-lg font-medium text-white">{type}</span>
      <span className="text-sm text-indigo-300">{count} files</span>
    </div>
  </motion.div>
));

const StatCard = React.memo(({ title, stats }: { title: string; stats: { lastHour: number; lastDay: number; lastWeek: number } }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
  >
    <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-400">Last Hour</span>
        <span className="text-white font-medium">{stats.lastHour.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Last 24 Hours</span>
        <span className="text-white font-medium">{stats.lastDay.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Last Week</span>
        <span className="text-white font-medium">{stats.lastWeek.toLocaleString()}</span>
      </div>
    </div>
  </motion.div>
));

const AnalyticsViewer: React.FC = () => {
  const { data: analytics, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-red-400 p-6 rounded-2xl bg-red-900/20 backdrop-blur-lg border border-red-800"
      >
        {error instanceof Error ? error.message : 'An error occurred'}
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: i * 0.1 }}
            >
              <LoadingCard />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="p-6 backdrop-blur-sm min-h-screen flex gap-6">
      <motion.aside 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-72 bg-white/10 p-5 rounded-2xl shadow-xl"
      >
        <nav className="space-y-2.5">
          <NavLink href="/filesystem" icon={FaFolder}>Files</NavLink>
          <NavLink href="/analytics" icon={FaChartBar}>Analytics</NavLink>
        </nav>
      </motion.aside>
      <main className="flex-1 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl sm:text-5xl font-bold tracking-tight text-white"
              >
                Analytics
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-400"
              >
                Monitor your CDN performance and resource usage
              </motion.p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard 
                title="Total Files" 
                value={`${analytics?.totalFiles.toLocaleString() || '0'} files`}
                icon={FaFileAlt}
              />
              <MetricCard 
                title="Storage Used" 
                value={analytics ? formatSize(analytics.totalSize) : '0 B'}
                icon={FaFolder}
              />
              <MetricCard
                title="Server Uptime"
                value={analytics ? formatUptime(analytics.serverMetrics.uptime) : '0m'}
                icon={FaServer}
                subtitle={`CPU: ${analytics?.serverMetrics.cpuUsage.toFixed(1)}% | RAM: ${analytics?.serverMetrics.memoryUsage.toFixed(1)}%`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard 
                title="Upload Statistics" 
                stats={analytics?.uploadStats || { lastHour: 0, lastDay: 0, lastWeek: 0 }} 
              />
              <StatCard 
                title="Download Statistics" 
                stats={analytics?.downloadStats || { lastHour: 0, lastDay: 0, lastWeek: 0 }} 
              />
            </div>

            {analytics?.fileTypes && Object.keys(analytics.fileTypes).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-white">File Types</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(analytics.fileTypes)
                    .sort(([, a], [, b]) => b - a)
                    .map(([type, count]) => (
                      <FileTypeCard key={type} type={type} count={count} />
                    ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AnalyticsViewer;
