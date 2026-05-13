import React from 'react';
import { colors } from '../../design-system/tokens';

interface CircularGaugeProps {
  value: string | number;
  unit: string;
  label: string;
  color?: string;
  size?: number;
}

export function CircularGauge({
  value,
  unit,
  label,
  color = colors.primary.success,
  size = 140
}: CircularGaugeProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          margin: '0 auto',
          borderRadius: '50%',
          border: `8px solid ${color}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            fontSize: '36px',
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
          }}
        >
          {unit}
        </div>
      </div>
      <div
        style={{
          fontSize: '15px',
          color: colors.text.secondary,
          letterSpacing: '-0.1px',
        }}
      >
        {label}
      </div>
    </div>
  );
}
