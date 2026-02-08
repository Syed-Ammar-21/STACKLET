
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <Card className="error-message bg-red-50 border-red-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <p className="text-red-800 font-medium">{message}</p>
          </div>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="text-red-600 hover:text-red-800 font-bold text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorMessage;
