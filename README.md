# Bracket Buddy

Bracket Buddy is a minimalist exposure bracketing helper for HDRI photographers. It calculates a symmetric shutter speed sequence from a selected brightest, middle, or darkest exposure.

## Features

- **Scrollable exposure list** - Tap to select any exposure and see the full bracket sequence in three columns (Dark, Mid, Bright)
- **Adjustable bracketing** - Configure bracket count (3–11), EV spacing (1–3 stops), and camera shutter speed limits
- **1/3-stop support** - Toggle between full-stop and third-stop increments with visual distinction
- **Persistent settings** - All preferences saved locally via AsyncStorage
- **Common presets** - Emoji indicators for typical exposure scenarios:
  - ☀️ Sunny day (1/8000 → 1/2")
  - 🏠 Indoor (1/1000 → 4")
  - 🌚 Night (1/250 → 15")

## How to Use

1. Open the app and scroll to your desired middle exposure
2. The active row (highlighted with white background) shows the full bracket sequence
3. Adjust settings via the ⚙️ icon to customize:
   - Number of exposures
   - EV step between each exposure
   - Camera's shutter speed range
   - 1/3-stop precision (optional)
4. The footer displays the complete sequence for the active exposure

----

# Development

## Requirements

- Node.js (LTS)
- Expo Go app installed on a device, or an emulator

## Setup

1. Install dependencies:

   npm install

2. Start the dev server:

   npm run start

3. Scan the QR code with Expo Go, or press the platform shortcut in the Expo terminal.

## Building for Distribution

To build an APK for testing on Android devices:

```bash
eas build --platform android
```

The build will be compiled in the cloud and a download link provided on completion.

## Scripts

- `npm run start` - Start development server
- `npm run android` - Launch on Android emulator
- `npm run ios` - Launch on iOS simulator
- `npm run web` - Launch on web

## Project Structure

- `components/` - Reusable UI components
- `screens/` - App screens (MainScreen, SettingsScreen)
- `utils/` - Exposure math, shutter speed utilities, theme
- `context/` - App state management with AsyncStorage persistence

## Architecture

- **State Management** - React Context with custom hooks
- **Persistence** - AsyncStorage for settings
- **Exposure Math** - Index-based stepping through sorted shutter speed options (no floating-point drift)
- **UI** - React Native ScrollView with dynamic active row detection
