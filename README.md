# GAMED — Mobile Technical Test

Three-screen Expo SDK 54 app: Login → Profile → Connect / Disconnect Platform.
RN 0.81 New Architecture, TypeScript strict, NativeWind v4, Zustand auth,
TanStack Query v5, Zod schemas, `expo-secure-store` for tokens, Skia for visuals.

## Install & run

Prereqs: Node 20+, **pnpm 9+**, Xcode 15+ (iOS) and/or Android Studio with an emulator.

```bash
pnpm install                    # app deps
cd server && npm install && cd .. # mock server deps

pnpm ios       # iOS Simulator (first build ~8–12 min: prebuild + pods + xcodebuild)
# or
pnpm android   # Android emulator
```

The app talks to the **hosted mock server** by default
(`https://gamed-mock-server.onrender.com`, kept warm by a 14-min Actions cron).
**Login is prefilled** with the only seeded user: `player@gamed.dev` / `hunter22`.

To run the mock server locally instead:

```bash
cd server && node server.js                          # http://localhost:4000
# new terminal:
EXPO_PUBLIC_USE_LOCAL_API=1 pnpm ios                 # or pnpm android
```

Type check: `pnpm exec tsc --noEmit`

## Tested on

- iOS Simulator — iPhone 17 Pro, iOS 26.5 (clean-clone verified from this repo)
- Android Emulator — Pixel 7, API 34 (Android 14)

## Known issues / would change

- Refresh-token rotation isn't wired — the server returns one but there's no `/auth/refresh` endpoint or 401-retry interceptor. Would add for any real auth.
- The *Simulate failure* toggle on Screen 3 is a reviewer affordance; would remove in production.
- Confetti fires on every successful connect; would cap to first-time only.
- Single hardcoded user in the mock server — fine for the test, real backend would use a proper auth store.
