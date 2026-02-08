import { MAP_REASON_TO_MESSAGE, type ReasonT } from '@/helper/reason';
import type { ToastMessage } from 'primereact/toast';
import { Toast } from 'primereact/toast';
import { createContext, type ReactNode, useContext, useRef } from 'react';

interface ToastContextType {
    showToast: (message: ToastMessage) => void;
    showSuccess: (summary: string, detail?: string) => void;
    showError: (summary: string, detail?: string) => void;
    showInfo: (summary: string, detail?: string) => void;
    showWarn: (summary: string, detail?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}

const PARSE_SUMMARY = (summary: string) => {
    return Object.keys(MAP_REASON_TO_MESSAGE).includes(summary)
        ? MAP_REASON_TO_MESSAGE[summary as ReasonT]
        : summary;
};

export function ToastProvider({ children }: ToastProviderProps) {
    const toast = useRef<Toast>(null);

    const showToast = (message: ToastMessage) => {
        toast.current?.show(message);
    };

    const showSuccess = (summary: string, detail?: string) => {
        toast.current?.show({
            severity: 'success',
            summary: PARSE_SUMMARY(summary),
            detail,
            life: 3000,
        });
    };

    const showError = (summary: string, detail?: string) => {
        toast.current?.show({
            severity: 'error',
            summary: PARSE_SUMMARY(summary),
            detail,
            life: 5000,
        });
    };

    const showInfo = (summary: string, detail?: string) => {
        toast.current?.show({
            severity: 'info',
            summary: PARSE_SUMMARY(summary),
            detail,
            life: 3000,
        });
    };

    const showWarn = (summary: string, detail?: string) => {
        toast.current?.show({
            severity: 'warn',
            summary: PARSE_SUMMARY(summary),
            detail,
            life: 4000,
        });
    };

    const value: ToastContextType = {
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarn,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toast ref={toast} position="top-right" />
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
