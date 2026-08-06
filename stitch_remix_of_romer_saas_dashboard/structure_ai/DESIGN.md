---
name: Structure AI
colors:
  surface: '#101418'
  surface-dim: '#101418'
  surface-bright: '#36393e'
  surface-container-lowest: '#0b0e13'
  surface-container-low: '#181c20'
  surface-container: '#1c2025'
  surface-container-high: '#272a2f'
  surface-container-highest: '#31353a'
  on-surface: '#e0e2e9'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e0e2e9'
  inverse-on-surface: '#2d3136'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4ae176'
  on-secondary: '#003915'
  secondary-container: '#00b954'
  on-secondary-container: '#004119'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#101418'
  on-background: '#e0e2e9'
  surface-variant: '#31353a'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  section-gap: 80px
  component-padding: 24px
  element-gap: 12px
  grid-margin: 40px
  grid-gutter: 24px
---

## Brand & Style

This design system is engineered for high-stakes medical AI environments where clarity, precision, and authority are paramount. The aesthetic is "Clinical Technicalism"—a fusion of high-end medical instrumentation and futuristic data-driven interfaces. 

The personality is cold, objective, and impeccably organized. It prioritizes the "diagnostic gaze," reducing visual noise to ensure that critical data points are immediately legible. The UI utilizes a dark-mode foundation to reduce eye strain for clinicians in low-light environments, employing a minimalist, enterprise-grade architecture that feels less like a website and more like a specialized medical tool.

## Colors

The palette is rooted in the "Cinematic Precision" scheme. The background is a deep, near-black (#070708) to provide maximum contrast for technical readouts.

- **Primary (Electric Blue):** Reserved for active states, focus rings, and primary calls to action. It signals "system activity."
- **Secondary (Medical Green):** Specifically for positive diagnostic outcomes, system approvals, and "go" signals.
- **Tertiary (Diagnostic Amber):** Used sparingly for warnings, cautionary data points, and attention-required logs.
- **Neutral/Muted:** A tiered gray system used for non-critical information and structural borders, ensuring the hierarchy remains flat until a data point requires attention.

## Typography

The system utilizes **Inter** for all functional and narrative text, chosen for its exceptional legibility in dense interfaces. For technical readouts, logs, and metadata, **JetBrains Mono** is employed to convey a sense of underlying technical "structure" and machine precision.

Headers should be kept tight and purposeful. Data density is managed by utilizing `label-caps` for table headers and section descriptors, while `data-mono` handles all variable medical input and diagnostic logs.

## Layout & Spacing

The layout philosophy follows a rigid, high-density grid system. While individual components are packed with information, the sections themselves are separated by a generous 80px "breathing room" to maintain a professional, clinical atmosphere.

- **Grid Model:** 12-column fixed grid for desktop, transitioning to a fluid single column for mobile.
- **Internal Padding:** 24px is the standard for cards and containers to ensure content does not feel cramped despite the technical complexity.
- **Information Density:** Use 12px vertical spacing between data rows within clinical lists.

## Elevation & Depth

This system avoids traditional drop shadows to maintain its "instrument-grade" feel. Depth is communicated through:

- **1px Borders:** Use `#F0F1F2` at 10% opacity for container outlines.
- **Glassmorphism:** Use a `12px` backdrop blur on floating panels and overlays with a semi-transparent `#121214` (80% opacity) fill.
- **Tonal Layering:** The base background is `#070708`. Primary UI containers use a slightly elevated `#121214` to differentiate between the canvas and the tools.
- **Active State Glow:** Instead of shadows, active elements may emit a subtle 4px outer glow of the Primary Electric Blue to simulate a backlit LED display.

## Shapes

The design uses "Soft" geometry (`roundedness: 1`). A subtle 0.25rem (4px) radius is applied to buttons and inputs to prevent the UI from feeling aggressively sharp (Brutalist) while maintaining a precise, technical edge. Large cards and modals may use `rounded-lg` (8px) to soften the professional footprint.

## Components

### Buttons
- **Primary:** Solid Electric Blue (#3B82F6) with white text. No gradients.
- **Ghost/Instrument:** 1px border (#F0F1F2 @ 20%) with JetBrains Mono text. For secondary actions.

### Inputs & Fields
- **Diagnostic Input:** Dark background (#070708), 1px border. When focused, the border turns Electric Blue with a sharp 2px inner-stroke.
- **Labels:** Always use `label-caps` positioned above the input field.

### Cards & Panels
- **Medical Module:** Glassmorphic background with 1px border. Title bar should have a distinct 1px bottom divider.
- **Data Readouts:** Use monospaced fonts for numerical values. Align decimals in columns for rapid clinical scanning.

### Status Indicators
- **Approvals:** Medical Green dot with a low-opacity pulse animation.
- **Warnings:** Diagnostic Amber bold text with a 1px border in the same color.

### Iconography
- Use thin-stroke (1.5px) technical icons. Avoid filled or "playful" styles. Icons should resemble schematic symbols.