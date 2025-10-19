/**
 * Generate Report Step
 * Modern success screen with export options
 */
'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Download, Share2, FileText, Copy, ExternalLink, Sparkles } from 'lucide-react';
import type { AssessmentData } from '../../GuidedAssessmentFlow';

interface GenerateReportProps {
  data: AssessmentData;
  onUpdate: (updates: Partial<AssessmentData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const EXPORT_FORMATS = [
  {
    id: 'pdf',
    label: 'PDF Report',
    description: 'Professional compliance report',
    icon: FileText,
    color: 'red',
  },
  {
    id: 'json',
    label: 'JSON Data',
    description: 'Machine-readable data export',
    icon: FileText,
    color: 'blue',
  },
  {
    id: 'csv',
    label: 'CSV Summary',
    description: 'Spreadsheet-friendly format',
    icon: FileText,
    color: 'green',
  },
];

export function GenerateReport({ data, onUpdate, onNext, onPrev }: GenerateReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      const url = `https://dpia-assistant.com/reports/${Date.now()}`;
      setGeneratedUrl(url);
      onUpdate({ reportGenerated: true, reportUrl: url });
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyShareableLink = async () => {
    if (generatedUrl) {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadReport = (format: string) => {
    // Simulate download
    console.log(`Downloading report in ${format} format`);
  };

  // Calculate completion metrics
  const totalSteps = 6;
  const completedSteps = [
    !!data.projectName,
    !!data.dataPurpose,
    data.likelihoodScore > 0 && data.impactScore > 0,
    (data.technicalMeasures?.length || 0) > 0 || (data.organizationalMeasures?.length || 0) > 0,
    !!data.reviewerName,
    data.reportGenerated,
  ].filter(Boolean).length;

  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.3 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4"
        >
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          DPIA Complete! 🎉
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Your final report and risk summary are ready.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          {completionPercentage}% Complete
        </div>
      </motion.div>

      {/* Report Generation */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Generate Your Report
          </h3>
          {data.reportGenerated && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Generated</span>
            </div>
          )}
        </div>

        {!data.reportGenerated ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Generate a comprehensive DPIA report with all your assessment details
            </p>
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Report...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Generate Report
                </div>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Shareable Link */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Shareable Link</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={generatedUrl || ''}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={copyShareableLink}
                  className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  {copied ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Copied
                    </div>
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                Share this link with stakeholders for review
              </p>
            </div>

            {/* Export Options */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                Download Options
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {EXPORT_FORMATS.map(format => {
                  const Icon = format.icon;
                  return (
                    <button
                      key={format.id}
                      onClick={() => downloadReport(format.id)}
                      className={`p-4 rounded-lg border-2 border-${format.color}-200 bg-${format.color}-50 dark:bg-${format.color}-900/20 hover:border-${format.color}-300 dark:hover:border-${format.color}-500 transition-colors`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`h-5 w-5 text-${format.color}-600 dark:text-${format.color}-400`} />
                        <span className={`font-medium text-${format.color}-900 dark:text-${format.color}-100`}>
                          {format.label}
                        </span>
                      </div>
                      <p className={`text-sm text-${format.color}-700 dark:text-${format.color}-300`}>
                        {format.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assessment Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
          Assessment Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Project:</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">{data.projectName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Data Types:</span>
              <span className="text-gray-900 dark:text-gray-100">{data.dataTypes.length} selected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Data Subjects:</span>
              <span className="text-gray-900 dark:text-gray-100">{data.dataSubjects.length} categories</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Risk Level:</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {data.likelihoodScore && data.impactScore 
                  ? (() => {
                      const score = data.likelihoodScore * data.impactScore;
                      return score <= 4 ? 'Low' : score <= 12 ? 'Medium' : score <= 20 ? 'High' : 'Critical';
                    })()
                  : 'Not assessed'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Safeguards:</span>
              <span className="text-gray-900 dark:text-gray-100">
                {(data.technicalMeasures?.length || 0) + (data.organizationalMeasures?.length || 0)} implemented
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {data.decision === 'approved' ? 'Approved' : 
                 data.decision === 'needs_changes' ? 'Needs Changes' : 
                 data.decision === 'rejected' ? 'Rejected' : 'Pending Review'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Branding Moment */}
      <div className="text-center py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Built with</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">DPIA Assistant</span>
          <span>— modern compliance made simple</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Back to Review
        </button>
        <button
          onClick={() => window.location.href = '/assessments'}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
