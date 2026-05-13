import React from 'react';
import { colors, radius, layout } from '../../design-system/tokens';

interface BottomPanelProps {
  children: React.ReactNode;
  height?: string;
}

export function BottomPanel({ children, height = '240px' }: BottomPanelProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height,
        backgroundColor: colors.neutral[0],
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
        border: `1px solid ${colors.border.default}`,
        borderBottom: 'none',
        padding: layout.xl,
        boxShadow: '0 -2px 20px rgba(0, 0, 0, 0.03)',
      }}
    >
      {children}
    </div>
  );
}
