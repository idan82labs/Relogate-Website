'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { siteContent } from '@/content/he';

interface QuickAction {
  key: 'editProfile' | 'viewQuestionnaire' | 'contactSupport' | 'viewBlog';
  href: string;
  disabled?: boolean;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  className?: string;
  variant?: 'horizontal' | 'grid';
}

const defaultActions: QuickAction[] = [
  { key: 'editProfile', href: '/personal-area' },
  { key: 'viewQuestionnaire', href: '/questionnaire/results' },
  { key: 'contactSupport', href: '/#contact' },
  { key: 'viewBlog', href: '/blog' },
];

/**
 * QuickActions - Quick action buttons for common personal area tasks
 */
export const QuickActions = ({
  actions = defaultActions,
  className = '',
  variant = 'horizontal',
}: QuickActionsProps) => {
  const router = useRouter();
  const content = siteContent.personalAreaDashboard.quickActions;

  const getActionIcon = (actionKey: QuickAction['key']) => {
    const icons: Record<QuickAction['key'], React.ReactNode> = {
      editProfile: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      viewQuestionnaire: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      contactSupport: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      viewBlog: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    };

    return icons[actionKey];
  };

  const handleActionClick = (action: QuickAction) => {
    if (action.disabled) return;
    router.push(action.href);
  };

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 gap-3 ${className}`}>
        {actions.map((action, index) => (
          <motion.button
            key={action.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleActionClick(action)}
            disabled={action.disabled}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-xl
              bg-white border border-[#E5E5E5]
              transition-all duration-200
              ${action.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-[#215388] hover:shadow-sm active:scale-[0.98]'
              }
            `}
          >
            <div className={`text-[#215388] ${action.disabled ? 'text-[#C6C6C6]' : ''}`}>
              {getActionIcon(action.key)}
            </div>
            <span className={`text-sm font-medium ${action.disabled ? 'text-[#C6C6C6]' : 'text-[#1D1D1B]'}`}>
              {content[action.key]}
            </span>
          </motion.button>
        ))}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={`flex gap-2 overflow-x-auto pb-2 ${className}`} dir="rtl">
      {actions.map((action, index) => (
        <motion.button
          key={action.key}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => handleActionClick(action)}
          disabled={action.disabled}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-full
            bg-white border border-[#E5E5E5] whitespace-nowrap
            transition-all duration-200
            ${action.disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-[#215388] hover:bg-[#215388]/5 active:scale-[0.98]'
            }
          `}
        >
          <div className={`${action.disabled ? 'text-[#C6C6C6]' : 'text-[#215388]'}`}>
            {getActionIcon(action.key)}
          </div>
          <span className={`text-sm font-medium ${action.disabled ? 'text-[#C6C6C6]' : 'text-[#1D1D1B]'}`}>
            {content[action.key]}
          </span>
        </motion.button>
      ))}
    </div>
  );
};
