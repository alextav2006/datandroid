import React from 'react';
import { Search, RotateCcw, Leaf, Home } from 'lucide-react';
import {
  Button,
  Card,
  Input,
  MapContainer,
  MetricDisplay,
  AlertBanner,
  BottomPanel,
  CircularGauge,
  WeatherCard,
  RouteCard,
} from './ui';
import { colors, typography, spacing } from '../design-system/tokens';

export function DesignSystemShowcase() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background.primary, padding: spacing.xl }}>
      <div style={{ maxWidth: '428px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: spacing.xxl }}>
          <h1 style={{ ...typography.display, color: colors.text.primary, marginBottom: spacing.xs }}>
            Design System
          </h1>
          <p style={{ ...typography.body, color: colors.text.secondary }}>
            Apple Minimalist UI Library
          </p>
        </div>

        {/* Section: Colors */}
        <section style={{ marginBottom: spacing.xxl }}>
          <h2 style={{ ...typography.title1, color: colors.text.primary, marginBottom: spacing.lg }}>
            Colors
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.md }}>
            {Object.entries(colors.primary).map(([name, color]) => (
              <div
                key={name}
                style={{
                  padding: spacing.lg,
                  backgroundColor: color,
                  borderRadius: '16px',
                  color: '#fff',
                  textAlign: 'center',
                }}
              >
                <div style={{ ...typography.caption, opacity: 0.9 }}>{name}</div>
                <div style={{ ...typography.caption, fontSize: '11px', marginTop: '4px' }}>{color}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Typography */}
        <section style={{ marginBottom: spacing.xxl }}>
          <h2 style={{ ...typography.title1, color: colors.text.primary, marginBottom: spacing.lg }}>
            Typography
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <div style={{ ...typography.display, color: colors.text.primary }}>Display / 32 Semibold</div>
            <div style={{ ...typography.title1, color: colors.text.primary }}>Title 1 / 24 Medium</div>
            <div style={{ ...typography.title2, color: colors.text.primary }}>Title 2 / 20 Medium</div>
            <div style={{ ...typography.body, color: colors.text.primary }}>Body / 17 Regular</div>
            <div style={{ ...typography.caption, color: colors.text.secondary }}>Caption / 13 Regular</div>
          </div>
        </section>

        {/* Section: Buttons */}
        <section style={{ marginBottom: spacing.xxl }}>
          <h2 style={{ ...typography.title1, color: colors.text.primary, marginBottom: spacing.lg }}>
            Buttons
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
              <Button variant="secondary" size="icon" icon={<RotateCcw size={20} />}>
                <span style={{ fontSize: '13px' }}>Recalcular</span>
              </Button>
              <Button variant="secondary" size="icon" icon={<Leaf size={20} color={colors.primary.success} />}>
                <span style={{ fontSize: '13px' }}>Eco Mode</span>
              </Button>
              <Button variant="secondary" size="icon" icon={<Home size={20} color={colors.primary.blue} />}>
                <span style={{ fontSize: '13px' }}>Home</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Section: Input */}
        <section style={{ marginBottom: spacing.xxl }}>
          <h2 style={{ ...typography.title1, color: colors.text.primary, marginBottom: spacing.lg }}>
            Input
          </h2>
          <Input placeholder="Definir destino…" icon={<Search size={20} color={colors.text.secondary} />} />
        </section>

        {/* Section: Alert Banners */}
        <section style={{ marginBottom: spacing.xxl }}>
          <h2 style={{ ...typography.title1, color: colors.text.primary, marginBottom: spacing.lg }}>
            Alert Banners
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <AlertBanner message="Vento lateral forte — reduzir para 22 km/h" type="warning" />
            <AlertBanner message="Bateria crítica — retornar à base" type="danger" />
          </div>
        </section>

        {/* Section: Weather Cards */}
        <section style={{ marginBottom: spacing.xxl }}>
          <h2 style={{ ...typography.title1, color: colors.text.primary, marginBottom: spacing.lg }}>
            Weather Cards
          </h2>
          <div style={{ display: 'flex', gap: spacing.md }}>
            <WeatherCard type="wind" value="12" unit="km/h" />
            <WeatherCard type="rain" value="0%" unit="chuva" />
            <WeatherCard type="visibility" value="8" unit="km vis." />
          </div>
        </section>

        {/* Section: Status Card */}
        <section style={{ marginBottom: spacing.xxl }}>
          <h2 style={{ ...typography.title1, color: colors.text.primary, marginBottom: spacing.lg }}>
            Status Card
          </h2>
          <Card variant="status">
            <div style={{ marginBottom: spacing.lg }}>
              <h3 style={{ ...typography.title2, color: colors.text.primary, marginBottom: spacing.xs }}>
                Drone A1
              </h3>
              <div style={{ color: colors.primary.success, fontSize: '15px', fontWeight: 500 }}>
                Em voo
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md }}>
              <MetricDisplay label="Velocidade" value="32" unit="km/h" />
              <MetricDisplay label="Distância" value="1.2" unit="km" />
              <MetricDisplay label="Vento" value="14" unit="km/h" />
            </div>
          </Card>
        </section>

        {/* Section: Route Cards */}
        <section style={{ marginBottom: spacing.xxl }}>
          <h2 style={{ ...typography.title1, color: colors.text.primary, marginBottom: spacing.lg }}>
            Route Cards
          </h2>
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
        </section>

        {/* Section: Circular Gauge */}
        <section style={{ marginBottom: spacing.xxl }}>
          <h2 style={{ ...typography.title1, color: colors.text.primary, marginBottom: spacing.lg }}>
            Circular Gauge
          </h2>
          <CircularGauge value="27" unit="min" label="Autonomia estimada" />
        </section>

        {/* Section: Map Containers */}
        <section style={{ marginBottom: spacing.xxl }}>
          <h2 style={{ ...typography.title1, color: colors.text.primary, marginBottom: spacing.lg }}>
            Map Containers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            <MapContainer size="medium" />
            <div style={{ display: 'flex', gap: spacing.md }}>
              <MapContainer size="small" />
              <MapContainer size="small" />
              <MapContainer size="small" />
            </div>
          </div>
        </section>

        {/* Section: Metrics Grid */}
        <section style={{ marginBottom: '200px' }}>
          <h2 style={{ ...typography.title1, color: colors.text.primary, marginBottom: spacing.lg }}>
            Metric Displays
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.lg }}>
            <MetricDisplay label="Altitude" value="120" unit="metros" size="large" />
            <MetricDisplay label="Velocidade" value="28" unit="km/h" size="large" />
            <MetricDisplay label="Distância" value="0.8" unit="km" size="large" />
            <MetricDisplay label="Tempo" value="2" unit="min" size="large" />
          </div>
        </section>
      </div>
    </div>
  );
}
