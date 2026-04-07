'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const success = (msg: string) => addToast(msg, 'success');
  const error = (msg: string) => addToast(msg, 'error');
  const info = (msg: string) => addToast(msg, 'info');

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      
      {/* Toast Render Area */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 min-w-[300px] max-w-sm rounded-[1rem] shadow-medical-float border animate-fade-in-up backdrop-blur-md ${
              toast.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' :
              toast.type === 'error' ? 'bg-red-50/95 border-red-200 text-red-800' :
              'bg-blue-50/95 border-blue-200 text-blue-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle size={20} className="text-green-600" />}
              {toast.type === 'error' && <AlertTriangle size={20} className="text-red-600" />}
              {toast.type === 'info' && <CheckCircle size={20} className="text-blue-600" />}
            </div>
            <div className="flex-1 text-[15px] font-bold leading-tight">
              {toast.message}
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 opacity-50 hover:opacity-100 transition-opacity rounded-md hover:bg-black/5"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
