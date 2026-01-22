'use client';

import { motion } from 'framer-motion';
import { Card } from './Card';
import { siteContent } from '@/content/he';

type StepStatus = 'completed' | 'inProgress' | 'pending' | 'locked';

interface JourneyStep {
  key: 'questionnaire' | 'payment' | 'report' | 'planning';
  status: StepStatus;
}

interface JourneyProgressProps {
  steps: JourneyStep[];
  className?: string;
  variant?: 'card' | 'inline';
}

/**
 * JourneyProgress - Visual step indicator for user's relocation journey
 */
export const JourneyProgress = ({
  steps,
  className = '',
  variant = 'card',
}: JourneyProgressProps) => {
  const content = siteContent.personalAreaDashboard.journeyProgress;

  const getStepIcon = (stepKey: JourneyStep['key'], status: StepStatus) => {
    // Completed checkmark
    if (status === 'completed') {
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }

    // Locked lock icon
    if (status === 'locked') {
      return (
        <svg className="w-4 h-4 text-[#C6C6C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    }

    // Step-specific icons
    const icons: Record<JourneyStep['key'], React.ReactNode> = {
      questionnaire: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      payment: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      report: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      planning: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    };

    return icons[stepKey];
  };

  const getStepStyles = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-[#239083] border-[#239083]',
          text: 'text-[#239083]',
          line: 'bg-[#239083]',
        };
      case 'inProgress':
        return {
          circle: 'bg-[#215388] border-[#215388]',
          text: 'text-[#215388]',
          line: 'bg-[#C6C6C6]',
        };
      case 'pending':
        return {
          circle: 'bg-white border-[#C6C6C6] text-[#706F6F]',
          text: 'text-[#706F6F]',
          line: 'bg-[#C6C6C6]',
        };
      case 'locked':
        return {
          circle: 'bg-[#F7F7F7] border-[#E5E5E5] text-[#C6C6C6]',
          text: 'text-[#C6C6C6]',
          line: 'bg-[#E5E5E5]',
        };
    }
  };

  const getStatusLabel = (status: StepStatus) => {
    return content.stepStatus[status];
  };

  const renderSteps = () => (
    <div className="flex items-center justify-between w-full" dir="rtl">
      {steps.map((step, index) => {
        const styles = getStepStyles(step.status);
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.key}
            className={`flex items-center ${isLast ? '' : 'flex-1'}`}
          >
            {/* Step circle and label */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${styles.circle}`}
              >
                {getStepIcon(step.key, step.status)}
              </motion.div>
              <span className={`text-xs mt-2 font-medium ${styles.text}`}>
                {content.steps[step.key]}
              </span>
              {variant === 'card' && (
                <span className="text-[10px] text-[#B2B2B2] mt-0.5">
                  {getStatusLabel(step.status)}
                </span>
              )}
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 h-0.5 mx-2 relative top-[-12px]">
                <div className="absolute inset-0 bg-[#E5E5E5]" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: step.status === 'completed' ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`absolute inset-y-0 right-0 ${styles.line}`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  if (variant === 'inline') {
    return <div className={className}>{renderSteps()}</div>;
  }

  return (
    <Card padding="lg" className={`bg-white ${className}`}>
      <h3 className="text-lg font-medium text-[#1D1D1B] text-right mb-6">
        {content.title}
      </h3>
      {renderSteps()}
    </Card>
  );
};
