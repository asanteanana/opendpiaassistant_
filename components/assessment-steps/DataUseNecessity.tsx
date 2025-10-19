/**
 * Data Use & Necessity Step
 * Plain language justification for data processing
 */
'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Info, Clock, Share2 } from 'lucide-react';
import type { AssessmentData } from '../GuidedAssessmentFlow';

interface DataUseNecessityProps {
  data: AssessmentData;
  onUpdate: (updates: Partial<AssessmentData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const PURPOSE_OPTIONS = [
  { id: 'service', label: 'Provide a service', description: 'Deliver products or services to customers' },
  { id: 'contract', label: 'Fulfill a contract', description: 'Meet contractual obligations' },
  { id: 'security', label: 'Ensure security', description: 'Protect systems and prevent fraud' },
  { id: 'marketing', label: 'Marketing & sales', description: 'Promote products and acquire customers' },
  { id: 'analytics', label: 'Analytics & insights', description: 'Understand user behavior and improve' },
  { id: 'compliance', label: 'Legal compliance', description: 'Meet regulatory requirements' },
  { id: 'research', label: 'Research & development', description: 'Develop new products or services' },
  { id: 'hr', label: 'Human resources', description: 'Manage employees and recruitment' },
];

const RETENTION_OPTIONS = [
  { id: '30-days', label: '30 days', description: 'Short-term processing' },
  { id: '6-months', label: '6 months', description: 'Medium-term storage' },
  { id: '1-year', label: '1 year', description: 'Annual cycle' },
  { id: '3-years', label: '3 years', description: 'Business records' },
  { id: '7-years', label: '7 years', description: 'Legal requirements' },
  { id: 'indefinite', label: 'Indefinite', description: 'Ongoing business need' },
  { id: 'custom', label: 'Custom period', description: 'Specify your own timeframe' },
];

export function DataUseNecessity({ data, onUpdate, onNext, onPrev }: DataUseNecessityProps) {
  const [showPurposeOptions, setShowPurposeOptions] = useState(false);
  const [showRetentionOptions, setShowRetentionOptions] = useState(false);
  const [customRetentionPeriod, setCustomRetentionPeriod] = useState('');

  const handlePurposeSelect = (purposeId: string) => {
    const option = PURPOSE_OPTIONS.find(opt => opt.id === purposeId);
    onUpdate({ dataPurpose: option?.label || '' });
    setShowPurposeOptions(false);
  };

  const handleRetentionSelect = (retentionId: string) => {
    if (retentionId === 'custom') {
      onUpdate({ retentionPeriod: customRetentionPeriod });
    } else {
      const option = RETENTION_OPTIONS.find(opt => opt.id === retentionId);
      onUpdate({ retentionPeriod: option?.label || '' });
    }
    setShowRetentionOptions(false);
  };

  const isStepComplete = data.dataPurpose && data.retentionPeriod;

  return (
    <div className="space-y-8">
      {/* Data Purpose */}
      <div className="space-y-3">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Why do you need this data?
        </label>
        <div className="relative">
          <button
            onClick={() => setShowPurposeOptions(!showPurposeOptions)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-left text-gray-900 placeholder-gray-500 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
          >
            {data.dataPurpose || 'Select a purpose...'}
          </button>
          
          {showPurposeOptions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10"
            >
              {PURPOSE_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => handlePurposeSelect(option.id)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">{option.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{option.description}</div>
                </button>
              ))}
            </motion.div>
          )}
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>This helps establish your legal basis for processing under GDPR</span>
        </div>
      </div>

      {/* Retention Period */}
      <div className="space-y-3">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">
          How long will you keep it?
        </label>
        <div className="relative">
          <button
            onClick={() => setShowRetentionOptions(!showRetentionOptions)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-left text-gray-900 placeholder-gray-500 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
          >
            {data.retentionPeriod || 'Select retention period...'}
          </button>
          
          {showRetentionOptions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10"
            >
              {RETENTION_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleRetentionSelect(option.id)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">{option.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{option.description}</div>
                </button>
              ))}
            </motion.div>
          )}
        </div>
        
        {data.retentionPeriod === 'Custom period' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3"
          >
            <input
              type="text"
              value={customRetentionPeriod}
              onChange={(e) => setCustomRetentionPeriod(e.target.value)}
              placeholder="e.g., 2 years, 18 months, until account closure"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </motion.div>
        )}
        
        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Retention means how long you store data before deleting it</span>
        </div>
      </div>

      {/* Data Sharing */}
      <div className="space-y-3">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Do you share it with others?
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => onUpdate({ dataSharing: true })}
            className={`flex-1 px-4 py-3 rounded-lg border-2 text-center font-medium transition-colors ${
              data.dataSharing
                ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                : 'border-gray-300 text-gray-700 hover:border-green-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-green-600'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => onUpdate({ dataSharing: false })}
            className={`flex-1 px-4 py-3 rounded-lg border-2 text-center font-medium transition-colors ${
              !data.dataSharing
                ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                : 'border-gray-300 text-gray-700 hover:border-green-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-green-600'
            }`}
          >
            No
          </button>
        </div>
        
        {data.dataSharing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3"
          >
            <textarea
              value={data.sharingDetails}
              onChange={(e) => onUpdate({ sharingDetails: e.target.value })}
              placeholder="Describe who you share with and why (e.g., payment processors, analytics providers, cloud storage)"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </motion.div>
        )}
        
        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Share2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Include third-party services, partners, or any external sharing</span>
        </div>
      </div>

      {/* Progress Checklist */}
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
        <h3 className="font-medium text-green-900 dark:text-green-100 mb-4">
          Data Use & Necessity Checklist
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Data purpose defined', completed: !!data.dataPurpose },
            { label: 'Retention period set', completed: !!data.retentionPeriod },
            { label: 'Data sharing clarified', completed: data.dataSharing !== undefined },
            { label: 'Sharing details provided', completed: !data.dataSharing || !!data.sharingDetails },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                item.completed ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                {item.completed && <Check className="h-3 w-3" />}
              </div>
              <span className={`text-sm ${
                item.completed ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Back to Overview
        </button>
        <button
          onClick={onNext}
          disabled={!isStepComplete}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Risk Review
        </button>
      </div>
    </div>
  );
}
