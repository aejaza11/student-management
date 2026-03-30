import { X } from 'lucide-react';
import clsx from 'clsx';

import type { FormEvent, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  submitText?: string;
  isLoading?: boolean;
}

export default function Modal({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  submitText = 'Save',
  isLoading = false,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-enter">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-effect rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto card-shadow shadow-elevated animate-flip">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">
          {children}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={clsx('btn-primary flex-1', isLoading && 'opacity-70 cursor-not-allowed')}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="spinner" />
                  {submitText}
                </span>
              ) : (
                submitText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

export function FormField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
        {label}
        {required && <span className="text-red-600 ml-1" aria-label="required">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={clsx('input-field', error && 'border-red-500 focus:ring-red-500')}
        required={required}
      />
      {error && (
        <p className="text-red-600 text-sm font-medium">{error}</p>
      )}
    </div>
  );
}
