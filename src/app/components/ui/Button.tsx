import React from 'react';
import { colors, typography, radius } from '../../design-system/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'icon';
export type ButtonSize = 'default' | 'icon';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'default',
  children,
  icon,
  onClick,
  disabled = false
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'opacity 0.2s',
    fontWeight: 600,
    letterSpacing: '-0.2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: disabled ? 0.5 : 1,
  };

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      height: '56px',
      borderRadius: radius.xl,
      backgroundColor: colors.primary.blue,
      color: colors.text.inverse,
      fontSize: typography.body.fontSize,
      padding: '0 24px',
      width: '100%',
    },
    secondary: {
      height: '56px',
      borderRadius: radius.md,
      backgroundColor: colors.neutral[1],
      border: `1px solid ${colors.border.default}`,
      color: colors.text.primary,
      fontSize: typography.body.fontSize,
      padding: '0 20px',
    },
    icon: {
      width: '56px',
      height: '56px',
      borderRadius: radius.md,
      backgroundColor: colors.neutral[1],
      border: `1px solid ${colors.border.default}`,
      padding: 0,
    },
  };

  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    default: {},
    icon: {
      width: '110px',
      flexDirection: 'column',
      gap: '4px',
    },
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...(size === 'icon' && variant === 'secondary' ? sizeStyles.icon : {}),
      }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.opacity = '0.7')}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.opacity = '1')}
    >
      {icon}
      {children}
    </button>
  );
}
