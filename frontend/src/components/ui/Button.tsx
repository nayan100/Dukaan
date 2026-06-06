import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'muted';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-pos font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pos-primary/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-pos-primary text-pos-black hover:bg-opacity-90 shadow-lg shadow-pos-primary/10',
    secondary: 'bg-pos-secondary text-pos-black hover:bg-opacity-90 shadow-lg shadow-pos-secondary/10',
    danger: 'bg-pos-danger text-pos-white hover:bg-opacity-90 shadow-lg shadow-pos-danger/10',
    ghost: 'bg-transparent text-pos-primary hover:bg-pos-primary/10',
    outline: 'bg-transparent border-2 border-pos-border text-pos-white hover:border-pos-primary hover:text-pos-primary',
    muted: 'bg-pos-surface border border-pos-border text-pos-muted hover:text-pos-white hover:border-pos-muted'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
