import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-amber-500 text-white hover:bg-amber-400 shadow-sm focus:ring-2 focus:ring-amber-400/40',
  secondary:
    'bg-white text-[#1a1a2e] border border-[#e5e5ea] hover:bg-[#f4f4f6] focus:ring-2 focus:ring-[#e5e5ea]',
  ghost:
    'bg-transparent text-[#8a8a9a] hover:bg-[#f4f4f6] hover:text-[#1a1a2e] focus:ring-2 focus:ring-[#e5e5ea]',
  danger:
    'bg-red-500 text-white hover:bg-red-400 shadow-sm focus:ring-2 focus:ring-red-400/40',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-sm px-5 py-2.5',
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}) {
  return (
    <button
      type={props.type ?? 'button'}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-visible:outline-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}