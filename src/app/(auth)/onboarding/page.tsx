'use client'

import { useState } from 'react'
import { Step1LLM } from '@/components/onboarding/step-1-llm'
import { Step2Database } from '@/components/onboarding/step-2-database'
import { Step3Platform } from '@/components/onboarding/step-3-platform'
import { Step4Discovery } from '@/components/onboarding/step-4-discovery'
import { Step5Welcome } from '@/components/onboarding/step-5-welcome'

const STEPS = [
  { id: 1, title: 'LLM Config' },
  { id: 2, title: 'Database' },
  { id: 3, title: 'Platforms' },
  { id: 4, title: 'Discovery' },
  { id: 5, title: 'Welcome' },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of 5</span>
            <span>{STEPS[currentStep - 1].title}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
          <div className="flex justify-between">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => step.id <= currentStep && goToStep(step.id)}
                disabled={step.id > currentStep}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  step.id < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step.id === currentStep
                      ? 'border-2 border-primary text-primary'
                      : 'bg-secondary text-muted-foreground'
                } ${step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                {step.id < currentStep ? '✓' : step.id}
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex justify-center">
          {currentStep === 1 && (
            <Step1LLM onNext={() => goToStep(2)} onSkip={() => goToStep(2)} />
          )}
          {currentStep === 2 && (
            <Step2Database onNext={() => goToStep(3)} onBack={() => goToStep(1)} />
          )}
          {currentStep === 3 && (
            <Step3Platform onNext={() => goToStep(4)} onBack={() => goToStep(2)} />
          )}
          {currentStep === 4 && (
            <Step4Discovery onNext={() => goToStep(5)} onBack={() => goToStep(3)} />
          )}
          {currentStep === 5 && <Step5Welcome />}
        </div>
      </div>
    </main>
  )
}