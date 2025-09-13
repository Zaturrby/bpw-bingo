# Activist March Animation

This directory contains the refactored activist march animation component, originally from `AnimatedFooter.tsx`. The animation shows activists walking across the screen, meeting through handshakes, forming groups, and marching together.

## File Structure

### Core Files
- **`index.ts`** - Main export file, exports `ActivistMarch` as `AnimatedFooter` for backward compatibility
- **`ActivistMarch.tsx`** - Main React component that orchestrates the animation

### Logic Components
- **`types.ts`** - TypeScript interfaces and types for activists, handshake bubbles, and canvas context
- **`config.ts`** - Configuration constants and initial activist data
- **`activistRenderer.ts`** - Handles drawing individual activist figures with their signs and animations
- **`handshakeSystem.ts`** - Manages handshake interactions, approach behavior, and celebration phases
- **`groupFormation.ts`** - Controls group formation, spacing, and movement coordination

## Component Architecture

The animation is built using a modular architecture with separate systems:

1. **Rendering System** (`ActivistRenderer`)
   - Draws individual activist figures
   - Handles walking animations, wobble effects, and sign movements
   - Manages visual details like head tilting, arm swinging, and leg movement

2. **Handshake System** (`HandshakeSystem`)
   - Detects when activists are close enough to handshake
   - Manages the handshake lifecycle: approaching → handshaking → celebrating → marching
   - Creates and animates handshake bubble effects

3. **Group Formation System** (`GroupFormation`)
   - Maintains group spacing and formation
   - Handles speed adjustments to keep activists in line
   - Manages screen resets and position cycling

## Animation States

### Activist States
- **none** - Walking individually
- **approaching** - Moving toward handshake partner
- **handshaking** - Stopped and shaking hands
- **celebrating** - Brief celebration after handshake
- **marching** - Moving as part of organized group

### Key Features
- **Dynamic handshake detection** - Activists detect nearby partners and initiate handshakes
- **Group formation** - After handshaking, activists maintain formation with proper spacing
- **Visual feedback** - Handshake bubbles (🤝) appear during interactions
- **Personality traits** - Each activist has unique wobble, speed, and sign characteristics
- **Seamless looping** - Activists reset position when off-screen while maintaining group state

## Configuration

All animation parameters are centralized in `config.ts`:
- Canvas dimensions and colors
- Handshake timing and distances
- Group spacing and speeds
- Visual effects settings
- Initial activist configurations

## Usage

The component maintains the same interface as the original `AnimatedFooter`:

```tsx
import { AnimatedFooter } from "./components/animations/activistMarch";

// Usage (no props required)
<AnimatedFooter />
```

The component is self-contained and handles all animation logic internally using requestAnimationFrame for smooth performance.