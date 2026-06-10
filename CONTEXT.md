# React Controller Context

A tiny library that wraps a controller hook in a React Context + Provider pair via a single factory call, so consumers get typed access to the controller anywhere under the Provider without boilerplate.

## Language

**Controller**:
A React hook that takes a single props object and returns the value to expose through context.
_Avoid_: store, model, service

**Controller Props**:
The single object parameter of a Controller; its shape defines the Provider's props (inferred, never declared twice).
_Avoid_: options (the legacy 1.x passthrough prop)

**Provider**:
The generated component that calls the Controller with its own props (minus `children`) and supplies the result to descendants.

**Controller Context**:
The object returned by `createControllerContext(controller, name?)`: `{ Provider, context, use }`. When `name` is omitted, errors and displayName fall back to the controller's function name, then a generic label.
_Avoid_: bundle, stack

**use (consumer hook)**:
The generated hook that returns the Controller's value from the nearest Provider; named after React 19's `use` direction but remains a strict hook (no conditional calls).
_Avoid_: useContext (shadows React's hook), useController

**Orphaned Consumer**:
A consumer hook called without its Provider above it; always fails fast with a thrown Error naming the controller.
_Avoid_: silent undefined, console-only warning

## Relationships

- The factory takes one **Controller** and produces one **Provider** plus a consumer hook
- **Controller Props** are spread directly on the **Provider** as JSX props; `children` is excluded

## Flagged ambiguities

- "options" (1.x API) vs spread props: resolved. Controller Props are spread directly on the Provider and typed by inference; the untyped `options` passthrough is the legacy pattern being replaced.
