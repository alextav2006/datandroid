import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { colors, radius } from '../../design-system/tokens';

interface AlertBannerProps {
  message: string;
  type?: 'warning' | 'danger';
}

export function AlertBanner({ message, type = 'warning' }: AlertBannerProps) {
  const styles = {
    warning: {
      backgroundColor: colors.alert.warningBg,
      borderColor: colors.border.warning,
      textColor: colors.alert.warningText,
      iconColor: colors.alert.warningText,
    },
    danger: {
      backgroundColor: '#FFE5E5',
      borderColor: '#FFB3B3',
      textColor: '#8B0000',
      iconColor: '#8B0000',
    },
  };

  const currentStyle = styles[type];

  return (
    <div
      style={{
        height: '60px',
        backgroundColor: currentStyle.backgroundColor,
        borderRadius: radius.md,
        border: `1px solid ${currentStyle.borderColor}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '12px',
      }}
    >
      <AlertTriangle size={24} color={currentStyle.iconColor} strokeWidth={2} />
      <span
        style={{
          fontSize: '15px',
          fontWeight: 500,
          color: currentStyle.textColor,
          letterSpacing: '-0.1px',
        }}
      >
        {message}
      </span>
    </div>
  );
}
