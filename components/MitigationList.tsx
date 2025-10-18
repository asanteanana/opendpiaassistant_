/**
 * Mitigation List Component
 * Displays and manages mitigation measures
 */
'use client';

import { motion } from 'motion/react';
import { Plus, CheckCircle2, Circle, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { Mitigation, MitigationStatus } from '@/utils/types';
import { cn } from '@/utils/helpers';

interface MitigationListProps {
    mitigations: Mitigation[];
    onStatusChange?: (id: string, status: MitigationStatus) => void;
    onAdd?: (mitigation: Omit<Mitigation, 'id' | 'created_at' | 'updated_at'>) => void;
    editable?: boolean;
    className?: string;
}

export function MitigationList({
    mitigations,
    onStatusChange,
    onAdd,
    editable = false,
    className,
}: MitigationListProps) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMitigation, setNewMitigation] = useState({
        description: '',
        gdpr_article: '',
        priority: 'medium',
    });

    const handleAdd = () => {
        if (newMitigation.description && onAdd) {
            onAdd({
                ...newMitigation,
                response_id: '',
                status: 'proposed',
            });
            setNewMitigation({ description: '', gdpr_article: '', priority: 'medium' });
            setShowAddForm(false);
        }
    };

    const getStatusIcon = (status: MitigationStatus) => {
        switch (status) {
            case 'implemented':
                return <CheckCircle2 className="h-5 w-5 text-green-600" />;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return <Circle className="h-5 w-5 text-gray-400" />;
        }
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800';
            case 'medium':
                return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800';
            case 'low':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
        }
    };

    return (
        <div className={cn('space-y-4', className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Mitigation Measures
                </h3>
                {editable && onAdd && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add Mitigation
                    </button>
                )}
            </div>

            {/* Add Form */}
            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                value={newMitigation.description}
                                onChange={(e) =>
                                    setNewMitigation({ ...newMitigation, description: e.target.value })
                                }
                                rows={3}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800"
                                placeholder="Describe the mitigation measure..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    GDPR Article (optional)
                                </label>
                                <input
                                    type="text"
                                    value={newMitigation.gdpr_article}
                                    onChange={(e) =>
                                        setNewMitigation({ ...newMitigation, gdpr_article: e.target.value })
                                    }
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800"
                                    placeholder="e.g., 32"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Priority
                                </label>
                                <select
                                    value={newMitigation.priority}
                                    onChange={(e) =>
                                        setNewMitigation({ ...newMitigation, priority: e.target.value })
                                    }
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Mitigation List */}
            <div className="space-y-3">
                {mitigations.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            No mitigation measures yet. Add some to reduce risk.
                        </p>
                    </div>
                ) : (
                    mitigations.map((mitigation, index) => (
                        <motion.div
                            key={mitigation.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="flex-shrink-0">
                                {editable && onStatusChange ? (
                                    <button
                                        onClick={() => {
                                            const nextStatus: MitigationStatus =
                                                mitigation.status === 'proposed'
                                                    ? 'implemented'
                                                    : mitigation.status === 'implemented'
                                                        ? 'rejected'
                                                        : 'proposed';
                                            onStatusChange(mitigation.id, nextStatus);
                                        }}
                                        className="transition-colors hover:opacity-70"
                                    >
                                        {getStatusIcon(mitigation.status)}
                                    </button>
                                ) : (
                                    getStatusIcon(mitigation.status)
                                )}
                            </div>

                            <div className="flex-1">
                                <p className="text-gray-900 dark:text-gray-100">
                                    {mitigation.description}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    {mitigation.gdpr_article && (
                                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                                            Article {mitigation.gdpr_article}
                                        </span>
                                    )}
                                    {mitigation.priority && (
                                        <span
                                            className={cn(
                                                'rounded-full border px-2 py-0.5 text-xs font-medium',
                                                getPriorityColor(mitigation.priority)
                                            )}
                                        >
                                            {mitigation.priority.charAt(0).toUpperCase() +
                                                mitigation.priority.slice(1)}{' '}
                                            Priority
                                        </span>
                                    )}
                                    <span
                                        className={cn(
                                            'rounded-full px-2 py-0.5 text-xs font-medium',
                                            mitigation.status === 'implemented'
                                                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                                                : mitigation.status === 'rejected'
                                                    ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
                                                    : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                        )}
                                    >
                                        {mitigation.status.charAt(0).toUpperCase() +
                                            mitigation.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

