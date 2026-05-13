import React from 'react';
import { Wind, CloudRain, Eye, Sun } from 'lucide-react';
import { Card } from './Card';
import { colors } from '../../design-system/tokens';

export type WeatherType = 'wind' | 'rain' | 'visibility' | 'sun';

interface WeatherCardProps {
  type: WeatherType;
  value: string | number;
  unit: string;
}

export function WeatherCard({ type, value, unit }: WeatherCardProps) {
  const icons: Record<WeatherType, { icon: React.ReactNode; color: string }> = {
    wind: { icon: <Wind size={32} strokeWidth={1.5} />, color: colors.primary.blue },
    rain: { icon: <CloudRain size={32} strokeWidth={1.5} />, color: colors.text.secondary },
    visibility: { icon: <Eye size={32} strokeWidth={1.5} />, color: colors.primary.success },
    sun: { icon: <Sun size={32} strokeWidth={1.5} />, color: colors.primary.warning },
  };

  const { icon, color } = icons[type];

  return (
    <Card variant="weather">
      <div style={{ color, marginBottom: '12px' }}>
        {icon}
      </div>
      <div
        style={{
          fontSize: '28px',
          fontWeight: 600,
          color: colors.text.primary,
          letterSpacing: '-0.5px',
          marginBottom: '4px',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '13px',
          color: colors.text.secondary,
          textAlign: 'center',
        }}
      >
        {unit}
      </div>
    </Card>
  );
}
