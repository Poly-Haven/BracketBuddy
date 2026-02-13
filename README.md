# Bracket Buddy

When shooting HDR brackets, you often know what you want your brightest or darkest shutter speed to be, but your camera requires you to start from the middle value for some reason.

Calculating that middle shutter speed in your head is hard, so this app presents a simple scrollable exposure table to show you the bracket sequence's darkest, middle, and brightest shutter speeds.

Depending on your camera's settings and capabilities, you can adjust the sequences and shutter speeds shown to you. So it's slightly more than just a static table ;)

The footer shows the complete sequence of all images.

<p align="center">
  <img src="https://github.com/user-attachments/assets/0e773936-771a-4881-a32c-2687e14576e9" alt="App screenshot" />
</p>

## Features

- **Scrollable exposure list** - See a summary of the bracket sequence in three columns (Darkest, Mid, Brightest)
- **Adjustable bracketing** - Configure bracket count (3–11), EV spacing (1–3 stops), and camera shutter speed limits
- **1/3-stop support** - Toggle between full-stop and third-stop increments
- **Persistent settings** - Remembers your settings between sessions using local storage
- **Common presets** - Emoji indicators for typical exposure scenarios:
  - ☀️ Sunny day (1/8000 → 1/2")
  - 🏠 Indoor (1/1000 → 4")
  - 🌚 Night (1/250 → 15")

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
- **Exposure Math** - Index-based stepping through sorted shutter speed options
- **UI** - React Native ScrollView with dynamic active row detection
