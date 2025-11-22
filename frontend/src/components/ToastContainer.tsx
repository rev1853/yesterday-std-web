import { createContext, useContext, useState, ReactNode } from 'react';
import CustomToast from './CustomToast';

interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastContextType {
  showToast: (type: 'success' | 'error', message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          style={{ 
            position: 'fixed',
            top: `${32 + index * 80}px`,
            right: '32px',
            zIndex: 100
          }}
        >
          <CustomToast
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
