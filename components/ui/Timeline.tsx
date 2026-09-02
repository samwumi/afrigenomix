import React from 'react';
import { formatDate } from '@/lib/utils';

interface TimelineItem {
  id: string;
  event: string;
  description?: string;
  performedBy?: string;
  createdAt: Date;
  isCompleted: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {items.map((item, itemIdx) => (
          <li key={item.id}>
            <div className="relative pb-8">
              {itemIdx !== items.length - 1 && (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      item.isCompleted
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    {item.isCompleted ? (
                      <svg
                        className="h-5 w-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-white" />
                    )}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className={`text-sm font-medium ${item.isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {item.event}
                    </p>
                    {item.description && (
                      <p className="mt-0.5 text-sm text-gray-500">
                        {item.description}
                      </p>
                    )}
                    {item.performedBy && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        By {item.performedBy}
                      </p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {formatDate(item.createdAt, 'relative')}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
