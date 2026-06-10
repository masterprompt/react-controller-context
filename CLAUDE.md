# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React Controller Context — a lightweight utility that generates React Context + Provider pairs from controller hooks. Single export: `createControllerContext(hook, name?)` returns `{ Provider, context, use }`.

Domain language lives in `CONTEXT.md`; design decisions in `docs/adr/`.

Peer dependencies: React 18/19. Zero production dependencies.

## Commands

- `npm test` — run Jest tests (jsdom environment)
- `npm run build` — production webpack build (UMD output to `dist/`)
- `npm start` — webpack watch mode (development)
- `npm run lint` — ESLint with airbnb-typescript config

## Architecture

All source is in `src/` (~80 lines of core code):

- `index.ts` — re-exports `createControllerContext` and the `Controller` type
- `create-controller-context.tsx` — the entire implementation: factory creates a React context with a `Symbol` sentinel default, returns `{ Provider, context, use }`

The flow: `createControllerContext(useMyHook, name?)` → creates `React.createContext` (sentinel default) → Provider spreads its non-`children` props into `useMyHook(props)` and supplies the result as context value → `use()` reads the context and throws a descriptive error (using `name`, falling back to the hook's function name) if the sentinel is still present, i.e. no Provider above.

Controllers must take a single object parameter; Provider prop types are inferred from it. See `docs/adr/0001-single-factory-api-v2.md` for why.

## Build

Webpack 5 bundles to UMD format. React/ReactDOM are externals. TypeScript compiled via ts-loader. Output includes `dist/index.js`, source maps, and `.d.ts` declaration files.

## Code Style

- 4-space indentation
- TypeScript strict mode (noImplicitAny, strictNullChecks, noUnusedLocals, noUnusedParameters)
- Path alias: `@/*` → `./src/*`

## Agent skills

### Issue tracker

Issues are tracked as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary — the five canonical role names used as-is. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
