import React from 'react';
import { colors, radius, layout } from '../../design-system/tokens';

export type CardVariant = 'status' | 'weather' | 'route' | 'default';
export type RouteType = 'fastest' | 'efficient' | 'safe';

interface CardProps {
  variant?: CardVariant;
  routeType?: RouteType;
  children: React.ReactNode;
  height?: string;
  width?: string;
  onClick?: () => void;
}

export function Card({
  variant = 'default',
  routeType,
  children,
  height,
  width,
  onClick
}: CardProps) {
  const baseStyles: React.CSSProperties = {
    backgroundColor: colors.neutral[0],
    border: `1px solid ${colors.border.default}`,
    cursor: onClick ? 'pointer' : 'default',
  };

  const variantStyles: Record<CardVariant, React.CSSProperties> = {
    default: {
      borderRadius: radius.lg,
      padding: layout.cardPadding,
    },
    status: {
      height: '220px',
      borderRadius: radius.lg,
      padding: layout.cardPadding,
    },
    weather: {
      width: '110px',
      height: '140px',
      borderRadius: radius.lg,
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    route: {
      height: '120px',
      borderRadius: radius.lg,
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  };

  const routeColors: Record<RouteType, string> = {
    fastest: colors.primary.blue,
    efficient: colors.primary.success,
    safe: colors.primary.warning,
  };

  const routeBorder = routeType ? {
    borderLeft: `6px solid ${routeColors[routeType]}`,
  } : {};

  return (
    <div
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...routeBorder,
        ...(height && { height }),
        ...(width && { width }),
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
