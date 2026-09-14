import { ReactNode } from 'react';
import { Info, AlertTriangle, CheckCircle, Lightbulb, HelpCircle } from 'lucide-react';

interface ArticleCalloutProps {
  type?: 'info' | 'warning' | 'success' | 'tip' | 'question';
  title?: string;
  children: ReactNode;
}

const calloutConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-900',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
  },
  tip: {
    icon: Lightbulb,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    titleColor: 'text-purple-900',
  },
  question: {
    icon: HelpCircle,
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    iconColor: 'text-teal-600',
    titleColor: 'text-teal-900',
  },
};

export function ArticleCallout({ type = 'info', title, children }: ArticleCalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-l-4 rounded-r-lg p-6 my-6`}>
      <div className="flex items-start gap-4">
        <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-1`} />
        <div className="flex-1">
          {title && (
            <h4 className={`font-bold ${config.titleColor} mb-2 text-lg`}>
              {title}
            </h4>
          )}
          <div className="text-gray-800">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
