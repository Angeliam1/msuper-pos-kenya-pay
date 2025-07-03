
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  className
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const spinner = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-2',
      fullScreen && 'min-h-screen bg-white',
      className
    )}>
      <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />
      {text && (
        <p className={cn(
          'text-gray-600',
          size === 'sm' && 'text-sm',
          size === 'lg' && 'text-lg'
        )}>
          {text}
        </p>
      )}
    </div>
  );

  return fullScreen ? (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      {spinner}
    </div>
  ) : (
    spinner
  );
};

export const PageLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <LoadingSpinner size="lg" text={text} fullScreen />
);

export const ComponentLoader: React.FC<{ text?: string }> = ({ text }) => (
  <div className="flex justify-center items-center p-8">
    <LoadingSpinner size="md" text={text} />
  </div>
);
