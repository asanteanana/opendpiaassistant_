/**
 * Risk Review Step
 * Visual risk assessment with matrix and emoji scales
 */
'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, AlertTriangle, Shield, Zap } from 'lucide-react';
import type { AssessmentData } from '../GuidedAssessmentFlow';

interface RiskReviewProps {
  data: AssessmentData;
  onUpdate: (updates: Partial<AssessmentData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const LIKELIHOOD_SCALE = [
  { value: 1, emoji: '🟢', label: 'Very Unlikely', description: 'Almost never happens' },
  { value: 2, emoji: '🟡', label: 'Unlikely', description: 'Rarely occurs' },
  { value: 3, emoji: '🟠', label: 'Possible', description: 'Could happen sometimes' },
  { value: 4, emoji: '🔴', label: 'Likely', description: 'Happens regularly' },
  { value: 5, emoji: '⚫', label: 'Very Likely', description: 'Almost certain to occur' },
];

const IMPACT_SCALE = [
  { value: 1, emoji: '😊', label: 'Minimal', description: 'Just annoying' },
  { value: 2, emoji: '😐', label: 'Low', description: 'Minor inconvenience' },
  { value: 3, emoji: '😟', label: 'Moderate', description: 'Could cause some harm' },
  { value: 4, emoji: '😰', label: 'High', description: 'Could cause significant harm' },
  { value: 5, emoji: '😱', label: 'Critical', description: 'Could cause severe harm' },
];

const RISK_FACTORS = [
  { id: 'sensitive-data', label: 'Sensitive personal data', description: 'Health, biometric, or special category data' },
  { id: 'large-scale', label: 'Large-scale processing', description: 'Processing data of many individuals' },
  { id: 'systematic-monitoring', label: 'Systematic monitoring', description: 'Continuous observation of individuals' },
  { id: 'vulnerable-groups', label: 'Vulnerable groups', description: 'Children, elderly, or disabled individuals' },
  { id: 'automated-decision', label: 'Automated decision-making', description: 'Decisions made without human intervention' },
  { id: 'data-matching', label: 'Data matching/combining', description: 'Combining data from different sources' },
  { id: 'innovative-technology', label: 'Innovative technology', description: 'Using new or experimental tech' },
  { id: 'denial-of-service', label: 'Denial of service', description: 'Preventing access to services' },
];

export function RiskReview({ data, onUpdate, onNext, onPrev }: RiskReviewProps) {
  const [selectedLikelihood, setSelectedLikelihood] = useState(data.likelihoodScore || 0);
  const [selectedImpact, setSelectedImpact] = useState(data.impactScore || 0);

  const handleLikelihoodSelect = (value: number) => {
    setSelectedLikelihood(value);
    onUpdate({ likelihoodScore: value });
  };

  const handleImpactSelect = (value: number) => {
    setSelectedImpact(value);
    onUpdate({ impactScore: value });
  };

  const handleRiskFactorToggle = (factorId: string) => {
    const updatedFactors = data.riskFactors.includes(factorId)
      ? data.riskFactors.filter(f => f !== factorId)
      : [...data.riskFactors, factorId];
    onUpdate({ riskFactors: updatedFactors });
  };

  // Calculate overall risk score
  const overallRiskScore = selectedLikelihood * selectedImpact;
  const riskLevel = overallRiskScore <= 4 ? 'Low' : overallRiskScore <= 12 ? 'Medium' : overallRiskScore <= 20 ? 'High' : 'Critical';
  const riskColor = riskLevel === 'Low' ? 'green' : riskLevel === 'Medium' ? 'yellow' : riskLevel === 'High' ? 'orange' : 'red';

  const isStepComplete = selectedLikelihood > 0 && selectedImpact > 0;

  return (
    <div className="space-y-8">
      {/* Current Risk Score Display */}
      <div className={`p-6 rounded-lg border-2 ${
        riskColor === 'green' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' :
        riskColor === 'yellow' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20' :
        riskColor === 'orange' ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20' :
        'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
      }`}>
        <div className="text-center">
          <div className={`text-4xl font-bold mb-2 ${
            riskColor === 'green' ? 'text-green-700 dark:text-green-300' :
            riskColor === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' :
            riskColor === 'orange' ? 'text-orange-700 dark:text-orange-300' :
            'text-red-700 dark:text-red-300'
          }`}>
            Current Project Risk: {riskLevel}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Score: {overallRiskScore}/25 (Likelihood: {selectedLikelihood} × Impact: {selectedImpact})
          </div>
        </div>
      </div>

      {/* Likelihood Assessment */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">
          How likely is something to go wrong?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {LIKELIHOOD_SCALE.map(option => (
            <button
              key={option.value}
              onClick={() => handleLikelihoodSelect(option.value)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                selectedLikelihood === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 hover:border-blue-300 dark:border-gray-600 dark:hover:border-blue-500'
              }`}
            >
              <div className="text-2xl mb-2">{option.emoji}</div>
              <div className="font-medium text-sm">{option.label}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Impact Assessment */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">
          How bad would it be if it did?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {IMPACT_SCALE.map(option => (
            <button
              key={option.value}
              onClick={() => handleImpactSelect(option.value)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                selectedImpact === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 hover:border-blue-300 dark:border-gray-600 dark:hover:border-blue-500'
              }`}
            >
              <div className="text-2xl mb-2">{option.emoji}</div>
              <div className="font-medium text-sm">{option.label}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Risk Factors */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Which of these apply to your project?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RISK_FACTORS.map(factor => (
            <button
              key={factor.id}
              onClick={() => handleRiskFactorToggle(factor.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                data.riskFactors.includes(factor.id)
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-300 hover:border-orange-300 dark:border-gray-600 dark:hover:border-orange-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                  data.riskFactors.includes(factor.id)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {data.riskFactors.includes(factor.id) && <Check className="h-3 w-3" />}
                </div>
                <div>
                  <div className="font-medium text-sm">{factor.label}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{factor.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Risk Matrix Visualization */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
          Risk Matrix
        </h3>
        <div className="grid grid-cols-6 gap-2 text-xs">
          <div></div>
          {[1, 2, 3, 4, 5].map(impact => (
            <div key={impact} className="text-center font-medium text-gray-700 dark:text-gray-300">
              Impact {impact}
            </div>
          ))}
          {[5, 4, 3, 2, 1].map(likelihood => (
            <>
              <div key={`label-${likelihood}`} className="text-center font-medium text-gray-700 dark:text-gray-300">
                Likelihood {likelihood}
              </div>
              {[1, 2, 3, 4, 5].map(impact => {
                const score = likelihood * impact;
                const isSelected = selectedLikelihood === likelihood && selectedImpact === impact;
                return (
                  <div
                    key={`${likelihood}-${impact}`}
                    className={`h-8 rounded flex items-center justify-center text-xs font-medium ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : score <= 4
                        ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                        : score <= 12
                        ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                        : score <= 20
                        ? 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200'
                        : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                    }`}
                  >
                    {score}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Progress Checklist */}
      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
        <h3 className="font-medium text-orange-900 dark:text-orange-100 mb-4">
          Risk Review Checklist
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Likelihood assessed', completed: selectedLikelihood > 0 },
            { label: 'Impact evaluated', completed: selectedImpact > 0 },
            { label: 'Risk factors identified', completed: data.riskFactors.length > 0 },
            { label: 'Overall risk level determined', completed: isStepComplete },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                item.completed ? 'bg-orange-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                {item.completed && <Check className="h-3 w-3" />}
              </div>
              <span className={`text-sm ${
                item.completed ? 'text-orange-700 dark:text-orange-300' : 'text-gray-600 dark:text-gray-400'
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
          Back to Data Use
        </button>
        <button
          onClick={onNext}
          disabled={!isStepComplete}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Safeguards
        </button>
      </div>
    </div>
  );
}
