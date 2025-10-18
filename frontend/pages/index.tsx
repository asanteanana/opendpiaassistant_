/**
 * Dashboard Page
 * Lists all DPIA assessments with search and filters
 */
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Filter, Loader2, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';
import { assessmentApi } from '@/utils/api';
import type { Assessment } from '@/utils/types';
import { RiskBadge } from '@/components/RiskBadge';
import { formatDate, formatStatus, getStatusColor } from '@/utils/helpers';

export default function DashboardPage() {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterRisk, setFilterRisk] = useState<string>('');
    const [showNewModal, setShowNewModal] = useState(false);

    useEffect(() => {
        loadAssessments();
    }, [filterStatus, filterRisk]);

    const loadAssessments = async () => {
        try {
            setLoading(true);
            const response = await assessmentApi.list({
                status: filterStatus || undefined,
                risk_level: filterRisk || undefined,
            });
            setAssessments(response.data);
        } catch (error) {
            console.error('Failed to load assessments:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAssessments = assessments.filter((assessment) =>
        assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assessment.organization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: assessments.length,
        draft: assessments.filter((a) => a.status === 'draft').length,
        inProgress: assessments.filter((a) => a.status === 'in_progress').length,
        completed: assessments.filter((a) => a.status === 'completed').length,
        highRisk: assessments.filter(
            (a) => a.overall_risk_level === 'high' || a.overall_risk_level === 'critical'
        ).length,
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                DPIA Assistant
                            </h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Manage your Data Protection Impact Assessments
                            </p>
                        </div>
                        <motion.button
                            onClick={() => setShowNewModal(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            New Assessment
                        </motion.button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Stats */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <StatCard label="Total" value={stats.total} />
                    <StatCard label="Draft" value={stats.draft} />
                    <StatCard label="In Progress" value={stats.inProgress} />
                    <StatCard label="Completed" value={stats.completed} />
                    <StatCard label="High Risk" value={stats.highRisk} danger />
                </div>

                {/* Search and Filters */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search assessments..."
                            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800"
                        >
                            <option value="">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select
                            value={filterRisk}
                            onChange={(e) => setFilterRisk(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800"
                        >
                            <option value="">All Risk Levels</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                </div>

                {/* Assessment Grid */}
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : filteredAssessments.length === 0 ? (
                    <EmptyState onCreateNew={() => setShowNewModal(true)} />
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredAssessments.map((assessment, index) => (
                            <AssessmentCard key={assessment.id} assessment={assessment} index={index} />
                        ))}
                    </div>
                )}
            </main>

            {/* New Assessment Modal */}
            {showNewModal && (
                <NewAssessmentModal
                    onClose={() => setShowNewModal(false)}
                    onCreated={loadAssessments}
                />
            )}
        </div>
    );
}

function StatCard({
    label,
    value,
    danger = false,
}: {
    label: string;
    value: number;
    danger?: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
            <p
                className={`mt-2 text-3xl font-bold ${danger ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}
            >
                {value}
            </p>
        </motion.div>
    );
}

function AssessmentCard({
    assessment,
    index,
}: {
    assessment: Assessment;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link
                href={`/assessment?id=${assessment.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
            >
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {assessment.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {assessment.organization}
                        </p>
                    </div>
                    {assessment.overall_risk_level && (
                        <RiskBadge level={assessment.overall_risk_level} size="sm" />
                    )}
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span
                        className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(assessment.status)}`}
                    >
                        {formatStatus(assessment.status)}
                    </span>
                    {assessment.response_count !== undefined && (
                        <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <FileText className="h-3 w-3" />
                            {assessment.response_count} responses
                        </span>
                    )}
                </div>

                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(assessment.created_at)}
                </div>
            </Link>
        </motion.div>
    );
}

function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 dark:border-gray-700 dark:bg-gray-900"
        >
            <FileText className="mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                No assessments yet
            </h3>
            <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Get started by creating your first DPIA assessment
            </p>
            <button
                onClick={onCreateNew}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
                <Plus className="h-4 w-4" />
                Create First Assessment
            </button>
        </motion.div>
    );
}

function NewAssessmentModal({
    onClose,
    onCreated,
}: {
    onClose: () => void;
    onCreated: () => void;
}) {
    const [formData, setFormData] = useState({
        title: '',
        organization: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await assessmentApi.create(formData);
            onCreated();
            onClose();
        } catch (error) {
            console.error('Failed to create assessment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
            >
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                    New Assessment
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Organization *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.organization}
                            onChange={(e) =>
                                setFormData({ ...formData, organization: e.target.value })
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={3}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Create
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

