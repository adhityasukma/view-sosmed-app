'use client';

import { motion } from 'framer-motion';
import { PlatformData } from '@/types';
import { formatViews, formatDate, formatNumber } from '@/lib/format';
import AnimatedCounter from './AnimatedCounter';

interface PlatformCardProps {
  data: PlatformData;
  isDemo?: boolean;
  index: number;
}

const platformStyles = {
  tiktok: {
    gradient: 'from-[#00f2ea]/20 to-[#ff0050]/20',
    border: 'border-[#00f2ea]/30',
    accent: 'text-[#00f2ea]',
    accentBg: 'bg-[#00f2ea]',
    badgeBg: 'bg-[#00f2ea]/15 text-[#00f2ea]',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.11v-3.53a6.26 6.26 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.3z" />
      </svg>
    ),
  },
  youtube: {
    gradient: 'from-[#ff0000]/20 to-[#cc0000]/20',
    border: 'border-[#ff0000]/30',
    accent: 'text-[#ff4444]',
    accentBg: 'bg-[#ff0000]',
    badgeBg: 'bg-[#ff0000]/15 text-[#ff4444]',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  instagram: {
    gradient: 'from-[#f09433]/20 via-[#e6683c]/20 to-[#dc2743]/20',
    border: 'border-[#e6683c]/30',
    accent: 'text-[#f09433]',
    accentBg: 'bg-gradient-to-br from-[#f09433] to-[#dc2743]',
    badgeBg: 'bg-[#e6683c]/15 text-[#f09433]',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
};

export default function PlatformCard({ data, isDemo, index }: PlatformCardProps) {
  const style = platformStyles[data.platform];

  return (
    <motion.div
      className={`glass-card rounded-2xl overflow-hidden border ${style.border}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${style.gradient} p-5 border-b border-white/5`}>
        <div className="flex items-center gap-4">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={data.profilePicture}
              alt={data.displayName}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white/20"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${data.username}&size=200&background=333&color=fff`;
              }}
            />
            <span className={`absolute -bottom-1 -right-1 ${style.accentBg} p-1 rounded-full text-white`}>
              {style.icon}
            </span>
          </div>

          {/* Name & Username */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate text-lg">{data.displayName}</h3>
            <p className="text-sm text-white/50">@{data.username}</p>
          </div>

          {/* Demo badge */}
          {isDemo && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
              Demo
            </span>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex gap-6 mt-4">
          <AnimatedCounter value={data.totalViews} label="Total Views" icon="👁️" />
          {data.followers > 0 && (
            <AnimatedCounter value={data.followers} label="Followers" icon="👥" />
          )}
        </div>
      </div>

      {/* Content List */}
      <div className="p-4 space-y-2">
        <h4 className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-3 px-1">
          Recent Content
        </h4>
        {data.contents.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-4">No content found</p>
        ) : (
          data.contents.map((content, i) => (
            <motion.a
              key={content.id}
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.15 + i * 0.05 }}
            >
              {/* Number */}
              <span className="text-sm font-bold text-white/20 w-5 text-center">{i + 1}</span>

              {/* Thumbnail */}
              {content.thumbnail ? (
                <img
                  src={content.thumbnail}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className={`w-12 h-12 rounded-lg flex-shrink-0 bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
                  <span className="text-white/30 text-lg">▶</span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
                  {content.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs font-semibold ${style.accent}`}>
                    {formatViews(content.views)} views
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-xs text-white/30">{formatDate(content.date)}</span>
                </div>
              </div>

              {/* Arrow */}
              <svg className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          ))
        )}
      </div>
    </motion.div>
  );
}
