# GAMED — Mobile Technical Test

Three-screen Expo SDK 54 app: Login → Profile → Connect Platform. RN 0.81 with New Architecture, TypeScript strict, NativeWind v4, Zustand auth, TanStack Query v5, Zod schemas, `expo-secure-store` for tokens.

## Setup

```bash
pnpm install
pnpm install --dir server   # mock server deps
```

## Run

The app reads its API URL from `EXPO_PUBLIC_API_URL`. Defaults (when the env var is not set):

- iOS Simulator: `http://localhost:4000`
- Android emulator: `http://10.0.2.2:4000`

Run fully local:

```bash
# Terminal 1 — mock server
cd server && node server.js

# Terminal 2 — app
pnpm ios       # iOS Simulator
pnpm android   # Android emulator
```

Or point at the hosted server (deployed on Render):

```bash
EXPO_PUBLIC_API_URL=https://<your-render-service>.onrender.com pnpm ios
```

Login is prefilled on the screen:

- email: `player@gamed.dev`
- password: `hunter22`

## Tested on

- iOS Simulator — iPhone 16 Pro, iOS 18.1
- Android Emulator — Pixel 7, API 34 (Android 14)

## Verifying

```bash
pnpm exec tsc --noEmit       # strict, must pass
curl http://localhost:4000/health
```

## Hosted mock server

The mock server is deployed to Render (free web service). A GitHub Actions cron hits `/health` every 14 minutes to keep the dyno warm (Render free tier spins down after 15 min idle). See `render.yaml` and `.github/workflows/ping.yml`.

## Architecture

- **Tokens** live exclusively in `expo-secure-store`. The wrapper in `src/lib/secureStore.ts` is the only module that touches the keychain. AsyncStorage is not used anywhere.
- **Auth state** lives in `src/stores/authStore.ts` (Zustand). The root layout hydrates tokens at cold start; an `AuthGate` redirects between `(auth)` and `(app)` groups based on the token.
- **Data fetching** uses TanStack Query for `/me` and `/me/sessions`. Pull-to-refresh wires `refetch()` on both.
- **Connect Platform** uses `useMutation` with `onMutate` writing an optimistic update into the `profile` cache, and `onError` rolling back to the captured snapshot. The button is disabled while pending. A `Simulate failure` toggle on that screen lets the reviewer trigger a 500 to exercise the rollback path.
- **API contracts** are typed with Zod schemas in `src/types/index.ts`; types flow through hooks and components. No `any`, no `ts-ignore`.

## Known issues / would change

- Refresh-token rotation isn't wired — `/auth/login` returns a refresh token but there is no `/auth/refresh` endpoint. A real implementation would intercept 401s, hit refresh, and retry once.
- The `Simulate failure` toggle on the connect screen is a reviewer affordance; in production it would be removed.
