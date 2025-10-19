/**
 * Progressive Onboarding Modal
 * Educational modal explaining DPIA process in minimal design style
 */
'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Shield, FileText, TrendingUp, CheckCircle } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAssessment: () => void;
}

export function OnboardingModal({ isOpen, onClose, onStartAssessment }: OnboardingModalProps) {
  const steps = [
    {
      icon: Shield,
      title: "What is a DPIA?",
      description: "A Data Protection Impact Assessment helps identify and minimize privacy risks before processing personal data.",
    },
    {
      icon: TrendingUp,
      title: "Why it matters",
      description: "Required under GDPR for high-risk processing. Protects your organization and data subjects.",
    },
    {
      icon: FileText,
      title: "What you'll get",
      description: "Comprehensive PDF report with risk scores, mitigation recommendations, and compliance validation.",
    },
    {
      icon: CheckCircle,
      title: "Ready to start?",
      description: "Our guided questionnaire takes 10-15 minutes and automatically calculates your privacy risk score.",
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Understanding DPIAs
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Let's walk through what you'll accomplish
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <step.icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={onClose}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750"
              >
                Learn More Later
              </button>
              <motion.button
                onClick={onStartAssessment}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Start Assessment
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
