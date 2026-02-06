# React Controller Context

Generate a React Context + Provider pair from any controller hook using `createContextBundle` — the recommended API. Zero boilerplate, full type inference, and runtime safety out of the box.

## Installation

```sh
npm install react-controller-context
```

Peer dependencies: `react` 18 or 19.

## Quick Start

### Simple controller (no props)

```tsx
import { createContextBundle } from 'react-controller-context';

const useCounter = () => {
    const [count, setCount] = React.useState(0);
    return { count, setCount };
};

const Counter = createContextBundle(useCounter, 'Counter');

const App = () => (
    <Counter.Provider>
        <Display />
    </Counter.Provider>
);

const Display = () => {
    const { count, setCount } = Counter.useContext();
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
```

### Controller with typed props

Props passed to the Provider are forwarded to your hook automatically. TypeScript infers the prop types from your hook's parameter.

```tsx
import { createContextBundle } from 'react-controller-context';

const useAuth = ({ initialUser }: { initialUser: string }) => {
    const [user, setUser] = React.useState(initialUser);
    return { user, setUser };
};

const Auth = createContextBundle(useAuth, 'Auth');

const App = () => (
    <Auth.Provider initialUser="Casey">
        <Profile />
    </Auth.Provider>
);

const Profile = () => {
    const { user } = Auth.useContext();
    return <span>{user}</span>;
};
```

## API Reference

### `createContextBundle(hook, name)` *(Recommended)*

The preferred way to create context from a controller hook. Creates a typed context, Provider, and consumer hook in one call.

**Parameters**

| Param | Type | Description |
|---|---|---|
| `hook` | `(props: P) => R` | A controller hook. Its return value becomes the context value. Its parameter type determines the Provider's props. |
| `name` | `string` | Display name used in React DevTools and error messages. |

**Returns** an object with:

| Key | Type | Description |
|---|---|---|
| `context` | `React.Context<R \| undefined>` | The raw React context (rarely needed directly). |
| `Provider` | `React.FC<PropsWithChildren<P>>` | Renders the provider. All non-`children` props are forwarded to `hook`. |
| `useContext` | `() => R` | Reads the context value. Throws if called outside the Provider. |

**Runtime safety** — `useContext()` throws a descriptive error when called outside its Provider, making misuse easy to spot during development.

### `createContextForController(hook)` *(Deprecated)*

The legacy API. Still exported for backwards compatibility, but `createContextBundle` is the recommended replacement. This API lacks typed provider props and runtime safety checks.

```tsx
import { createContextForController } from 'react-controller-context';

const ctx = createContextForController(useMyHook);
// ctx.Provider   — accepts `options` prop (untyped)
// ctx.useController() — returns the hook's value (no throw guard)
```

**All new code should use `createContextBundle`.** See the [migration section](#migration-from-createcontextforcontroller) below if you're upgrading.

## Migration from `createContextForController`

```tsx
// Before
const ctx = createContextForController(useMyHook);
<ctx.Provider options={{ initialFoo: 'bar' }}>
const value = ctx.useController();

// After
const Bundle = createContextBundle(useMyHook, 'MyFeature');
<Bundle.Provider initialFoo="bar">
const value = Bundle.useContext();
```

Key differences:
- `name` parameter is required (used for DevTools and error messages).
- Hook props are spread directly on the Provider instead of nested under `options`.
- `useContext()` throws when called outside the Provider.

## TypeScript

Both APIs are fully typed. `createContextBundle` infers the Provider's props and context value from your hook signature — no manual generics needed.

```tsx
// TypeScript infers Provider accepts { initialCount: number }
// and useContext() returns { count: number; increment: () => void }
const useCounter = ({ initialCount }: { initialCount: number }) => {
    const [count, setCount] = React.useState(initialCount);
    return { count, increment: () => setCount((c) => c + 1) };
};

const Counter = createContextBundle(useCounter, 'Counter');
```

## License

MIT
