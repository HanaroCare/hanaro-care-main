'use client';

import React from 'react';

type PrimaryButtonProps = {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?:
      | 'primary'
      | 'secondary'
      | 'third'
      | 'outline'
      | 'ghost'
      | 'gold'
      | 'warning'
      | 'success'
      | 'disabled';
  fullWidth?: boolean;
  className?: string;
  icon?: React.ReactNode;
};

export default function PrimaryButton({
                                        label,
                                        disabled = false,
                                        onClick,
                                        type = 'button',
                                        variant = 'primary',
                                        fullWidth = true,
                                        className = '',
                                        icon,
                                      }: PrimaryButtonProps) {
  const isDisabled = disabled || variant === 'disabled';
  const resolvedVariant = isDisabled ? 'disabled' : variant;

  const getVariantStyles = (v: typeof resolvedVariant): string => {
    switch (v) {
      case 'primary':
        return 'bg-hana-ez-600 text-white active:bg-hana-ez-700';
      case 'secondary':
        return 'bg-hana-green-50 text-hana-green-700 active:bg-hana-green-100';
      case 'third':
        return 'bg-hana-teal-600 text-white active:bg-hana-teal-700';
      case 'outline':
        return 'border border-hana-teal-600 bg-white text-hana-teal-600 active:bg-hana-teal-50';
      case 'ghost':
        return 'bg-transparent text-hana-black-500 active:bg-hana-silver-50';
      case 'gold':
        return 'bg-hana-gold-400 text-white active:bg-hana-gold-500';
      case 'warning':
        return 'bg-hana-red-500 text-white active:bg-hana-red-600';
      case 'success':
        return 'bg-hana-green-700 text-white active:bg-hana-green-800';
      case 'disabled':
        return 'bg-hana-silver-100 text-hana-black-500 cursor-not-allowed';
      default:
        return 'bg-hana-ez-600 text-white';
    }
  };

  return (
      <button
          type={type}
          disabled={isDisabled}
          onClick={onClick}
          className={`
        ${fullWidth ? 'w-full' : 'px-6'} 
        h-14 rounded-[10px] text-[17px] font-semibold transition-all duration-200
        flex items-center justify-center gap-2
        ${getVariantStyles(resolvedVariant)}
        ${className}
      `}
      >
        {icon && <span className="flex shrink-0 items-center justify-center">{icon}</span>}
        <span>{label}</span>
      </button>
  );
}
