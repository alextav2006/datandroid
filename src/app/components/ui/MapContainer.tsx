import React from 'react';
import { colors, radius } from '../../design-system/tokens';

export type MapSize = 'small' | 'medium' | 'large' | 'fullscreen';

interface MapContainerProps {
  size?: MapSize;
  children?: React.ReactNode;
  showGrid?: boolean;
}

export function MapContainer({
  size = 'medium',
  children,
  showGrid = true
}: MapContainerProps) {
  const sizeStyles: Record<MapSize, React.CSSProperties> = {
    small: {
      width: '60px',
      height: '60px',
      borderRadius: radius.sm,
    },
    medium: {
      height: '300px',
      borderRadius: radius.lg,
    },
    large: {
      height: '260px',
      borderRadius: radius.lg,
    },
    fullscreen: {
      height: '70vh',
      borderRadius: '0',
    },
  };

  return (
    <div
      style={{
        backgroundColor: colors.neutral[1],
        border: size === 'fullscreen' ? 'none' : `1px solid ${colors.border.default}`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sizeStyles[size],
      }}
    >
      {/* Minimalist map grid pattern */}
      {showGrid && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(#E5E5E7 1px, transparent 1px), linear-gradient(90deg, #E5E5E7 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.3,
        }} />
      )}
      {children}
    </div>
  );
}
