/**
 * Assessment Page
 * Modern guided DPIA flow with 6 clear steps
 */
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GuidedAssessmentFlow } from '@/components/GuidedAssessmentFlow';
import { SkeletonQuestionCard } from '@/components/ui/skeleton';

function AssessmentContent() {
    const searchParams = useSearchParams();
    const assessmentId = searchParams.get('id');

    const handleComplete = (data: any) => {
        console.log('Assessment completed:', data);
        // Handle completion logic here
    };

    return (
        <GuidedAssessmentFlow
            assessmentId={assessmentId || undefined}
            onComplete={handleComplete}
        />
    );
}

export default function AssessmentPage() {
    return (
        <Suspense fallback={<SkeletonQuestionCard />}>
            <AssessmentContent />
        </Suspense>
    );
}