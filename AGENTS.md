# AGENTS.md

This repository is a lightweight personal website built with React, TypeScript, and Vite.

## Working Guidelines

- Keep the website Chinese-first. User-facing copy should be in Simplified Chinese unless there is a clear reason to use English.
- Preserve the current structure: `AppLayout` owns the persistent header, and pages render through React Router.
- Keep navigation centralized in `src/config/routes.ts`.
- Keep implementation lightweight. Prefer local state, custom hooks, Tailwind utilities, and the existing plain CSS visual system before introducing more dependencies.
- Do not commit generated folders or local deployment state: `node_modules`, `dist`, and `.vercel` must stay ignored.
- Before finishing frontend changes, run `npm run build`.
- If layout changes are visual, verify in the browser when possible.

## Project Notes

- Main routing lives in `src/App.tsx`.
- Route and navigation config lives in `src/config/routes.ts`.
- Page components live in `src/pages`.
- Snake logic lives in `src/games/snake/hooks/useSnakeGame.ts`.
- Page and game styling lives in `src/App.css` plus Tailwind imported from `src/index.css`.
- Global CSS reset and base typography live in `src/index.css`.
- Vercel settings live in `vercel.json`.

## Snake Game Rules

- The snake must die on wall collision.
- The snake must die on self collision.
- Direction reversal should be blocked to avoid instant self-collision from a 180-degree turn.
