# 🎨 Apple Minimalist Design System

Complete UI library for drone flight application with SF Pro typography, clean surfaces, and generous spacing.

## 📁 Project Structure

```
src/app/
├── design-system/
│   ├── tokens.ts              # Design tokens (colors, typography, spacing)
│   ├── index.ts               # Export entry point
│   └── README.md              # Documentation
├── components/
│   ├── ui/
│   │   ├── Button.tsx         # Button component (primary, secondary, icon)
│   │   ├── Card.tsx           # Card variants (status, weather, route)
│   │   ├── Input.tsx          # Search/text input
│   │   ├── MapContainer.tsx   # Map containers (small, medium, large, fullscreen)
│   │   ├── MetricDisplay.tsx  # Metric value displays
│   │   ├── AlertBanner.tsx    # Alert/warning banners
│   │   ├── BottomPanel.tsx    # Fixed bottom panels
│   │   ├── CircularGauge.tsx  # Circular progress/gauge
│   │   ├── WeatherCard.tsx    # Weather info cards
│   │   ├── RouteCard.tsx      # Route suggestion cards
│   │   └── index.ts           # UI components export
│   ├── screens/
│   │   ├── FleetOverview.tsx      # Frame 1: Fleet overview
│   │   ├── FlightPlanning.tsx     # Frame 2: Flight planning
│   │   └── RealTimeFlight.tsx     # Frame 3: Real-time flight
│   └── DesignSystemShowcase.tsx   # Component showcase
```

## 🎨 Design Tokens

### Colors
```typescript
import { colors } from './design-system/tokens';

// Primary Colors
colors.primary.blue      // #007AFF
colors.primary.success   // #30D158
colors.primary.warning   // #FFD60A
colors.primary.danger    // #FF3B30

// Neutral Colors
colors.neutral[0]        // #FFFFFF (White)
colors.neutral[1]        // #F2F2F7 (Light Gray)
colors.neutral[2]        // #E5E5E7 (Border Gray)
colors.neutral[3]        // #6E6E73 (Secondary Text)
colors.neutral[4]        // #1C1C1E (Primary Text)
```

### Typography
```typescript
import { typography } from './design-system/tokens';

typography.display       // 32px / Semibold
typography.title1        // 24px / Medium
typography.title2        // 20px / Medium
typography.body          // 17px / Regular
typography.caption       // 13px / Regular
typography.metricValue   // 28px / Semibold
typography.metricLabel   // 13px / Medium
```

### Spacing
```typescript
import { spacing } from './design-system/tokens';

spacing.xs    // 8px
spacing.sm    // 12px
spacing.md    // 16px
spacing.lg    // 24px
spacing.xl    // 32px
spacing.xxl   // 48px
```

### Radius
```typescript
import { radius } from './design-system/tokens';

radius.sm     // 12px
radius.md     // 16px
radius.lg     // 20px
radius.xl     // 22px
radius.xxl    // 24px
radius.full   // 9999px (circular)
```

## 🧩 Components

### Button
```tsx
import { Button } from './components/ui';

// Primary Button
<Button variant="primary" onClick={handleClick}>
  Planear Voo
</Button>

// Secondary Button
<Button variant="secondary">Cancel</Button>

// Icon Button
<Button variant="secondary" size="icon" icon={<Home />}>
  Return Home
</Button>
```

**Variants**: `primary`, `secondary`, `icon`  
**Sizes**: `default`, `icon`

### Card
```tsx
import { Card } from './components/ui';

// Status Card
<Card variant="status">
  {/* Content */}
</Card>

// Weather Card
<Card variant="weather">
  {/* Weather info */}
</Card>

// Route Card
<Card variant="route" routeType="fastest">
  {/* Route details */}
</Card>
```

**Variants**: `default`, `status`, `weather`, `route`  
**Route Types**: `fastest`, `efficient`, `safe`

### Input
```tsx
import { Input } from './components/ui';
import { Search } from 'lucide-react';

<Input 
  placeholder="Definir destino…" 
  icon={<Search size={20} />}
  value={searchTerm}
  onChange={setSearchTerm}
/>
```

