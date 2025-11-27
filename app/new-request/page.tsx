'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TriageStep } from '@/../components/triage-step';
import { LocationStep } from '@/../components/location-step';
import { DetailsStep } from '@/../components/details-step';
import { ReviewStep } from '@/../components/review-step';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TriageData, LocationData } from '@/../lib/types/triagem.types';

type Step = 'triage' | 'location' | 'details' | 'review';

export default function NewRequestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('triage');
  const [triageData, setTriageData] = useState<TriageData | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [formData, setFormData] = useState<{ title: string; description: string; photos: string[] } | null>(null);

  const steps: { id: Step; label: string }[] = [
    { id: 'triage', label: 'Triagem' },
    { id: 'location', label: 'Localização' },
    { id: 'details', label: 'Detalhes' },
    { id: 'review', label: 'Revisão' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleTriageComplete = (data: TriageData) => {
    setTriageData(data);
    setCurrentStep('location');
  };

  const handleLocationComplete = (data: LocationData) => {
    setLocationData(data);
    setCurrentStep('details');
  };

  const handleDetailsComplete = (data: { title: string; description: string; photos: string[] }) => {
    setFormData(data);
    setCurrentStep('review');
  };

  const handleBack = () => {
    const stepMap: Record<Step, Step | null> = {
      triage: null,
      location: 'triage',
      details: 'location',
      review: 'details',
    };
    
    const previousStep = stepMap[currentStep];
    if (previousStep) {
      setCurrentStep(previousStep);
    }
  };

  const handleSubmitSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 oveflow-x-hidden">
      <div className="max-w-3xl mx-auto space-y-6  oveflow-x-hidden">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Nova Solicitação</h1>
          <p className="text-neutral-600 mt-2">
            Vamos entender seu problema e encontrar a melhor solução
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 ${index !== steps.length - 1 ? 'relative' : ''}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        index <= currentStepIndex
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium hidden sm:inline ${
                        index <= currentStepIndex ? 'text-neutral-900' : 'text-neutral-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>

        {currentStep === 'triage' && (
          <TriageStep onComplete={handleTriageComplete} />
        )}

        {currentStep === 'location' && (
          <LocationStep
            onComplete={handleLocationComplete}
            onBack={handleBack}
          />
        )}

        {currentStep === 'details' && triageData && (
          <DetailsStep
            triageData={triageData}
            onComplete={handleDetailsComplete}
            onBack={handleBack}
          />
        )}

        {currentStep === 'review' && triageData && locationData && formData && (
          <ReviewStep
            triageData={triageData}
            locationData={locationData}
            title={formData.title}
            description={formData.description}
            photos={formData.photos}
            onBack={handleBack}
            onSuccess={handleSubmitSuccess}
          />
        )}
      </div>
    </div>
  );
}