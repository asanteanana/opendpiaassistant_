/**
 * Guided Assessment Flow
 * Modern, conversational DPIA assessment with 6 clear steps
 */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Check, Save, Clock, Users, Shield, FileText, Eye, Download } from 'lucide-react';
import { ProjectOverview } from './assessment-steps/ProjectOverview';
import { DataUseNecessity } from './assessment-steps/DataUseNecessity';
import { RiskReview } from './assessment-steps/RiskReview';
import { SafeguardsControls } from './assessment-steps/SafeguardsControls';
import { ReviewApproval } from './assessment-steps/ReviewApproval';
import { GenerateReport } from './assessment-steps/GenerateReport';

export interface AssessmentData {
  // Project Overview
  projectName: string;
  projectGoal: string;
  dataTypes: string[];
  dataSubjects: string[];
  
  // Data Use & Necessity
  dataPurpose: string;
  retentionPeriod: string;
  dataSharing: boolean;
  sharingDetails: string;
  
  // Risk Review
  likelihoodScore: number;
  impactScore: number;
  riskFactors: string[];
  
  // Safeguards & Controls
  safeguards: string[];
  technicalMeasures: string[];
  organizationalMeasures: string[];
  
  // Review & Approval
  reviewerName: string;
  reviewerRole: string;
  comments: string;
  decision: 'approved' | 'needs_changes' | 'rejected';
  
  // Report Generation
  reportGenerated: boolean;
  reportUrl?: string;
}

const STEPS = [
  {
    id: 'overview',
    title: 'Project Overview',
    description: 'Tell us about your project',
    icon: Eye,
    component: ProjectOverview,
  },
  {
    id: 'data-use',
    title: 'Data Use & Necessity',
    description: 'Why do you need this data?',
    icon: Users,
    component: DataUseNecessity,
  },
  {
    id: 'risks',
    title: 'Risk Review',
    description: 'What could go wrong?',
    icon: Shield,
    component: RiskReview,
  },
  {
    id: 'safeguards',
    title: 'Safeguards & Controls',
    description: 'How will you protect it?',
    icon: Shield,
    component: SafeguardsControls,
  },
  {
    id: 'review',
    title: 'Review & Approval',
    description: 'Get stakeholder input',
    icon: Check,
    component: ReviewApproval,
  },
  {
    id: 'report',
    title: 'Generate Report',
    description: 'Your DPIA is ready!',
    icon: FileText,
    component: GenerateReport,
  },
];

interface GuidedAssessmentFlowProps {
  assessmentId?: string;
  onComplete?: (data: AssessmentData) => void;
}

export function GuidedAssessmentFlow({ assessmentId, onComplete }: GuidedAssessmentFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    projectName: '',
    projectGoal: '',
    dataTypes: [],
    dataSubjects: [],
    dataPurpose: '',
    retentionPeriod: '',
    dataSharing: false,
    sharingDetails: '',
    likelihoodScore: 0,
    impactScore: 0,
    riskFactors: [],
    safeguards: [],
    technicalMeasures: [],
    organizationalMeasures: [],
    reviewerName: '',
    reviewerRole: '',
    comments: '',
    decision: 'approved',
    reportGenerated: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save functionality
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      saveProgress();
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [assessmentData]);

  const saveProgress = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateData = (updates: Partial<AssessmentData>) => {
    setAssessmentData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const currentStepData = STEPS[currentStep];
  const CurrentStepComponent = currentStepData.component;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header with Progress */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                DPIA Assessment
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {assessmentData.projectName || 'Untitled Project'}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4 animate-spin" />
                  Saving...
                </div>
              ) : lastSaved ? (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              ) : null}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <motion.div
                className="bg-green-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => goToStep(index)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isCurrent
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : isCompleted
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentStepData.description}
              </p>
            </div>

            <CurrentStepComponent
              data={assessmentData}
              onUpdate={updateData}
              onNext={nextStep}
              onPrev={prevStep}
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === STEPS.length - 1}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            Estimated {Math.max(1, Math.round((STEPS.length - currentStep) * 2))} minutes remaining
          </div>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => onComplete?.(assessmentData)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Complete Assessment
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
