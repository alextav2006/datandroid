import React from 'react';
import { Search, MapPin } from 'lucide-react';
import {
  Input,
  MapContainer,
  WeatherCard,
  CircularGauge,
  RouteCard,
} from '../ui';
import { colors, spacing } from '../../design-system/tokens';

export function FlightPlanning() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto" style={{ maxWidth: '428px', paddingTop: spacing.xl }}>
        {/* Search Bar */}
        <div style={{ marginBottom: spacing.xl }}>
          <Input
            placeholder="Definir destino…"
            icon={<Search size={20} color={colors.text.secondary} strokeWidth={2} />}
          />
        </div>

        {/* Map Area */}
        <div style={{ marginBottom: spacing.xxl }}>
          <MapContainer size="medium">
            <MapPin size={48} strokeWidth={1.5} color={colors.primary.blue} />
          </MapContainer>
        </div>

        {/* Weather Cards */}
        <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.xxl }}>
          <WeatherCard type="wind" value="12" unit="km/h" />
          <WeatherCard type="rain" value="0%" unit="chuva" />
          <WeatherCard type="visibility" value="8" unit="km vis." />
        </div>

        {/* Battery / Autonomy Widget */}
        <div style={{ marginBottom: spacing.xxl }}>
          <CircularGauge value="27" unit="min" label="Autonomia estimada" />
        </div>

        {/* Route Suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          <RouteCard
            type="fastest"
            title="Rota mais rápida"
            distance="2.4 km"
            time="8 min"
            wind="12 km/h vento"
          />
          <RouteCard
            type="efficient"
            title="Rota eficiente"
            distance="2.8 km"
            time="10 min"
            wind="8 km/h vento"
          />
          <RouteCard
            type="safe"
            title="Rota segura"
            distance="3.1 km"
            time="12 min"
            wind="5 km/h vento"
          />
        </div>
      </div>
    </div>
  );
}
