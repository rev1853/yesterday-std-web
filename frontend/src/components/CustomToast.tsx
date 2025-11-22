import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface CustomToastProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function CustomToast({ type, message, onClose, duration = 3000 }: CustomToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-8 right-8 z-[100] animate-slideInRight">
      <div className={`
        min-w-[320px] max-w-[500px] px-6 py-4 rounded-xl shadow-2xl
        flex items-start gap-4
        ${type === 'success' ? 'bg-green-600/90' : 'bg-red-600/90'}
        backdrop-blur-sm border-2
        ${type === 'success' ? 'border-green-400/20' : 'border-red-400/20'}
      `}>
        {type === 'success' ? (
          <CheckCircle className="w-6 h-6 text-white shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-6 h-6 text-white shrink-0 mt-0.5" />
        )}
        
        <p className="flex-1 font-['Inter'] text-[14px] text-white leading-relaxed">
          {message}
        </p>
        
        <button
          onClick={onClose}
          className="shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
