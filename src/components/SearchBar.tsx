'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchInputs } from '@/types';

interface SearchBarProps {
  onSearch: (inputs: SearchInputs) => void;
  isLoading: boolean;
}

const platformConfig = [
  {
    key: 'tiktok' as const,
    label: 'TikTok',
    placeholder: 'e.g. khaby.lame',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.11v-3.53a6.26 6.26 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.3z" />
      </svg>
    ),
    gradient: 'from-[#00f2ea] to-[#ff0050]',
    ring: 'focus:ring-[#00f2ea]/40',
    iconBg: 'bg-gradient-to-br from-[#00f2ea] to-[#ff0050]',
  },
  {
    key: 'youtube' as const,
    label: 'YouTube',
    placeholder: 'e.g. MrBeast',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    gradient: 'from-[#ff0000] to-[#cc0000]',
    ring: 'focus:ring-red-500/40',
    iconBg: 'bg-gradient-to-br from-[#ff0000] to-[#cc0000]',
  },
  {
    key: 'instagram' as const,
    label: 'Instagram',
    placeholder: 'e.g. instagram',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    gradient: 'from-[#f09433] via-[#e6683c] to-[#dc2743]',
    ring: 'focus:ring-pink-500/40',
    iconBg: 'bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]',
  },
];

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [inputs, setInputs] = useState<SearchInputs>({
    tiktok: '',
    youtube: '',
    instagram: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.tiktok && !inputs.youtube && !inputs.instagram) return;
    onSearch(inputs);
  };

  const hasInput = inputs.tiktok || inputs.youtube || inputs.instagram;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="glass-card rounded-2xl p-6 md:p-8 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platformConfig.map((platform) => (
            <div key={platform.key} className="relative group">
              <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
                <span className={`${platform.iconBg} p-1.5 rounded-lg text-white`}>
                  {platform.icon}
                </span>
                {platform.label}
              </label>
              <input
                type="text"
                value={inputs[platform.key]}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, [platform.key]: e.target.value }))
                }
                placeholder={platform.placeholder}
                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 
                  focus:outline-none focus:ring-2 ${platform.ring} focus:border-transparent
                  transition-all duration-300 hover:bg-white/8`}
                id={`input-${platform.key}`}
              />
            </div>
          ))}
        </div>

        <motion.button
          type="submit"
          disabled={isLoading || !hasInput}
          className={`w-full py-3.5 rounded-xl font-semibold text-white text-base
            transition-all duration-300 relative overflow-hidden
            ${hasInput
              ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/25 cursor-pointer'
              : 'bg-white/10 cursor-not-allowed opacity-50'
            }`}
          whileHover={hasInput ? { scale: 1.01 } : {}}
          whileTap={hasInput ? { scale: 0.99 } : {}}
          id="btn-search"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Fetching Data...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Analyze Views
            </span>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
