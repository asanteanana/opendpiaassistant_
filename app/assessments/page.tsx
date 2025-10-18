/**
 * DPIA Assessments Dashboard - with Nim styling
 */
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, FileText, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Spotlight } from '@/components/ui/spotlight';
import { Magnetic } from '@/components/ui/magnetic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const TRANSITION_SECTION = {
  duration: 0.3,
};

type Assessment = {
  id: string;
  title: string;
  organization: string;
  status: string;
  overall_risk_level?: string;
  overall_risk_score: number;
  created_at: string;
  response_count?: number;
};

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/assessments`);
      const data = await response.json();
      setAssessments(data);
    } catch (error) {
      console.error('Failed to load assessments:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <motion.main
      className="space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              DPIA Assistant
            </h1>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Conduct Data Protection Impact Assessments with confidence. 
              Streamline GDPR compliance with intelligent risk analysis.
            </p>
          </div>
          <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
            <button
              onClick={() => setShowNewModal(true)}
              className="group relative inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              New Assessment
            </button>
          </Magnetic>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h3 className="mb-5 text-lg font-medium">Overview</h3>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Draft" value={stats.draft} />
          <StatCard label="In Progress" value={stats.inProgress} />
          <StatCard label="Completed" value={stats.completed} />
          <StatCard label="High Risk" value={stats.highRisk} danger />
        </div>
      </motion.section>

      {/* Assessments List */}
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h3 className="mb-5 text-lg font-medium">Your Assessments</h3>
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
          </div>
        ) : assessments.length === 0 ? (
          <EmptyState onCreateNew={() => setShowNewModal(true)} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {assessments.map((assessment, index) => (
              <AssessmentCard key={assessment.id} assessment={assessment} index={index} />
            ))}
          </div>
        )}
      </motion.section>

      {/* New Assessment Modal */}
      {showNewModal && (
        <NewAssessmentModal onClose={() => setShowNewModal(false)} onCreated={loadAssessments} />
      )}
    </motion.main>
  );
}

function StatCard({ label, value, danger = false }: { label: string; value: number; danger?: boolean }) {
  return (
    <div className="rounded-2xl bg-zinc-50/40 p-6 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${danger ? 'text-red-600 dark:text-red-400' : 'text-zinc-900 dark:text-zinc-50'}`}>
        {value}
      </p>
    </div>
  );
}

function AssessmentCard({ assessment, index }: { assessment: Assessment; index: number }) {
  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'low': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
      case 'medium': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
      case 'high': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'critical': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default: return 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-400';
    }
  };

  return (
    <Link
      href={`/assessment/${assessment.id}`}
      className="relative block overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30"
    >
      <Spotlight
        className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
        size={64}
      />
      <div className="relative h-full w-full rounded-[15px] bg-white p-6 dark:bg-zinc-950">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{assessment.title}</h4>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{assessment.organization}</p>
          </div>
          {assessment.overall_risk_level && (
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getRiskColor(assessment.overall_risk_level)}`}>
              {assessment.overall_risk_level}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {assessment.response_count || 0} responses
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(assessment.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/40 p-12 text-center dark:border-zinc-700 dark:bg-zinc-950/40">
      <FileText className="mx-auto mb-4 h-16 w-16 text-zinc-400" />
      <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        No assessments yet
      </h3>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
        Get started by creating your first DPIA assessment
      </p>
      <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4" />
          Create First Assessment
        </button>
      </Magnetic>
    </div>
  );
}

function NewAssessmentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [formData, setFormData] = useState({ title: '', organization: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onCreated();
        onClose();
      }
    } catch (error) {
      console.error('Failed to create assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          New Assessment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Organization *</label>
            <input
              type="text"
              required
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-300 px-4 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
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

