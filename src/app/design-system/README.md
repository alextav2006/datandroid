# Design System - Apple Minimalist Style

Complete UI library for drone flight app with SF Pro typography, clean surfaces, and generous spacing.

## 🎨 Colors

### Primary Colors
- **Blue**: `#007AFF` - Primary actions, links, active states
- **Success Green**: `#30D158` - Success states, positive metrics
- **Warning Yellow**: `#FFD60A` - Warnings, caution states
- **Danger Red**: `#FF3B30` - Errors, critical alerts

### Neutral Colors
- **Neutral 0**: `#FFFFFF` - Card backgrounds, surfaces
- **Neutral 1**: `#F2F2F7` - Input backgrounds, secondary surfaces
- **Neutral 2**: `#E5E5E7` - Borders, dividers
- **Neutral 3**: `#6E6E73` - Secondary text, labels
- **Neutral 4**: `#1C1C1E` - Primary text, headings

## 📝 Typography

Uses SF Pro Display and SF Pro Text (fallback to system fonts).

### Text Styles
- **Display**: 32px / Semibold / -0.5px
- **Title 1**: 24px / Medium / -0.3px
- **Title 2**: 20px / Medium / -0.3px
- **Body**: 17px / Regular / -0.2px
- **Caption**: 13px / Regular / -0.1px
- **Metric Value**: 28px / Semibold / -0.5px
- **Metric Label**: 13px / Medium / -0.1px

## 📏 Spacing & Grid

### Spacing Tokens
- **XS**: 8px
- **SM**: 12px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **XXL**: 48px

### Layout
- Side margins: 32px
- Internal padding: 16px
- Card padding: 24px
- 4-point grid system

## 🎯 Components

### Buttons
- **Primary Button**: 56px height, 22px radius, Blue background
- **Secondary Button**: 56px height, 16px radius, Neutral background
- **Icon Button**: 56×56px, 16px radius

### Cards
- **Status Card**: 220px height, 20px radius
- **Weather Card**: 110×140px
- **Route Card**: 120px height, colored left border

### Inputs
- **Search Input**: 56px height, 16px radius, left icon support

### Maps
- **Fullscreen**: 70vh, edge-to-edge
- **Medium**: 300px height
- **Small**: 60×60px thumbnail

### Panels
- **Bottom Panel**: 240px height, 24px top radius

## 🔧 Usage

```tsx
import { Button, Card, Input } from './components/ui';
import { colors, typography, spacing } from './design-system/tokens';

// Use components
<Button variant="primary">Planear Voo</Button>
<Card variant="status">Content</Card>
<Input placeholder="Search..." icon={<SearchIcon />} />
```

## 🎨 Design Principles

1. **Minimalism**: Clean surfaces, no heavy shadows or gradients
2. **Spacing**: Generous white space (32-48px between sections)
3. **Typography**: SF Pro with negative letter-spacing
4. **Borders**: Soft grey strokes (1px #E5E5E7)
5. **Radius**: Rounded corners (16-24px)
6. **Colors**: Limited palette, semantic usage

## 📦 Component Library Structure

```
src/app/
├── design-system/
│   ├── tokens.ts          # Colors, typography, spacing
│   └── README.md          # This file
└── components/ui/
    ├── Button.tsx         # Button variants
    ├── Card.tsx           # Card variants
    ├── Input.tsx          # Input field
    ├── MapContainer.tsx   # Map containers
    ├── MetricDisplay.tsx  # Metric display
    ├── AlertBanner.tsx    # Alert banners
    ├── BottomPanel.tsx    # Bottom panel
    ├── CircularGauge.tsx  # Circular gauge
    ├── WeatherCard.tsx    # Weather cards
    ├── RouteCard.tsx      # Route cards
    └── index.ts           # Exports
```
