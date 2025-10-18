/**
 * Assessment Page
 * Multi-step questionnaire for conducting DPIA
 */
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Save, Check, Loader2, Home } from 'lucide-react';
import Link from 'next/link';
import { assessmentApi, responseApi, questionsApi } from '@/utils/api';
import type { Assessment, QuestionCategory, Response } from '@/utils/types';
import { QuestionCard } from '@/components/QuestionCard';
import { RiskIndicator } from '@/components/RiskBadge';
import { calculateProgress } from '@/utils/helpers';

export default function AssessmentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const assessmentId = searchParams.get('id');

    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [categories, setCategories] = useState<QuestionCategory[]>([]);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [responses, setResponses] = useState<Response[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (assessmentId) {
            loadData();
        }
    }, [assessmentId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [assessmentRes, questionsRes, responsesRes] = await Promise.all([
                assessmentApi.get(assessmentId!),
                questionsApi.getAll(),
                responseApi.list(assessmentId!),
            ]);

            setAssessment(assessmentRes.data);
            setCategories(questionsRes.data.categories);
            setResponses(responsesRes.data);

            // Load existing answers
            const answerMap: Record<string, any> = {};
            responsesRes.data.forEach((response: Response) => {
                answerMap[response.question_id] = response.answer;
            });
            setAnswers(answerMap);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentCategory = categories[currentCategoryIndex];
    const currentQuestion = currentCategory?.questions[currentQuestionIndex];
    const totalQuestions = categories.reduce((sum, cat) => sum + cat.questions.length, 0);
    const answeredQuestions = Object.keys(answers).length;
    const progress = calculateProgress(totalQuestions, answeredQuestions);

    const handleAnswer = async (answer: any) => {
        if (!currentQuestion) return;

        setAnswers({ ...answers, [currentQuestion.id]: answer });

        // Auto-save
        try {
            setSaving(true);
            await responseApi.create(assessmentId!, {
                question_id: currentQuestion.id,
                category: currentQuestion.category,
                answer: { value: answer },
            });
            await loadData(); // Reload to get updated risk scores
        } catch (error) {
            console.error('Failed to save response:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < currentCategory.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (currentCategoryIndex < categories.length - 1) {
            setCurrentCategoryIndex(currentCategoryIndex + 1);
            setCurrentQuestionIndex(0);
        } else {
            // Completed
            router.push(`/report?id=${assessmentId}`);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else if (currentCategoryIndex > 0) {
            setCurrentCategoryIndex(currentCategoryIndex - 1);
            const prevCategory = categories[currentCategoryIndex - 1];
            setCurrentQuestionIndex(prevCategory.questions.length - 1);
        }
    };

    const canGoNext = currentQuestion && answers[currentQuestion.id] !== undefined;
    const canGoPrevious = currentCategoryIndex > 0 || currentQuestionIndex > 0;
    const isLastQuestion =
        currentCategoryIndex === categories.length - 1 &&
        currentQuestionIndex === currentCategory?.questions.length - 1;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!assessment || !currentCategory) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">Assessment not found</p>
                    <Link
                        href="/"
                        className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="mx-auto max-w-5xl px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <Home className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                                    {assessment.title}
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {currentCategory.title}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {saving && (
                                <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </span>
                            )}
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {progress}% Complete
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <motion.div
                            className="h-full bg-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Category Info */}
                        <motion.div
                            key={`category-${currentCategoryIndex}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            <div className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                                Step {currentCategoryIndex + 1} of {categories.length}
                            </div>
                            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {currentCategory.title}
                            </h2>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                {currentCategory.description}
                            </p>
                        </motion.div>

                        {/* Question Card */}
                        {currentQuestion && (
                            <QuestionCard
                                key={currentQuestion.id}
                                question={currentQuestion}
                                answer={answers[currentQuestion.id]}
                                onAnswer={handleAnswer}
                                showRisk
                            />
                        )}

                        {/* Navigation */}
                        <div className="mt-6 flex items-center justify-between">
                            <button
                                onClick={handlePrevious}
                                disabled={!canGoPrevious}
                                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </button>

                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Question {currentQuestionIndex + 1} of {currentCategory.questions.length}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!canGoNext}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isLastQuestion ? (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Complete
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Progress Card */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
                                Progress
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Questions Answered
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {answeredQuestions} / {totalQuestions}
                                        </span>
                                    </div>
                                </div>
                                {assessment.overall_risk_score > 0 && (
                                    <RiskIndicator score={assessment.overall_risk_score} />
                                )}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
                                Categories
                            </h3>
                            <div className="space-y-2">
                                {categories.map((category, index) => {
                                    const categoryAnswers = category.questions.filter(
                                        (q) => answers[q.id] !== undefined
                                    ).length;
                                    const categoryProgress =
                                        (categoryAnswers / category.questions.length) * 100;
                                    const isCurrent = index === currentCategoryIndex;
                                    const isCompleted = categoryProgress === 100;

                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => {
                                                setCurrentCategoryIndex(index);
                                                setCurrentQuestionIndex(0);
                                            }}
                                            className={`w-full rounded-lg border p-3 text-left transition-all ${isCurrent
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
                                                    : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`text-sm font-medium ${isCurrent
                                                            ? 'text-blue-900 dark:text-blue-100'
                                                            : 'text-gray-900 dark:text-gray-100'
                                                        }`}
                                                >
                                                    {category.title}
                                                </span>
                                                {isCompleted && (
                                                    <Check className="h-4 w-4 text-green-600" />
                                                )}
                                            </div>
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                                    <div
                                                        className="h-full bg-blue-600 transition-all"
                                                        style={{ width: `${categoryProgress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                    {categoryAnswers}/{category.questions.length}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

