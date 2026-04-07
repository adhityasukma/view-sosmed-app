'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import PlatformCard from '@/components/PlatformCard';
import { SearchInputs, PlatformData, ApiResponse } from '@/types';

interface PlatformResult {
  data: PlatformData;
  isDemo: boolean;
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="skeleton w-14 h-14 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-32" />
            <div className="skeleton h-3 w-24" />
          </div>
        </div>
        <div className="flex gap-6">
          <div className="skeleton h-12 w-28" />
          <div className="skeleton h-12 w-28" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <div className="skeleton w-12 h-12 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [results, setResults] = useState<Record<string, PlatformResult>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (inputs: SearchInputs) => {
    setIsLoading(true);
    setErrors([]);
    setHasSearched(true);

    const newResults: Record<string, PlatformResult> = {};
    const newErrors: string[] = [];

    const fetchPromises: Promise<void>[] = [];

    if (inputs.tiktok) {
      fetchPromises.push(
        fetch(`/api/tiktok?username=${encodeURIComponent(inputs.tiktok)}`)
          .then((res) => res.json())
          .then((res: ApiResponse) => {
            if (res.success && res.data) {
              newResults.tiktok = { data: res.data, isDemo: res.isDemo || false };
            } else {
              newErrors.push(`TikTok: ${res.error || 'Unknown error'}`);
            }
          })
          .catch((err) => newErrors.push(`TikTok: ${err.message}`))
      );
    }

    if (inputs.youtube) {
      fetchPromises.push(
        fetch(`/api/youtube?channel=${encodeURIComponent(inputs.youtube)}`)
          .then((res) => res.json())
          .then((res: ApiResponse) => {
            if (res.success && res.data) {
              newResults.youtube = { data: res.data, isDemo: res.isDemo || false };
            } else {
              newErrors.push(`YouTube: ${res.error || 'Unknown error'}`);
            }
          })
          .catch((err) => newErrors.push(`YouTube: ${err.message}`))
      );
    }

    if (inputs.instagram) {
      fetchPromises.push(
        fetch(`/api/instagram?username=${encodeURIComponent(inputs.instagram)}`)
          .then((res) => res.json())
          .then((res: ApiResponse) => {
            if (res.success && res.data) {
              newResults.instagram = { data: res.data, isDemo: res.isDemo || false };
            } else {
              newErrors.push(`Instagram: ${res.error || 'Unknown error'}`);
            }
          })
          .catch((err) => newErrors.push(`Instagram: ${err.message}`))
      );
    }

    await Promise.all(fetchPromises);

    setResults(newResults);
    setErrors(newErrors);
    setIsLoading(false);
  }, []);

  const resultCount = Object.keys(results).length;

  return (
    <main className="flex-1 px-4 py-8 md:py-12">
      {/* Hero Header */}
      <motion.div
        className="text-center max-w-3xl mx-auto mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Real-time Analytics
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Social Media
          </span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Views Dashboard
          </span>
        </h1>
        
        <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto">
          Analyze views from TikTok, YouTube & Instagram in one place.
          Enter any username to get started.
        </p>
      </motion.div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {/* Error Messages */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            className="max-w-4xl mx-auto mt-4 space-y-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {errors.map((error, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {!isLoading && resultCount > 0 && (
          <motion.div
            className="max-w-7xl mx-auto mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Summary Bar */}
            <motion.div
              className="flex items-center justify-between mb-6 px-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-white/40">
                Showing data for <span className="text-white/70 font-medium">{resultCount} platform{resultCount > 1 ? 's' : ''}</span>
              </p>
              <div className="flex items-center gap-2 text-xs text-white/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Updated just now
              </div>
            </motion.div>

            <div className={`grid gap-6 ${
              resultCount === 1
                ? 'grid-cols-1 max-w-lg mx-auto'
                : resultCount === 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {Object.entries(results).map(([key, result], index) => (
                <PlatformCard
                  key={key}
                  data={result.data}
                  isDemo={result.isDemo}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isLoading && !hasSearched && (
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-6xl mb-4">📊</div>
          <p className="text-white/30 text-sm">Enter a username above to analyze views</p>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="text-center mt-16 pb-8">
        <p className="text-xs text-white/20">
          Social Media Views Dashboard • Powered by RapidAPI
        </p>
      </footer>
    </main>
  );
}
