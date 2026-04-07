'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { formatViews } from '@/lib/format';

interface AnimatedCounterProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function AnimatedCounter({ value, label, icon, className = '' }: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (isInView) {
      const duration = 1.5;
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;

      const tick = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * value);
        setDisplayValue(formatViews(current));

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          setDisplayValue(formatViews(value));
        }
      };

      requestAnimationFrame(tick);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {icon && <span className="text-xl opacity-70">{icon}</span>}
      <div>
        <div className="text-2xl font-bold tracking-tight">{displayValue}</div>
        <div className="text-xs uppercase tracking-wider opacity-50">{label}</div>
      </div>
    </motion.div>
  );
}
