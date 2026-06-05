# AGENTS.md

This repository is a lightweight personal website built with React, TypeScript, and Vite.

## Working Guidelines

- Keep the website Chinese-first. User-facing copy should be in Simplified Chinese unless there is a clear reason to use English.
- Preserve the current structure: the header and tab navigation stay persistent, while each tab renders a full page below it.
- Keep implementation lightweight. Prefer React state and plain CSS before introducing new dependencies.
- Do not commit generated folders or local deployment state: `node_modules`, `dist`, and `.vercel` must stay ignored.
- Before finishing frontend changes, run `npm run build`.
- If layout changes are visual, verify in the browser when possible.

## Project Notes

- Main app logic lives in `src/App.tsx`.
- Page and game styling lives in `src/App.css`.
- Global CSS reset and base typography live in `src/index.css`.
- Vercel settings live in `vercel.json`.

## Snake Game Rules

- The snake must die on wall collision.
- The snake must die on self collision.
- Direction reversal should be blocked to avoid instant self-collision from a 180-degree turn.
