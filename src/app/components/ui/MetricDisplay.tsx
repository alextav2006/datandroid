import React from 'react';
import { colors, typography } from '../../design-system/tokens';

interface MetricDisplayProps {
  label: string;
  value: string | number;
  unit: string;
  size?: 'default' | 'large';
}

export function MetricDisplay({
  label,
  value,
  unit,
  size = 'default'
}: MetricDisplayProps) {
  const valueSize = size === 'large' ? '36px' : '28px';

  return (
    <div>
      <div
        style={{
          fontSize: typography.caption.fontSize,
          color: colors.text.secondary,
          marginBottom: '8px',
          letterSpacing: typography.caption.letterSpacing,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: valueSize,
          fontWeight: 600,
          color: colors.text.primary,
          letterSpacing: '-0.5px',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '15px',
          color: colors.text.secondary,
          marginTop: '2px',
        }}
      >
        {unit}
      </div>
    </div>
  );
}
