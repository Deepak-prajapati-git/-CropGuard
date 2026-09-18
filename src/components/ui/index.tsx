import React from 'react';
import { cn } from '../../lib/utils';

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const base = 'relative inline-flex items-center justify-center gap-2 font-semibold rounded-[12px] transition-all duration-300 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group';

  const variants = {
    primary: 'bg-gradient-to-br from-[#125134] to-[#0d3d27] text-white shadow-[0_4px_12px_rgba(23,74,53,0.3)] hover:shadow-[0_6px_20px_rgba(23,74,53,0.4)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-[#125134]',
    secondary: 'bg-[#d3e8d9] text-[#125134] hover:bg-[#c2decb] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-[#125134]',
    ghost: 'bg-transparent text-[#125134] hover:bg-[#EEF1E9] active:bg-[#d3e8d9] focus-visible:outline-[#125134]',
    danger: 'bg-gradient-to-br from-[#DC2626] to-[#b91c1c] text-white shadow-[0_4px_12px_rgba(220,38,38,0.3)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-[#DC2626]',
    outline: 'bg-white/50 backdrop-blur-sm border border-black/10 text-[#111827] hover:bg-white/80 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-[#125134]',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm gap-1.5',
    md: 'h-11 px-5 text-sm',
    lg: 'h-14 px-8 text-base',
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {loading ? (
        <svg className="animate-spin h-5 w-5 relative z-10" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0 h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110">{icon}</span>
      ) : null}
      <span className="relative z-10">{children}</span>
      {iconRight && !loading && <span className="shrink-0 h-4 w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1">{iconRight}</span>}
    </button>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  padding = 'md',
  hoverable = false,
  className,
  children,
  ...props
}) => {
  const paddings = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6' };
  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-xl border border-white/40 rounded-[16px]',
        'shadow-[0_8px_32px_rgba(23,74,53,0.06),0_1px_2px_rgba(23,74,53,0.04)]',
        paddings[padding],
        hoverable && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(23,74,53,0.1)] hover:border-white/60 hover:bg-white/90 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant = 'healthy' | 'low' | 'moderate' | 'high' | 'critical' | 'info' | 'warning' | 'demo';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'info',
  children,
  className,
  size = 'sm',
}) => {
  const styles: Record<BadgeVariant, string> = {
    healthy: 'bg-[#DCFCE7] text-[#2F7D4A]',
    low: 'bg-[#DDEBDF] text-[#6F8F55]',
    moderate: 'bg-[#FEF3C7] text-[#B7791F]',
    high: 'bg-[#FDECEA] text-[#B54747]',
    critical: 'bg-[#FDE8E8] text-[#7B1515]',
    info: 'bg-[#EEF1E9] text-[#66736A]',
    warning: 'bg-[#FEF3C7] text-[#B7791F]',
    demo: 'bg-[#E8F4FD] text-[#1a6fa8] border border-[#bee3f8]',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 font-medium rounded-full',
      styles[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon,
  fullWidth = true,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#1E2923]">
          {label}
          {props.required && <span className="text-[#B54747] ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#66736A] h-4 w-4">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full h-10 px-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px]',
            'text-[#1E2923] placeholder:text-[#66736A]',
            'focus:outline-none focus:ring-2 focus:ring-[#174A35] focus:border-transparent',
            'transition-colors duration-150',
            error && 'border-[#B54747] focus:ring-[#B54747]',
            icon && 'pl-9',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-[#B54747] flex items-center gap-1" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-[#66736A]">{hint}</p>
      )}
    </div>
  );
};

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  fullWidth = true,
  className,
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[#1E2923]">
          {label}
          {props.required && <span className="text-[#B54747] ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full h-10 px-3 text-sm bg-white border border-[#DDE3DB] rounded-[10px]',
          'text-[#1E2923]',
          'focus:outline-none focus:ring-2 focus:ring-[#174A35] focus:border-transparent',
          'transition-colors duration-150',
          error && 'border-[#B54747] focus:ring-[#B54747]',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-[#B54747]" role="alert">{error}</p>}
    </div>
  );
};

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  fullWidth = true,
  className,
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-[#1E2923]">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full px-3 py-2.5 text-sm bg-white border border-[#DDE3DB] rounded-[10px]',
          'text-[#1E2923] placeholder:text-[#66736A]',
          'focus:outline-none focus:ring-2 focus:ring-[#174A35] focus:border-transparent',
          'resize-vertical min-h-[80px]',
          error && 'border-[#B54747]',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#B54747]" role="alert">{error}</p>}
      {hint && !error && <p className="text-xs text-[#66736A]">{hint}</p>}
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, rounded }) => (
  <div className={cn('skeleton', rounded && 'rounded-full', className)} aria-hidden="true" />
);

