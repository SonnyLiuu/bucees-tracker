# Frontend

This frontend now runs on `Vite + Vitest` and builds to `dist/`.

## Scripts

- `npm run dev`
  Starts the Vite dev server on port `3000`.
- `npm run build`
  Builds the production frontend into `dist/`.
- `npm run preview`
  Serves the built frontend locally with Vite preview.
- `npm run test`
  Runs the Vitest suite in watch mode.
- `npm run test:ci`
  Runs the Vitest suite once for CI.
- `npm run lint`
  Runs ESLint across `src/`.

## Environment

Frontend env vars use Vite naming:

- `VITE_API_BASE`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_GOOGLE_MAPS_API_KEY`

For local development, leave `VITE_API_BASE` empty to use the Vite `/api` proxy to the backend on `http://localhost:3001`.

## Notes

- `index.html` is the Vite app shell.
- static assets in `public/` are copied through unchanged.
- Google Maps is loaded at runtime from app code, not injected through HTML.
