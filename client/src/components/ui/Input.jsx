import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Input Component - Design System
 * 
 * Consistent input field styling across the application.
 * All inputs use rounded-2xl (16px) for consistency.
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Input label text
 * @param {string} props.error - Error message to display
 * @param {string} props.helperText - Helper text below input
 * @param {React.ReactNode} props.leftIcon - Icon before input
 * @param {React.ReactNode} props.rightIcon - Icon after input
 * @param {string} props.className - Additional classes for input
 * @param {string} props.containerClassName - Additional classes for container
 * @param {'sm' | 'md' | 'lg'} props.size - Input size
 */
const Input = React.forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  containerClassName,
  size = 'md',
  type = 'text',
  required = false,
  disabled = false,
  ...props
}, ref) => {
  
  // Size styles
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };
  
  // Base input styles
  const baseStyles = 'w-full rounded-[20px] border-2 transition-all duration-[250ms] ease focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50';
  
  // Border color based on state
  const borderStyles = error 
    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:ring-offset-2' 
    : 'border-neutral-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/60 focus:ring-offset-2';
  
  return (
    <div className={cn('w-full', containerClassName)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted transition-colors duration-[250ms]">
            {leftIcon}
          </div>
        )}
        
        {/* Input Field */}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={cn(
            baseStyles,
            borderStyles,
            sizes[size],
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        
        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors duration-[250ms]">
            {rightIcon}
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p 
          id={`${props.id}-error`}
          className="mt-2 text-sm text-red-600 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {/* Helper Text */}
      {!error && helperText && (
        <p className="mt-2 text-sm text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * Textarea Component - Design System
 * 
 * Consistent textarea styling matching Input component.
 */
export const Textarea = React.forwardRef(({
  label,
  error,
  helperText,
  className,
  containerClassName,
  required = false,
  disabled = false,
  rows = 4,
  ...props
}, ref) => {
  
  // Base textarea styles
  const baseStyles = 'w-full rounded-[20px] border-2 transition-all duration-[250ms] ease focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50 px-4 py-3 text-base resize-vertical';
  
  // Border color based on state
  const borderStyles = error 
    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:ring-offset-2' 
    : 'border-neutral-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/60 focus:ring-offset-2';
  
  return (
    <div className={cn('w-full', containerClassName)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Textarea Field */}
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={cn(
          baseStyles,
          borderStyles,
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
      
      {/* Error Message */}
      {error && (
        <p 
          id={`${props.id}-error`}
          className="mt-2 text-sm text-red-600 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {/* Helper Text */}
      {!error && helperText && (
        <p className="mt-2 text-sm text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;
