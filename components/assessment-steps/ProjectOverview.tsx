/**
 * Project Overview Step
 * Conversational onboarding for project details
 */
'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Plus, X } from 'lucide-react';
import type { AssessmentData } from '../GuidedAssessmentFlow';

interface ProjectOverviewProps {
  data: AssessmentData;
  onUpdate: (updates: Partial<AssessmentData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const DATA_TYPE_OPTIONS = [
  { id: 'personal', label: 'Personal Information', description: 'Names, emails, phone numbers' },
  { id: 'health', label: 'Health Data', description: 'Medical records, health conditions' },
  { id: 'behavioral', label: 'Behavioral Data', description: 'Browsing habits, preferences' },
  { id: 'financial', label: 'Financial Data', description: 'Bank details, payment info' },
  { id: 'biometric', label: 'Biometric Data', description: 'Fingerprints, facial recognition' },
  { id: 'location', label: 'Location Data', description: 'GPS coordinates, addresses' },
  { id: 'demographic', label: 'Demographic Data', description: 'Age, gender, ethnicity' },
  { id: 'professional', label: 'Professional Data', description: 'Job titles, work history' },
];

const DATA_SUBJECT_OPTIONS = [
  { id: 'employees', label: 'Employees', description: 'Your staff and team members' },
  { id: 'customers', label: 'Customers', description: 'People who buy your products/services' },
  { id: 'users', label: 'Users', description: 'People using your app or website' },
  { id: 'children', label: 'Children', description: 'Under 18 years old' },
  { id: 'patients', label: 'Patients', description: 'Healthcare recipients' },
  { id: 'students', label: 'Students', description: 'Educational institution attendees' },
  { id: 'visitors', label: 'Website Visitors', description: 'People browsing your site' },
  { id: 'suppliers', label: 'Suppliers', description: 'Business partners and vendors' },
];

export function ProjectOverview({ data, onUpdate, onNext }: ProjectOverviewProps) {
  const [showDataTypes, setShowDataTypes] = useState(false);
  const [showDataSubjects, setShowDataSubjects] = useState(false);

  const handleDataTypeToggle = (typeId: string) => {
    const updatedTypes = data.dataTypes.includes(typeId)
      ? data.dataTypes.filter(t => t !== typeId)
      : [...data.dataTypes, typeId];
    onUpdate({ dataTypes: updatedTypes });
  };

  const handleDataSubjectToggle = (subjectId: string) => {
    const updatedSubjects = data.dataSubjects.includes(subjectId)
      ? data.dataSubjects.filter(s => s !== subjectId)
      : [...data.dataSubjects, subjectId];
    onUpdate({ dataSubjects: updatedSubjects });
  };

  const isStepComplete = data.projectName && data.projectGoal && data.dataTypes.length > 0 && data.dataSubjects.length > 0;

  return (
    <div className="space-y-8">
      {/* Project Name */}
      <div className="space-y-3">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">
          What's this project called?
        </label>
        <input
          type="text"
          value={data.projectName}
          onChange={(e) => onUpdate({ projectName: e.target.value })}
          placeholder="e.g., Customer Analytics Dashboard"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Give your DPIA a clear, descriptive name
        </p>
      </div>

      {/* Project Goal */}
      <div className="space-y-3">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">
          In one line, what's the goal?
        </label>
        <textarea
          value={data.projectGoal}
          onChange={(e) => onUpdate({ projectGoal: e.target.value })}
          placeholder="e.g., Analyze customer behavior to improve our product recommendations"
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          What are you trying to achieve with this data processing?
        </p>
      </div>

      {/* Data Types */}
      <div className="space-y-3">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">
          What kind of data do you use?
        </label>
        <div className="flex flex-wrap gap-2">
          {data.dataTypes.map(typeId => {
            const option = DATA_TYPE_OPTIONS.find(opt => opt.id === typeId);
            return (
              <motion.div
                key={typeId}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200"
              >
                <span>{option?.label}</span>
                <button
                  onClick={() => handleDataTypeToggle(typeId)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            );
          })}
          <button
            onClick={() => setShowDataTypes(!showDataTypes)}
            className="flex items-center gap-2 border-2 border-dashed border-gray-300 text-gray-600 px-3 py-2 rounded-full text-sm hover:border-blue-500 hover:text-blue-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add data type
          </button>
        </div>

        {showDataTypes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            {DATA_TYPE_OPTIONS.map(option => (
              <button
                key={option.id}
                onClick={() => handleDataTypeToggle(option.id)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  data.dataTypes.includes(option.id)
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm opacity-75">{option.description}</div>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Data Subjects */}
      <div className="space-y-3">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Who are you collecting data from?
        </label>
        <div className="flex flex-wrap gap-2">
          {data.dataSubjects.map(subjectId => {
            const option = DATA_SUBJECT_OPTIONS.find(opt => opt.id === subjectId);
            return (
              <motion.div
                key={subjectId}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm dark:bg-green-900 dark:text-green-200"
              >
                <span>{option?.label}</span>
                <button
                  onClick={() => handleDataSubjectToggle(subjectId)}
                  className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            );
          })}
          <button
            onClick={() => setShowDataSubjects(!showDataSubjects)}
            className="flex items-center gap-2 border-2 border-dashed border-gray-300 text-gray-600 px-3 py-2 rounded-full text-sm hover:border-green-500 hover:text-green-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-green-500 dark:hover:text-green-400"
          >
            <Plus className="h-4 w-4" />
            Add data subject
          </button>
        </div>

        {showDataSubjects && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            {DATA_SUBJECT_OPTIONS.map(option => (
              <button
                key={option.id}
                onClick={() => handleDataSubjectToggle(option.id)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  data.dataSubjects.includes(option.id)
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm opacity-75">{option.description}</div>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Progress Checklist */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-4">
          Project Overview Checklist
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Project name defined', completed: !!data.projectName },
            { label: 'Project goal described', completed: !!data.projectGoal },
            { label: 'Data types selected', completed: data.dataTypes.length > 0 },
            { label: 'Data subjects identified', completed: data.dataSubjects.length > 0 },
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

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!isStepComplete}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Data Use
        </button>
      </div>
    </div>
  );
}
