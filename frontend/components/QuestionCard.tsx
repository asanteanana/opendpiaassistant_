/**
 * Question Card Component
 * Displays a question with appropriate input type
 */
'use client';

import { motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type { Question } from '@/utils/types';
import { cn } from '@/utils/helpers';

interface QuestionCardProps {
    question: Question;
    answer?: any;
    onAnswer: (answer: any) => void;
    showRisk?: boolean;
    className?: string;
}

export function QuestionCard({
    question,
    answer,
    onAnswer,
    showRisk = false,
    className,
}: QuestionCardProps) {
    const [showHelp, setShowHelp] = useState(false);

    const renderInput = () => {
        switch (question.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={answer || ''}
                        onChange={(e) => onAnswer(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        placeholder="Enter your answer"
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        value={answer || ''}
                        onChange={(e) => onAnswer(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        placeholder="Enter your answer"
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={answer || ''}
                        onChange={(e) => onAnswer(parseFloat(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        placeholder="Enter a number"
                    />
                );

            case 'select':
                return (
                    <select
                        value={answer || ''}
                        onChange={(e) => onAnswer(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    >
                        <option value="">Select an option</option>
                        {question.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'radio':
                return (
                    <div className="space-y-3">
                        {question.options?.map((option) => (
                            <label
                                key={option.value}
                                className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
                            >
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option.value}
                                    checked={answer === option.value}
                                    onChange={(e) => onAnswer(e.target.value)}
                                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-gray-900 dark:text-gray-100">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            case 'multi-select':
                return (
                    <div className="space-y-3">
                        {question.options?.map((option) => (
                            <label
                                key={option.value}
                                className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
                            >
                                <input
                                    type="checkbox"
                                    value={option.value}
                                    checked={Array.isArray(answer) && answer.includes(option.value)}
                                    onChange={(e) => {
                                        const currentAnswer = Array.isArray(answer) ? answer : [];
                                        if (e.target.checked) {
                                            onAnswer([...currentAnswer, option.value]);
                                        } else {
                                            onAnswer(currentAnswer.filter((v) => v !== option.value));
                                        }
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-gray-900 dark:text-gray-100">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
            className={cn(
                'rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900',
                className
            )}
        >
            {/* Question Header */}
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {question.text}
                        {question.required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </h3>
                    {question.help_text && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {question.help_text}
                        </p>
                    )}
                </div>

                {/* GDPR Articles Badge */}
                {question.gdpr_articles.length > 0 && (
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900"
                    >
                        <HelpCircle className="h-3 w-3" />
                        GDPR {question.gdpr_articles.join(', ')}
                    </button>
                )}
            </div>

            {/* Help Text Panel */}
            {showHelp && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-900 dark:bg-blue-950/50 dark:text-blue-200"
                >
                    Relevant GDPR Articles: {question.gdpr_articles.join(', ')}
                </motion.div>
            )}

            {/* Input Field */}
            <div className="mb-4">{renderInput()}</div>

            {/* Risk Indicator */}
            {showRisk && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                            className="h-full bg-blue-500"
                            style={{ width: `${question.risk_weight * 100}%` }}
                        />
                    </div>
                    <span className="tabular-nums">
                        {(question.risk_weight * 100).toFixed(0)}%
                    </span>
                </div>
            )}
        </motion.div>
    );
}

