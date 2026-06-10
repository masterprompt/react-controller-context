# React Controller Context

Generate a typed React Context + Provider pair from any controller hook with a single factory call: `createControllerContext`. Zero boilerplate, full type inference, runtime safety, zero dependencies.

## Installation

```sh
npm install react-controller-context
```

Peer dependencies: `react` 18 or 19.

## Quick Start

```tsx
import { createControllerContext } from 'react-controller-context';

// 1. Write a controller — a hook that takes one props object
const useCounter = ({ initialValue }: { initialValue?: number } = {}) => {
    const [count, setCount] = React.useState(initialValue ?? 0);
    return { count, setCount };
};

// 2. Create the controller context
const Counter = createControllerContext(useCounter, 'Counter');

// 3. Provide it — the Provider's props mirror your controller's props
const App = () => (
    <Counter.Provider initialValue={4}>
        <Display />
    </Counter.Provider>
);

// 4. Consume it anywhere underneath
const Display = () => {
    const { count, setCount } = Counter.use();
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
```

## API

### `createControllerContext(useController, name?)`

| Param | Type | Description |
|---|---|---|
| `useController` | `(props: P) => R` | A controller hook. It must take a single props object (or nothing); its return value becomes the context value. |
| `name` | `string` *(optional)* | Label for error messages and React DevTools. Falls back to the controller function's name, then a generic label. Pass it explicitly if the message must survive minification. |

**Returns** a controller context:

| Key | Type | Description |
|---|---|---|
| `Provider` | `React.FC<PropsWithChildren<P>>` | Forwards all non-`children` props to the controller and supplies its return value to descendants. Prop types are inferred from the controller's parameter. |
| `use` | `() => R` | Returns the controller value from the nearest Provider. Throws a descriptive error when called without one. |
| `context` | `React.Context<R>` | The raw context — an escape hatch for React 19's `use(context)` or injecting a mock value in tests. |

### Runtime safety

Calling `use()` without a Provider above it throws immediately:

```
Error: Counter cannot be used outside its Provider.
```

Detection uses a unique sentinel, so controllers that legitimately return falsy values (`0`, `''`, `false`, `null`) work fine.

> **Note** — despite the name, `use()` is a regular hook: call it at the top level of your component, not inside conditionals. (It wraps `useContext` for React 18 compatibility, so React 19's conditional-`use` superpower does not apply.)

## Recipes

### Controller with no props

A controller can take no parameter at all — the Provider then accepts only `children`:

```tsx
const useTheme = () => {
    const [dark, setDark] = React.useState(false);
    return { dark, toggle: () => setDark(d => !d) };
};

const Theme = createControllerContext(useTheme, 'Theme');

<Theme.Provider>
    <App />
</Theme.Provider>
```

### Required props

Required fields in the controller's props become required Provider props — TypeScript enforces them at the call site:

```tsx
const useAuth = ({ userId }: { userId: string }) => { /* ... */ };
const Auth = createControllerContext(useAuth, 'Auth');

<Auth.Provider userId="u-42">...</Auth.Provider>  // ✅
<Auth.Provider>...</Auth.Provider>                // ❌ compile error: userId missing
<Auth.Provider userid="u-42">...</Auth.Provider>  // ❌ compile error: typo caught
```

### Composing multiple controller contexts

Each controller context is independent — nest Providers freely. A later Provider's controller can even consume an earlier one:

```tsx
const useCart = () => {
    const { userId } = Auth.use();   // controllers are hooks; they can use() other contexts
    return useCartForUser(userId);
};
const Cart = createControllerContext(useCart, 'Cart');

<Auth.Provider userId="u-42">
    <Cart.Provider>
        <Checkout />
    </Cart.Provider>
</Auth.Provider>
```

Nesting the *same* Provider twice follows normal React context rules: `use()` reads from the nearest one above.

### Testing components without running the real controller

The raw `context` lets tests inject a value directly, skipping the controller's state, effects, and network calls:

```tsx
render(
    <Counter.context.Provider value={{ count: 99, setCount: jest.fn() }}>
        <Display />
    </Counter.context.Provider>,
);
```

### React 19 escape hatch

On React 19 you can read the context with the native `use()`, including conditionally:

```tsx
const value = use(Counter.context);  // ⚠️ bypasses the missing-Provider guard
```

Prefer `Counter.use()` everywhere else — it's the one that throws a helpful error.

## Edge cases & gotchas

- **`children` is reserved.** The Provider keeps `children` for the React tree and forwards everything else, so a controller prop named `children` will never arrive. Name it something else (`items`, `nodes`, …).
- **Re-renders follow normal context rules.** Every `use()` consumer re-renders when the controller's return value changes identity. If your controller returns a fresh object each render, wrap it: `return React.useMemo(() => ({ count, setCount }), [count]);`
- **One props object, not positional arguments.** A controller like `useThing(initialValue?: string)` can't be wired to JSX props — there's no runtime mapping from prop names to parameter positions. Take `{ initialValue }: { initialValue?: string }` instead.
- **Minified error labels.** When `name` is omitted, the error/DevTools label falls back to the controller's runtime function name, which production minifiers may mangle. Pass an explicit `name` if you care about prod error messages.

## Migrating from 1.x

The 1.x export `createContextForController` was removed in 2.0.0.

```tsx
// 1.x
const ctx = createContextForController(useMyHook);
<ctx.Provider options={{ initialValue: '1234' }}>
const value = ctx.useController();

// 2.x
const MyThing = createControllerContext(useMyHook, 'MyThing');
<MyThing.Provider initialValue="1234">
const value = MyThing.use();
```

Key changes:

- Controllers must take a **single props object** (the 1.x `options` argument was untyped; provider props are now spread and fully typed by inference).
- The consumer hook is named `use` and **throws** outside a Provider instead of silently returning an empty object.
- An optional `name` powers error messages and DevTools.

## License

MIT
