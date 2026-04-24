# Phase 14: Mobile Optimization & PWA

## Objective
Provide a seamless experience on mobile devices and enable installation as a desktop/mobile app.

## Why This Phase Matters
Accessing secrets on the go is a common use case. A Progressive Web App (PWA) provides native-like performance and offline access.

## Scope
- Mobile-first UI redesign for the Dashboard.
- PWA manifests and Service Workers.
- Offline-first caching strategy.
- Biometric authentication (WebAuthn/FaceID).

## Main Tasks

### 1. Responsive Layout Polish
- Optimized sidebar/navigation for small screens (Hamburger menu).
- Touch-friendly buttons and gestures (swipe to archive/delete).
- Graph zoom/pan optimizations for mobile touch.

### 2. PWA Integration
- Configure `next-pwa` or similar.
- Create splash screens and app icons.
- Implement offline sync: Allow users to view secrets even without internet.

### 3. Biometric Unlock (WebAuthn)
- Integrate browser WebAuthn API to allow unlocking the Vault via Fingerprint/FaceID instead of re-typing the Master Password.

## Definition of Done
- App score on Lighthouse (Mobile) is 90+.
- App can be installed on Android/iOS/Windows.
- Vault can be unlocked via biometric authentication on supported devices.
