import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, RouteType } from './Card';
import { colors } from '../../design-system/tokens';

interface RouteCardProps {
  type: RouteType;
  title: string;
  distance: string;
  time: string;
  wind: string;
  onClick?: () => void;
}

export function RouteCard({ type, title, distance, time, wind, onClick }: RouteCardProps) {
  const routeColors: Record<RouteType, string> = {
    fastest: colors.primary.blue,
    efficient: colors.primary.success,
    safe: colors.primary.warning,
  };

  return (
    <Card variant="route" routeType={type} onClick={onClick}>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '17px',
            fontWeight: 600,
            color: colors.text.primary,
            marginBottom: '12px',
            letterSpacing: '-0.2px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            fontSize: '13px',
            color: colors.text.secondary,
          }}
        >
          <div>{distance}</div>
          <div>•</div>
          <div>{time}</div>
          <div>•</div>
          <div>{wind}</div>
        </div>
      </div>
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: colors.neutral[1],
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MapPin size={24} color={routeColors[type]} strokeWidth={2} />
      </div>
    </Card>
  );
}
