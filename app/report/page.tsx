/**
 * Report Page
 * Displays DPIA assessment results and risk analysis
 */
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import {
    Home,
    Loader2,
    AlertTriangle,
    CheckCircle,
    Shield,
    TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { assessmentApi } from '@/utils/api';
import type { Assessment, RiskSummary } from '@/utils/types';
import { RiskBadge } from '@/components/RiskBadge';
import { MitigationList } from '@/components/MitigationList';
import { ExportButtons } from '@/components/ExportButtons';
import { formatDate, formatStatus, getStatusColor } from '@/utils/helpers';
import { SkeletonReport } from '@/components/ui/skeleton';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

function ReportContent() {
    const searchParams = useSearchParams();
    const assessmentId = searchParams.get('id');

    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [riskSummary, setRiskSummary] = useState<RiskSummary | null>(null);
    const [loading, setLoading] = useState(true);

    // Keyboard shortcuts
    useKeyboardShortcuts({
        shortcuts: [
            {
                key: 'e',
                ctrlKey: true,
                action: () => {
                    // Trigger export
                    const event = new CustomEvent('exportAssessment');
                    window.dispatchEvent(event);
                },
                description: 'Export Assessment',
            },
        ],
    });

    useEffect(() => {
        if (assessmentId) {
            loadData();
        }
    }, [assessmentId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [assessmentRes, riskRes] = await Promise.all([
                assessmentApi.get(assessmentId!),
                assessmentApi.getRiskSummary(assessmentId!),
            ]);

            setAssessment(assessmentRes.data);
            setRiskSummary(riskRes.data);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/assessments"
                                    className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <Home className="h-5 w-5" />
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        DPIA Report
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Loading...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <SkeletonReport />
                </main>
            </div>
        );
    }

    if (!assessment || !riskSummary) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">Assessment not found</p>
                    <Link
                        href="/assessments"
                        className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const allMitigations =
        assessment.responses?.flatMap((r) => r.mitigations || []) || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/assessments"
                                className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <Home className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    DPIA Report
                                </h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    {assessment.title}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/assessment?id=${assessmentId}`}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
                            >
                                Edit Assessment
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Risk Overview */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Risk Assessment
                                </h2>
                                <RiskBadge
                                    level={riskSummary.overall_risk_level}
                                    score={riskSummary.overall_risk_score}
                                    showScore
                                    size="lg"
                                />
                            </div>

                            <div className="mb-6 grid grid-cols-3 gap-4">
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Shield className="h-4 w-4" />
                                        Status
                                    </div>
                                    <div className="mt-2">
                                        <span
                                            className={`inline-block rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(assessment.status)}`}
                                        >
                                            {formatStatus(assessment.status)}
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <TrendingUp className="h-4 w-4" />
                                        Risk Score
                                    </div>
                                    <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {riskSummary.overall_risk_score.toFixed(2)}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <AlertTriangle className="h-4 w-4" />
                                        High Risk Areas
                                    </div>
                                    <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {riskSummary.high_risk_areas.length}
                                    </div>
                                </div>
                            </div>

                            {/* Category Breakdown */}
                            {Object.keys(riskSummary.category_scores).length > 0 && (
                                <div>
                                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
                                        Risk by Category
                                    </h3>
                                    <div className="space-y-3">
                                        {Object.entries(riskSummary.category_scores).map(
                                            ([category, score]) => {
                                                const getRiskLevel = (s: number) => {
                                                    if (s < 0.3) return 'low';
                                                    if (s < 0.6) return 'medium';
                                                    if (s < 0.8) return 'high';
                                                    return 'critical';
                                                };

                                                const level = getRiskLevel(score);
                                                const isHighRisk = riskSummary.high_risk_areas.includes(category);

                                                return (
                                                    <div key={category}>
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium capitalize text-gray-900 dark:text-gray-100">
                                                                    {category.replace(/-/g, ' ')}
                                                                </span>
                                                                {isHighRisk && (
                                                                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                                                                )}
                                                            </div>
                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                {score.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                                            <motion.div
                                                                className={`h-full ${level === 'low' ? 'bg-green-600' : level === 'medium' ? 'bg-amber-600' : level === 'high' ? 'bg-orange-600' : 'bg-red-600'}`}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${score * 100}%` }}
                                                                transition={{ duration: 0.5, delay: 0.1 }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.section>

                        {/* Recommendations */}
                        {riskSummary.recommendations.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                            >
                                <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Recommendations
                                </h2>
                                <div className="space-y-4">
                                    {riskSummary.recommendations.map((recommendation, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30"
                                        >
                                            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                                            <p className="text-sm text-amber-900 dark:text-amber-100">
                                                {recommendation}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Mitigations */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <MitigationList mitigations={allMitigations} />
                        </motion.section>

                        {/* Detailed Responses */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >
                            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">
                                Detailed Responses
                            </h2>
                            <div className="space-y-6">
                                {assessment.responses?.map((response, index) => (
                                    <div
                                        key={response.id}
                                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <div className="mb-2 flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {response.question_id}
                                                </h4>
                                                {response.category && (
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        {response.category.replace(/-/g, ' ')}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Risk:{' '}
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {response.risk_score.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            <strong>Answer:</strong>{' '}
                                            {JSON.stringify(response.answer, null, 2)}
                                        </div>
                                        {response.notes && (
                                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                <strong>Notes:</strong> {response.notes}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Assessment Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
                        >
                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
                                Assessment Details
                            </h3>
                            <dl className="space-y-3 text-sm">
                                <div>
                                    <dt className="text-gray-600 dark:text-gray-400">Organization</dt>
                                    <dd className="font-medium text-gray-900 dark:text-gray-100">
                                        {assessment.organization}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-gray-600 dark:text-gray-400">Created</dt>
                                    <dd className="text-gray-900 dark:text-gray-100">
                                        {formatDate(assessment.created_at)}
                                    </dd>
                                </div>
                                {assessment.updated_at && (
                                    <div>
                                        <dt className="text-gray-600 dark:text-gray-400">Last Updated</dt>
                                        <dd className="text-gray-900 dark:text-gray-100">
                                            {formatDate(assessment.updated_at)}
                                        </dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-gray-600 dark:text-gray-400">Responses</dt>
                                    <dd className="text-gray-900 dark:text-gray-100">
                                        {assessment.responses?.length || 0}
                                    </dd>
                                </div>
                            </dl>
                        </motion.div>

                        {/* Export */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
                        >
                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
                                Export Report
                            </h3>
                            <ExportButtons assessmentId={assessmentId!} />
                        </motion.div>

                        {/* Completion Status */}
                        {assessment.status === 'completed' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950/30"
                            >
                                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                                    <CheckCircle className="h-5 w-5" />
                                    <h3 className="font-semibold">Assessment Complete</h3>
                                </div>
                                <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                                    This DPIA assessment has been completed and is ready for review.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ReportPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <ReportContent />
        </Suspense>
    );
}

