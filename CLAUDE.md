# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React Controller Context — a lightweight utility that generates React Context + Provider pairs from controller hooks. Single export: `createContextForController(hook)` returns `{ Provider, useController }`.

Peer dependencies: React 18/19. Zero production dependencies.

## Commands

- `npm test` — run Jest tests (jsdom environment)
- `npm run build` — production webpack build (UMD output to `dist/`)
- `npm start` — webpack watch mode (development)
- `npm run lint` — ESLint with airbnb-typescript config

## Architecture

All source is in `src/` (~50 lines of core code):

- `index.ts` — re-exports `createContextForController`
- `definitions.ts` — shared types (`Controller<T>`, `ProviderProps`, `ControllerOptions`)
- `create-context-for-controller.ts` — factory function: creates a React context, returns `{ Provider, useController }` object
- `create-provider.tsx` — wraps `InternalProvider` into a component bound to a specific context and controller hook
- `internal-provider.tsx` — renders `Context.Provider`, invokes the controller hook with optional `options` prop

The flow: `createContextForController(useMyHook)` → creates `React.createContext` → builds a Provider component that calls `useMyHook(options)` and passes the result as context value → returns the Provider and a `useController` shorthand for `useContext`.

## Build

Webpack 5 bundles to UMD format. React/ReactDOM are externals. TypeScript compiled via ts-loader. Output includes `dist/index.js`, source maps, and `.d.ts` declaration files.

## Code Style

- 4-space indentation
- TypeScript strict mode (noImplicitAny, strictNullChecks, noUnusedLocals, noUnusedParameters)
- Path alias: `@/*` → `./src/*`
