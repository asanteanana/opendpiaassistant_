/**
 * Risk Badge Component
 * Displays risk level with color-coded badge
 */
'use client';

import { motion } from 'motion/react';
import type { RiskLevel } from '@/utils/types';
import { getRiskBadgeProps } from '@/utils/helpers';

interface RiskBadgeProps {
    level?: RiskLevel;
    score?: number;
    size?: 'sm' | 'md' | 'lg';
    showScore?: boolean;
    className?: string;
}

export function RiskBadge({
    level = 'low',
    score,
    size = 'md',
    showScore = false,
    className = '',
}: RiskBadgeProps) {
    const { bg, text, border } = getRiskBadgeProps(level);

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
            className={`inline-flex items-center gap-2 rounded-full border font-medium ${bg} ${text} ${border} ${sizeClasses[size]} ${className}`}
        >
            <span className="capitalize">{level}</span>
            {showScore && score !== undefined && (
                <>
                    <span className="opacity-50">•</span>
                    <span className="tabular-nums">{score.toFixed(2)}</span>
                </>
            )}
        </motion.div>
    );
}

interface RiskIndicatorProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
}

export function RiskIndicator({ score, size = 'md' }: RiskIndicatorProps) {
    const getRiskLevel = (s: number): RiskLevel => {
        if (s < 0.3) return 'low';
        if (s < 0.6) return 'medium';
        if (s < 0.8) return 'high';
        return 'critical';
    };

    const level = getRiskLevel(score);
    const { text } = getRiskBadgeProps(level);

    const sizeClasses = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
    };

    return (
        <div className="space-y-2">
            <div className={`relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 ${sizeClasses[size]}`}>
                <motion.div
                    className={`h-full ${text.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score * 100}%` }}
                    transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
                />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Risk Score</span>
                <span className="font-medium tabular-nums">{score.toFixed(2)}</span>
            </div>
        </div>
    );
}

