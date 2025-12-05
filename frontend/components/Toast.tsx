/**
 * Toast notification component
 */

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle2,
            bgColor: 'bg-emerald-500',
            iconColor: 'text-white',
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-500',
            iconColor: 'text-white',
        },
        info: {
            icon: AlertCircle,
            bgColor: 'bg-blue-500',
            iconColor: 'text-white',
        },
    };

    const { icon: Icon, bgColor, iconColor } = config[type];

    return (
        <div
            className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px] max-w-md animate-slide-in-right`}
        >
            <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
            <p className="flex-1 font-medium">{message}</p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// Toast container for multiple toasts
interface ToastContainerProps {
    toasts: Array<{ id: string; message: string; type: ToastType }>;
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => onRemove(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
}

// Hook for using toasts
export function useToast() {
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return { toasts, showToast, removeToast };
}
