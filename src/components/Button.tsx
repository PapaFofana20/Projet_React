import type { ButtonHTMLAttributes, ReactNode } from 'react';

const styles = {
  primary:   'bg-red-600 text-white hover:bg-red-500',
  secondary: 'bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700',
  danger:    'bg-zinc-900 text-red-500 border border-red-600 hover:bg-red-600 hover:text-white',
};

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof styles;
  children: ReactNode;
}) {
  return (
    <button
      type={props.type ?? 'button'}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}