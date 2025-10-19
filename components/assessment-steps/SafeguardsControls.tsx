/**
 * Safeguards & Controls Step
 * Empowering checkboxes with examples and tooltips
 */
'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Info, Shield, Lock, Eye, Users, Clock, AlertCircle } from 'lucide-react';
import type { AssessmentData } from '../../GuidedAssessmentFlow';

interface SafeguardsControlsProps {
  data: AssessmentData;
  onUpdate: (updates: Partial<AssessmentData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const SAFEGUARD_CATEGORIES = [
  {
    id: 'technical',
    title: 'Technical Safeguards',
    icon: Shield,
    safeguards: [
      {
        id: 'encryption',
        label: 'Encryption',
        description: 'Data stored securely',
        example: 'AES-256 for data at rest, TLS 1.3 for data in transit',
        icon: Lock,
      },
      {
        id: 'access-controls',
        label: 'Access Controls',
        description: 'Limited access to data',
        example: 'Role-based permissions, multi-factor authentication',
        icon: Eye,
      },
      {
        id: 'data-backup',
        label: 'Data Backup',
        description: 'Secure backup systems',
        example: 'Encrypted backups, off-site storage, regular testing',
        icon: Shield,
      },
      {
        id: 'network-security',
        label: 'Network Security',
        description: 'Protected network infrastructure',
        example: 'Firewalls, VPNs, intrusion detection systems',
        icon: Shield,
      },
      {
        id: 'data-minimization',
        label: 'Data Minimization',
        description: 'Collect only what\'s needed',
        example: 'Automatic data purging, field-level access controls',
        icon: Users,
      },
    ],
  },
  {
    id: 'organizational',
    title: 'Organizational Safeguards',
    icon: Users,
    safeguards: [
      {
        id: 'staff-training',
        label: 'Staff Training',
        description: 'Regular privacy training',
        example: 'GDPR training, incident response procedures',
        icon: Users,
      },
      {
        id: 'data-governance',
        label: 'Data Governance',
        description: 'Clear data policies',
        example: 'Data retention policies, classification schemes',
        icon: Shield,
      },
      {
        id: 'incident-response',
        label: 'Incident Response',
        description: 'Breach response plan',
        example: '24-hour response team, notification procedures',
        icon: AlertCircle,
      },
      {
        id: 'regular-audits',
        label: 'Regular Audits',
        description: 'Quarterly data protection reviews',
        example: 'Access logs review, compliance assessments',
        icon: Clock,
      },
      {
        id: 'vendor-management',
        label: 'Vendor Management',
        description: 'Third-party data protection',
        example: 'Data processing agreements, security assessments',
        icon: Users,
      },
    ],
  },
];

export function SafeguardsControls({ data, onUpdate, onNext, onPrev }: SafeguardsControlsProps) {
  const [hoveredSafeguard, setHoveredSafeguard] = useState<string | null>(null);

  const handleSafeguardToggle = (categoryId: string, safeguardId: string) => {
    const categoryKey = categoryId === 'technical' ? 'technicalMeasures' : 'organizationalMeasures';
    const currentSafeguards = data[categoryKey] || [];
    const updatedSafeguards = currentSafeguards.includes(safeguardId)
      ? currentSafeguards.filter(s => s !== safeguardId)
      : [...currentSafeguards, safeguardId];
    
    onUpdate({ [categoryKey]: updatedSafeguards });
  };

  const isStepComplete = (data.technicalMeasures?.length || 0) > 0 || (data.organizationalMeasures?.length || 0) > 0;

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              How will you protect the data?
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Select the safeguards you have in place or plan to implement. These help reduce the risks we identified.
            </p>
          </div>
        </div>
      </div>

      {/* Safeguard Categories */}
      {SAFEGUARD_CATEGORIES.map(category => {
        const Icon = category.icon;
        const categoryKey = category.id === 'technical' ? 'technicalMeasures' : 'organizationalMeasures';
        const selectedSafeguards = data[categoryKey] || [];

        return (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {category.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.safeguards.map(safeguard => {
                const SafeguardIcon = safeguard.icon;
                const isSelected = selectedSafeguards.includes(safeguard.id);
                const isHovered = hoveredSafeguard === safeguard.id;

                return (
                  <div
                    key={safeguard.id}
                    className="relative"
                    onMouseEnter={() => setHoveredSafeguard(safeguard.id)}
                    onMouseLeave={() => setHoveredSafeguard(null)}
                  >
                    <button
                      onClick={() => handleSafeguardToggle(category.id, safeguard.id)}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-300 hover:border-green-300 dark:border-gray-600 dark:hover:border-green-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          isSelected
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <SafeguardIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <span className="font-medium text-sm">{safeguard.label}</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {safeguard.description}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                            <Info className="h-3 w-3" />
                            <span>Hover for example</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Tooltip with Example */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10"
                      >
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            Example:
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {safeguard.example}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Custom Safeguards */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Additional Safeguards
        </h3>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Describe any other safeguards you have in place
          </label>
          <textarea
            value={data.safeguards.join('\n')}
            onChange={(e) => onUpdate({ safeguards: e.target.value.split('\n').filter(s => s.trim()) })}
            placeholder="e.g., Privacy by design principles, data protection impact assessments, regular security updates..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Risk Mitigation Summary */}
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
        <h3 className="font-medium text-green-900 dark:text-green-100 mb-4">
          Risk Mitigation Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-green-800 dark:text-green-200 mb-2">
              Technical Measures ({data.technicalMeasures?.length || 0})
            </div>
            <div className="space-y-1">
              {data.technicalMeasures?.map(measure => (
                <div key={measure} className="text-green-700 dark:text-green-300">
                  • {measure.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-medium text-green-800 dark:text-green-200 mb-2">
              Organizational Measures ({data.organizationalMeasures?.length || 0})
            </div>
            <div className="space-y-1">
              {data.organizationalMeasures?.map(measure => (
                <div key={measure} className="text-green-700 dark:text-green-300">
                  • {measure.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Checklist */}
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
        <h3 className="font-medium text-green-900 dark:text-green-100 mb-4">
          Safeguards & Controls Checklist
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Technical safeguards selected', completed: (data.technicalMeasures?.length || 0) > 0 },
            { label: 'Organizational safeguards selected', completed: (data.organizationalMeasures?.length || 0) > 0 },
            { label: 'Additional safeguards documented', completed: data.safeguards.length > 0 },
            { label: 'Risk mitigation plan complete', completed: isStepComplete },
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
          Back to Risk Review
        </button>
        <button
          onClick={onNext}
          disabled={!isStepComplete}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
