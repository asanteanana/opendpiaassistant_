/**
 * Review & Approval Step
 * Collaborative review with inline comments
 */
'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, MessageSquare, User, Mail, Calendar, AlertCircle } from 'lucide-react';
import type { AssessmentData } from '../../GuidedAssessmentFlow';

interface ReviewApprovalProps {
  data: AssessmentData;
  onUpdate: (updates: Partial<AssessmentData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const REVIEWER_ROLES = [
  { id: 'dpo', label: 'Data Protection Officer', description: 'Internal DPO or privacy lead' },
  { id: 'legal', label: 'Legal Counsel', description: 'Legal team member' },
  { id: 'manager', label: 'Project Manager', description: 'Project or team lead' },
  { id: 'executive', label: 'Executive', description: 'Senior leadership' },
  { id: 'external', label: 'External Consultant', description: 'Third-party privacy expert' },
  { id: 'other', label: 'Other', description: 'Specify role below' },
];

const DECISION_OPTIONS = [
  { id: 'approved', label: 'Approved', description: 'Assessment is complete and compliant', color: 'green' },
  { id: 'needs_changes', label: 'Needs Changes', description: 'Requires modifications before approval', color: 'yellow' },
  { id: 'rejected', label: 'Rejected', description: 'Assessment does not meet requirements', color: 'red' },
];

export function ReviewApproval({ data, onUpdate, onNext, onPrev }: ReviewApprovalProps) {
  const [showRoleOptions, setShowRoleOptions] = useState(false);
  const [customRole, setCustomRole] = useState('');

  const handleRoleSelect = (roleId: string) => {
    if (roleId === 'other') {
      onUpdate({ reviewerRole: customRole });
    } else {
      const role = REVIEWER_ROLES.find(r => r.id === roleId);
      onUpdate({ reviewerRole: role?.label || '' });
    }
    setShowRoleOptions(false);
  };

  const handleDecisionSelect = (decisionId: string) => {
    onUpdate({ decision: decisionId as 'approved' | 'needs_changes' | 'rejected' });
  };

  const isStepComplete = data.reviewerName && data.reviewerRole && data.decision;

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <div className="flex items-start gap-3">
          <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Get stakeholder input
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Add reviewer details and comments. This creates an audit trail for your DPIA.
            </p>
          </div>
        </div>
      </div>

      {/* Reviewer Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Reviewer Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reviewer Name */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reviewer Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={data.reviewerName}
                onChange={(e) => onUpdate({ reviewerName: e.target.value })}
                placeholder="Enter reviewer's name"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Reviewer Role */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reviewer Role
            </label>
            <div className="relative">
              <button
                onClick={() => setShowRoleOptions(!showRoleOptions)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-left text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
              >
                {data.reviewerRole || 'Select reviewer role...'}
              </button>
              
              {showRoleOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10"
                >
                  {REVIEWER_ROLES.map(role => (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100">{role.label}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{role.description}</div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
            
            {data.reviewerRole === 'Other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3"
              >
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="Specify reviewer role"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-900 dark:text-gray-100">
          Comments & Feedback
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <textarea
            value={data.comments}
            onChange={(e) => onUpdate({ comments: e.target.value })}
            placeholder="Add any comments, concerns, or recommendations for this DPIA..."
            rows={6}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Include any specific recommendations, concerns, or additional requirements
        </p>
      </div>

      {/* Decision */}
      <div className="space-y-4">
        <label className="block text-lg font-medium text-gray-900 dark:text-gray-100">
          Review Decision
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DECISION_OPTIONS.map(option => (
            <button
              key={option.id}
              onClick={() => handleDecisionSelect(option.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                data.decision === option.id
                  ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20`
                  : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  data.decision === option.id
                    ? `bg-${option.color}-500 text-white`
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {data.decision === option.id && <Check className="h-3 w-3" />}
                </div>
                <span className={`font-medium ${
                  data.decision === option.id
                    ? `text-${option.color}-700 dark:text-${option.color}-300`
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {option.label}
                </span>
              </div>
              <p className={`text-sm ${
                data.decision === option.id
                  ? `text-${option.color}-600 dark:text-${option.color}-400`
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Review Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
          Review Summary
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Reviewer:</strong> {data.reviewerName || 'Not specified'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Role:</strong> {data.reviewerRole || 'Not specified'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Review Date:</strong> {new Date().toLocaleDateString()}
            </span>
          </div>
          {data.decision && (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Decision:</strong> 
                <span className={`ml-1 font-medium ${
                  data.decision === 'approved' ? 'text-green-600 dark:text-green-400' :
                  data.decision === 'needs_changes' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {DECISION_OPTIONS.find(opt => opt.id === data.decision)?.label}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Checklist */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-4">
          Review & Approval Checklist
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Reviewer name provided', completed: !!data.reviewerName },
            { label: 'Reviewer role specified', completed: !!data.reviewerRole },
            { label: 'Comments added', completed: !!data.comments },
            { label: 'Decision made', completed: !!data.decision },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                item.completed ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                {item.completed && <Check className="h-3 w-3" />}
              </div>
              <span className={`text-sm ${
                item.completed ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'
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
          Back to Safeguards
        </button>
        <button
          onClick={onNext}
          disabled={!isStepComplete}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
}