### Map Container
```tsx
import { MapContainer } from './components/ui';

<MapContainer size="medium" showGrid={true}>
  <MapPin size={48} />
</MapContainer>
```

**Sizes**: `small` (60×60), `medium` (300px), `large` (260px), `fullscreen` (70vh)

### Metric Display
```tsx
import { MetricDisplay } from './components/ui';

<MetricDisplay 
  label="Velocidade"
  value="32"
  unit="km/h"
  size="default"
/>
```

**Sizes**: `default`, `large`

### Alert Banner
```tsx
import { AlertBanner } from './components/ui';

<AlertBanner 
  message="Vento lateral forte — reduzir para 22 km/h"
  type="warning"
/>
```

**Types**: `warning`, `danger`

### Weather Card
```tsx
import { WeatherCard } from './components/ui';

<WeatherCard type="wind" value="12" unit="km/h" />
<WeatherCard type="rain" value="0%" unit="chuva" />
<WeatherCard type="visibility" value="8" unit="km vis." />
```

**Types**: `wind`, `rain`, `visibility`, `sun`

### Route Card
```tsx
import { RouteCard } from './components/ui';

<RouteCard
  type="fastest"
  title="Rota mais rápida"
  distance="2.4 km"
  time="8 min"
  wind="12 km/h vento"
  onClick={handleRouteSelect}
/>
```

### Circular Gauge
```tsx
import { CircularGauge } from './components/ui';

<CircularGauge 
  value="27"
  unit="min"
  label="Autonomia estimada"
  color={colors.primary.success}
/>
```

### Bottom Panel
```tsx
import { BottomPanel } from './components/ui';

<BottomPanel height="240px">
  {/* Metrics grid */}
</BottomPanel>
```

## 📱 Screen Templates

Three complete screen templates are available:

### 1. Fleet Overview (`FleetOverview.tsx`)
- Header with title and subtitle
- Drone status card with metrics
- Map visualization
- Primary action button

### 2. Flight Planning (`FlightPlanning.tsx`)
- Search bar for destination
- Interactive map area
- Weather condition cards
- Autonomy gauge
- Route suggestion cards

### 3. Real-Time Flight (`RealTimeFlight.tsx`)
- Fullscreen map with route
- Wind indicator overlay
- Alert banner
- Quick action buttons
- Bottom metrics panel

## 🎯 Design Principles

1. **Minimalism**: Clean white surfaces, no heavy shadows or gradients
2. **Spacing**: Generous white space (32-48px between sections)
3. **Typography**: SF Pro with negative letter-spacing for crispness
4. **Borders**: Soft grey strokes (1px #E5E5E7)
5. **Radius**: Rounded corners (16-24px)
6. **Colors**: Limited semantic palette
7. **Grid**: 4-point system (8px base unit)

## 🚀 Usage Example

```tsx
import { 
  Button, 
  Card, 
  WeatherCard, 
  RouteCard 
} from './components/ui';
import { colors, typography, spacing } from './design-system/tokens';

function MyScreen() {
  return (
    <div style={{ padding: spacing.xl }}>
      <h1 style={{ ...typography.display, color: colors.text.primary }}>
        Flight Dashboard
      </h1>
      
      <div style={{ display: 'flex', gap: spacing.md, marginTop: spacing.lg }}>
        <WeatherCard type="wind" value="12" unit="km/h" />
        <WeatherCard type="rain" value="0%" unit="chuva" />
      </div>
      
      <RouteCard
        type="fastest"
        title="Rota mais rápida"
        distance="2.4 km"
        time="8 min"
        wind="12 km/h vento"
      />
      
      <Button variant="primary">Start Flight</Button>
    </div>
  );
}
```

## 📖 View the Showcase

Run the app to see all components in action:
```bash
# The app displays the DesignSystemShowcase by default
# All components are organized by category with examples
```

## 🎨 Customization

All design tokens are centralized in `src/app/design-system/tokens.ts`. Modify them to customize the entire design system:

```typescript
export const colors = {
  primary: {
    blue: '#007AFF',  // Change to your brand color
    // ...
  },
  // ...
};
```

---

**Design System Status**: ✅ Complete  
**Components**: 11 reusable UI components  
**Screens**: 3 example templates  
**Documentation**: Full coverage
