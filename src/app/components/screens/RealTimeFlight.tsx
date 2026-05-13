import React from 'react';
import { Wind, RotateCcw, Leaf, Home } from 'lucide-react';
import {
  Button,
  AlertBanner,
  BottomPanel,
  MetricDisplay,
} from '../ui';
import { colors, spacing } from '../../design-system/tokens';

export function RealTimeFlight() {
  return (
    <div className="min-h-screen bg-white" style={{ position: 'relative' }}>
      {/* Fullscreen Map */}
      <div
        style={{
          height: '70vh',
          backgroundColor: colors.neutral[1],
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Minimalist map grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${colors.border.default} 1px, transparent 1px), linear-gradient(90deg, ${colors.border.default} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.3
        }} />

        {/* Route line (simplified curved path) */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        >
          <path
            d="M 50 80% Q 200 50%, 350 20%"
            stroke={colors.primary.blue}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Drone icon position */}
          <circle cx="200" cy="50%" r="12" fill={colors.primary.blue} />
          <circle cx="200" cy="50%" r="6" fill="white" />
        </svg>

        {/* Wind indicator overlay (top-right) */}
        <div
          style={{
            position: 'absolute',
            top: spacing.lg,
            right: spacing.lg,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            border: `1px solid ${colors.border.default}`
          }}
        >
          <Wind size={20} color={colors.primary.blue} strokeWidth={2} />
          <span style={{ fontSize: '15px', fontWeight: 600, color: colors.text.primary }}>
            14 km/h
          </span>
        </div>

        {/* Alert Banner */}
        <div
          style={{
            position: 'absolute',
            bottom: spacing.xl,
            left: spacing.lg,
            right: spacing.lg
          }}
        >
          <AlertBanner message="Vento lateral forte — reduzir para 22 km/h" type="warning" />
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: `0 ${spacing.xl}`, marginTop: spacing.xl }}>
        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.xl, justifyContent: 'center' }}>
          <Button variant="secondary" size="icon" icon={<RotateCcw size={20} color={colors.text.primary} />}>
            <span style={{ fontSize: '13px' }}>Recalcular</span>
          </Button>
          <Button variant="secondary" size="icon" icon={<Leaf size={20} color={colors.primary.success} />}>
            <span style={{ fontSize: '13px' }}>Eco Mode</span>
          </Button>
          <Button variant="secondary" size="icon" icon={<Home size={20} color={colors.primary.blue} />}>
            <span style={{ fontSize: '13px' }}>Return Home</span>
          </Button>
        </div>
      </div>

      {/* Bottom Flight Panel */}
      <BottomPanel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.lg }}>
          <MetricDisplay label="Altitude" value="120" unit="metros" size="large" />
          <MetricDisplay label="Velocidade" value="28" unit="km/h" size="large" />
          <MetricDisplay label="Distância restante" value="0.8" unit="km" size="large" />
          <MetricDisplay label="Tempo estimado" value="2" unit="min" size="large" />
        </div>
      </BottomPanel>
    </div>
  );
}
