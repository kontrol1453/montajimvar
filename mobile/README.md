# Montajım Var Mobile

Expo-based native mobile app wrapping the Montajım Var PWA.

## Setup

```bash
cd mobile
npm install
```

## Development

```bash
npx expo start
# Scan QR code with Expo Go app
```

## Build

```bash
# Android APK/AAB
npx eas build --platform android

# iOS IPA
npx eas build --platform ios
```

Requires Expo account and EAS CLI: `npm install -g eas-cli`
