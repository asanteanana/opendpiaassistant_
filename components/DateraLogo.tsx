/**
 * Datera Logo Component
 * Shield with checkmark icon + Datera text
 */
'use client';

import { motion } from 'motion/react';

interface DateraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: {
    icon: 'h-6 w-6',
    text: 'text-lg',
    gap: 'gap-2',
  },
  md: {
    icon: 'h-8 w-8',
    text: 'text-xl',
    gap: 'gap-3',
  },
  lg: {
    icon: 'h-10 w-10',
    text: 'text-2xl',
    gap: 'gap-4',
  },
  xl: {
    icon: 'h-12 w-12',
    text: 'text-3xl',
    gap: 'gap-4',
  },
};

export function DateraLogo({ 
  size = 'md', 
  showText = true, 
  className = '',
  animated = false 
}: DateraLogoProps) {
  const { icon, text, gap } = sizeClasses[size];

  const ShieldIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${icon} text-gray-900 dark:text-gray-100`}
    >
      {/* Shield outline */}
      <path
        d="M12 2L4 6V12C4 16.55 6.84 20.74 12 22C17.16 20.74 20 16.55 20 12V6L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Checkmark */}
      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const LogoContent = () => (
    <div className={`flex items-center ${gap}`}>
      {animated ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <ShieldIcon />
        </motion.div>
      ) : (
        <ShieldIcon />
      )}
      
      {showText && (
        <span className={`font-semibold text-gray-900 dark:text-gray-100 ${text}`}>
          Datera
        </span>
      )}
    </div>
  );

  return (
    <div className={`inline-flex items-center ${className}`}>
      {animated ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <LogoContent />
        </motion.div>
      ) : (
        <LogoContent />
      )}
    </div>
  );
}

// Variant for header use
export function DateraLogoHeader() {
  return (
    <DateraLogo 
      size="md" 
      showText={true} 
      className="hover:opacity-80 transition-opacity duration-200"
      animated={false}
    />
  );
}

// Variant for footer use
export function DateraLogoFooter() {
  return (
    <DateraLogo 
      size="sm" 
      showText={true} 
      className="opacity-60 hover:opacity-80 transition-opacity duration-200"
      animated={false}
    />
  );
}

// Icon-only variant
export function DateraLogoIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <DateraLogo 
      size={size} 
      showText={false} 
      animated={false}
    />
  );
}
