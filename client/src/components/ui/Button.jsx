import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Button Component - Design System
 * 
 * Consistent button styling across the application with multiple variants and sizes.
 * All buttons use rounded-2xl (16px) for consistency.
 * 
 * @param {Object} props - Component props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'accent'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.disabled - Disable button
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ReactNode} props.leftIcon - Icon before text
 * @param {React.ReactNode} props.rightIcon - Icon after text
 * @param {string} props.className - Additional classes
 * @param {Function} props.onClick - Click handler
 */
const Button = React.forwardRef(({ 
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  leftIcon,
  rightIcon,
  className,
  type = 'button',
  ...props
}, ref) => {
  
  // Base styles - consistent across all variants
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-[20px] cursor-pointer transition-all duration-[250ms] ease focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';
  
  // Variant styles
  const variants = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] active:bg-neutral-950 focus:ring-neutral-900',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 hover:shadow-sm active:bg-neutral-300 focus:ring-neutral-400',
    outline: 'border-2 border-neutral-200 text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 hover:shadow-sm focus:ring-neutral-400',
    ghost: 'text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200 focus:ring-neutral-400',
    destructive: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-[var(--shadow-soft)] active:bg-red-700 focus:ring-red-500',
    accent: 'bg-amber-400 text-neutral-900 hover:bg-amber-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow-amber)] active:bg-amber-500 focus:ring-amber-400 font-bold',
  };
  
  // Size styles
  const sizes = {
    sm: 'px-6 py-2.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };
  
  // Loading spinner component
  const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
  
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && leftIcon && <span className="flex items-center">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
