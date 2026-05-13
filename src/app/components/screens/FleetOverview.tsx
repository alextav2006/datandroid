import React from 'react';
import { MapPin } from 'lucide-react';
import { Button, Card, MapContainer, MetricDisplay } from '../ui';
import { colors, typography, spacing } from '../../design-system/tokens';

export function FleetOverview() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto" style={{ maxWidth: '428px' }}>
        {/* Header */}
        <div style={{ marginTop: spacing.xxl, marginBottom: spacing.xl }}>
          <h1 style={{ ...typography.display, color: colors.text.primary, marginBottom: '4px' }}>
            Drones
          </h1>
          <p style={{ ...typography.body, color: colors.text.secondary }}>
            Estado geral da frota
          </p>
        </div>

        {/* Drone Status Card */}
        <Card variant="status">
          <div style={{ marginBottom: spacing.lg }}>
            <h2 style={{ ...typography.title2, color: colors.text.primary, marginBottom: spacing.xs }}>
              Drone A1
            </h2>
            <div style={{ color: colors.primary.success, fontSize: '15px', fontWeight: 500 }}>
              Em voo
            </div>
          </div>

          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md }}>
            <MetricDisplay label="Velocidade" value="32" unit="km/h" />
            <MetricDisplay label="Distância" value="1.2" unit="km" />
            <div>
              <div style={{ fontSize: '13px', color: colors.text.secondary, marginBottom: '6px' }}>
                Vento
              </div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: colors.text.primary }}>
                14 km/h
              </div>
              <div style={{ fontSize: '11px', color: colors.text.secondary, marginTop: '2px' }}>
                lateral
              </div>
            </div>
          </div>
        </Card>

        {/* Map Card */}
        <div style={{ margin: `${spacing.xl} 0` }}>
          <MapContainer size="large">
            <MapPin size={48} strokeWidth={1.5} color={colors.text.secondary} />
          </MapContainer>
        </div>

        {/* Primary Button */}
        <Button variant="primary">Planear Voo</Button>
      </div>
    </div>
  );
}