// ─── Divider ──────────────────────────────────────────────────────────────────

export const Divider: React.FC<{ className?: string }> = ({ className }) => (
  <hr className={cn('border-0 border-t border-[#DDE3DB]', className)} />
);

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <div className={cn('flex flex-col items-center justify-center text-center py-12 px-4', className)}>
    {icon && (
      <div className="h-14 w-14 rounded-full bg-[#EEF1E9] flex items-center justify-center text-[#66736A] mb-4">
        {icon}
      </div>
    )}
    <h3 className="text-base font-semibold text-[#1E2923] mb-1">{title}</h3>
    {description && <p className="text-sm text-[#66736A] max-w-xs mb-4">{description}</p>}
    {action}
  </div>
);

// ─── Confidence Bar ───────────────────────────────────────────────────────────

interface ConfidenceBarProps {
  confidence: number;
  showLabel?: boolean;
  showText?: boolean;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  showLabel = true,
  showText = true,
}) => {
  const pct = Math.round(confidence * 100);
  const color = confidence >= 0.8 ? '#2F7D4A' : confidence >= 0.6 ? '#B7791F' : '#B54747';
  const label = confidence >= 0.8 ? 'High' : confidence >= 0.6 ? 'Medium' : 'Low';

  return (
    <div className="w-full">
      {showText && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-[#66736A]">Confidence</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#1E2923]">{pct}%</span>
            {showLabel && (
              <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: `${color}1a`, color }}>
                {label}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Confidence: ${pct}%`}
        />
      </div>
    </div>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

export const Spinner: React.FC<{ size?: number; className?: string }> = ({
  size = 20,
  className,
}) => (
  <svg
    className={cn('animate-spin', className)}
    style={{ width: size, height: size }}
    viewBox="0 0 24 24"
    fill="none"
    aria-label="Loading"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ─── Checkbox Row ─────────────────────────────────────────────────────────────

interface CheckboxRowProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const CheckboxRow: React.FC<CheckboxRowProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
}) => (
  <label className={cn(
    'flex items-center gap-3 p-3 rounded-[10px] cursor-pointer',
    'hover:bg-[#F7F8F3] transition-colors',
    disabled && 'opacity-50 cursor-not-allowed'
  )}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      disabled={disabled}
      className="w-4 h-4 rounded accent-[#174A35] cursor-pointer"
    />
    <span className="text-sm text-[#1E2923]">{label}</span>
  </label>
);

// ─── Info Callout ─────────────────────────────────────────────────────────────

interface CalloutProps {
  type?: 'info' | 'warning' | 'danger' | 'success';
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Callout: React.FC<CalloutProps> = ({
  type = 'info',
  title,
  children,
  icon,
  className,
}) => {
  const styles = {
    info: 'bg-[#EEF1E9] border-[#DDE3DB] text-[#66736A]',
    warning: 'bg-[#FEF3C7] border-[#F6C14F] text-[#B7791F]',
    danger: 'bg-[#FDECEA] border-[#f5b5b5] text-[#B54747]',
    success: 'bg-[#DCFCE7] border-[#a7f3c5] text-[#2F7D4A]',
  };

  return (
    <div className={cn(
      'flex gap-3 p-4 rounded-[10px] border',
      styles[type],
      className
    )}>
      {icon && <div className="shrink-0 h-5 w-5 mt-0.5">{icon}</div>}
      <div>
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};
