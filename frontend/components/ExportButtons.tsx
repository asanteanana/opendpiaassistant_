/**
 * Export Buttons Component
 * Provides PDF and JSON export functionality
 */
'use client';

import { motion } from 'motion/react';
import { FileDown, FileJson, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { assessmentApi } from '@/utils/api';
import { downloadFile } from '@/utils/helpers';

interface ExportButtonsProps {
    assessmentId: string;
    onExport?: (format: 'pdf' | 'json') => void;
    className?: string;
}

export function ExportButtons({
    assessmentId,
    onExport,
    className = '',
}: ExportButtonsProps) {
    const [loading, setLoading] = useState<'pdf' | 'json' | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async (format: 'pdf' | 'json') => {
        try {
            setLoading(format);
            setError(null);

            const response =
                format === 'pdf'
                    ? await assessmentApi.exportPDF(assessmentId)
                    : await assessmentApi.exportJSON(assessmentId);

            const blob = response.data;
            const filename = `dpia_assessment_${assessmentId}_${new Date().toISOString().split('T')[0]}.${format}`;

            downloadFile(blob, filename);

            if (onExport) {
                onExport(format);
            }
        } catch (err) {
            console.error(`Failed to export as ${format}:`, err);
            setError(`Failed to export as ${format.toUpperCase()}. Please try again.`);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex flex-wrap items-center gap-3">
                {/* PDF Export Button */}
                <motion.button
                    onClick={() => handleExport('pdf')}
                    disabled={loading !== null}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading === 'pdf' ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Exporting...
                        </>
                    ) : (
                        <>
                            <FileDown className="h-4 w-4" />
                            Export as PDF
                        </>
                    )}
                </motion.button>

                {/* JSON Export Button */}
                <motion.button
                    onClick={() => handleExport('json')}
                    disabled={loading !== null}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
                >
                    {loading === 'json' ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Exporting...
                        </>
                    ) : (
                        <>
                            <FileJson className="h-4 w-4" />
                            Export as JSON
                        </>
                    )}
                </motion.button>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200"
                >
                    {error}
                </motion.div>
            )}

            {/* Info Text */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Export your assessment for record keeping, compliance, or sharing with stakeholders.
            </p>
        </div>
    );
}

interface QuickExportProps {
    assessmentId: string;
    format: 'pdf' | 'json';
    children?: React.ReactNode;
    className?: string;
}

export function QuickExport({
    assessmentId,
    format,
    children,
    className = '',
}: QuickExportProps) {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        try {
            setLoading(true);

            const response =
                format === 'pdf'
                    ? await assessmentApi.exportPDF(assessmentId)
                    : await assessmentApi.exportJSON(assessmentId);

            const blob = response.data;
            const filename = `dpia_assessment_${assessmentId}_${new Date().toISOString().split('T')[0]}.${format}`;

            downloadFile(blob, filename);
        } catch (err) {
            console.error(`Failed to export as ${format}:`, err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className={`flex items-center gap-2 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : format === 'pdf' ? (
                <FileDown className="h-4 w-4" />
            ) : (
                <FileJson className="h-4 w-4" />
            )}
            {children || `Export ${format.toUpperCase()}`}
        </button>
    );
}

