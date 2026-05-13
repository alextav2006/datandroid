import React from 'react';
import { colors, typography, radius } from '../../design-system/tokens';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  type?: string;
}

export function Input({
  placeholder,
  value,
  onChange,
  icon,
  type = 'text'
}: InputProps) {
  return (
    <div
      style={{
        position: 'relative',
        height: '56px',
        backgroundColor: colors.neutral[1],
        borderRadius: radius.md,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        border: `1px solid ${colors.border.default}`,
      }}
    >
      {icon && <div style={{ marginRight: '12px', display: 'flex' }}>{icon}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: typography.body.fontSize,
          color: colors.text.primary,
          letterSpacing: typography.body.letterSpacing,
        }}
      />
    </div>
  );
}
