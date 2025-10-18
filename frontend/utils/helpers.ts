/**
 * Helper utility functions
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import type { RiskLevel } from './types';

/**
 * Merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return format(dateObj, 'MMM d, yyyy');
    } catch {
        return 'Invalid date';
    }
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return format(dateObj, 'MMM d, yyyy h:mm a');
    } catch {
        return 'Invalid date';
    }
}

/**
 * Get risk level color
 */
export function getRiskColor(level?: RiskLevel): string {
    switch (level) {
        case 'low':
            return 'text-risk-low bg-risk-low/10 border-risk-low/20';
        case 'medium':
            return 'text-risk-medium bg-risk-medium/10 border-risk-medium/20';
        case 'high':
            return 'text-risk-high bg-risk-high/10 border-risk-high/20';
        case 'critical':
            return 'text-risk-critical bg-risk-critical/10 border-risk-critical/20';
        default:
            return 'text-gray-500 bg-gray-100 border-gray-200';
    }
}

/**
 * Get risk level text color
 */
export function getRiskTextColor(level?: RiskLevel): string {
    switch (level) {
        case 'low':
            return 'text-risk-low';
        case 'medium':
            return 'text-risk-medium';
        case 'high':
            return 'text-risk-high';
        case 'critical':
            return 'text-risk-critical';
        default:
            return 'text-gray-500';
    }
}

/**
 * Get status color
 */
export function getStatusColor(status: string): string {
    switch (status) {
        case 'draft':
            return 'text-gray-600 bg-gray-100 border-gray-200';
        case 'in_progress':
            return 'text-blue-600 bg-blue-100 border-blue-200';
        case 'completed':
            return 'text-green-600 bg-green-100 border-green-200';
        default:
            return 'text-gray-500 bg-gray-100 border-gray-200';
    }
}

/**
 * Format status text
 */
export function formatStatus(status: string): string {
    return status
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(
    totalQuestions: number,
    answeredQuestions: number
): number {
    if (totalQuestions === 0) return 0;
    return Math.round((answeredQuestions / totalQuestions) * 100);
}

/**
 * Download file from blob
 */
export function downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get risk level badge props
 */
export function getRiskBadgeProps(level?: RiskLevel) {
    const colors = {
        low: {
            bg: 'bg-emerald-50 dark:bg-emerald-950',
            text: 'text-emerald-700 dark:text-emerald-400',
            border: 'border-emerald-200 dark:border-emerald-800',
        },
        medium: {
            bg: 'bg-amber-50 dark:bg-amber-950',
            text: 'text-amber-700 dark:text-amber-400',
            border: 'border-amber-200 dark:border-amber-800',
        },
        high: {
            bg: 'bg-orange-50 dark:bg-orange-950',
            text: 'text-orange-700 dark:text-orange-400',
            border: 'border-orange-200 dark:border-orange-800',
        },
        critical: {
            bg: 'bg-red-50 dark:bg-red-950',
            text: 'text-red-700 dark:text-red-400',
            border: 'border-red-200 dark:border-red-800',
        },
    };

    return colors[level || 'low'];
}

